from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from bson import ObjectId
from dotenv import load_dotenv
from typing import Optional, List
import os
import subprocess
import re
import sys

from auth import hash_password, verify_password, create_access_token, decode_token
from openrouter_wrapper import generate_manim_code

# Load environment variables
load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB
client = AsyncIOMotorClient(os.getenv("MONGO_URL"))
db = client["manim_ai"]

# ----- Models -----
class Prompt(BaseModel):
    prompt: str
    conversation_id: str

class User(BaseModel):
    email: str
    password: str

class ConversationCreate(BaseModel):
    title: Optional[str] = "Untitled Conversation"

class ConversationOut(BaseModel):
    id: str
    title: str
    created_at: datetime

class PromptOut(BaseModel):
    id: str
    prompt: str
    video_url: str
    created_at: datetime

# ----- Helpers -----
def extract_code_block(llm_output: str) -> str:
    match = re.search(r"```python(.*?)```", llm_output, re.DOTALL)
    return match.group(1).strip() if match else llm_output.strip()


def _replace_tex_with_text(code: str) -> str:
    """Replace manim Tex(...) with Text(...) to avoid requiring LaTeX.

    This is a pragmatic fallback for environments without a TeX installation.
    It does a simple token replacement and preserves the inner content.
    """
    # Replace class calls like Tex("..."), Tex(r"..."), Tex('...')
    return re.sub(r"\bTex\s*\(", "Text(", code)

async def get_user(authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]
        payload = decode_token(token)
        user = await db.users.find_one({"_id": ObjectId(payload["user_id"])});
        if not user:
            raise Exception()
        return user
    except:
        raise HTTPException(401, "Invalid or missing token")

# ----- Auth Routes -----
@app.post("/register")
async def register(email: str, password: str):
    if await db.users.find_one({"email": email}):
        raise HTTPException(400, "Email already registered")
    await db.users.insert_one({"email": email, "hashed_password": hash_password(password)})
    return {"status": "registered"}

@app.post("/login")
async def login(email: str, password: str):
    print(email)
    print(password)
    user = await db.users.find_one({"email": email})
    print(user["hashed_password"])
    if not user or not verify_password(password, user["hashed_password"]):
        raise HTTPException(401, "Invalid credentials")
    token = create_access_token({"user_id": str(user["_id"])});
    return {"access_token": token}

# ----- Conversation Management -----
@app.post("/conversations", response_model=ConversationOut)
async def create_conversation(data: ConversationCreate, user=Depends(get_user)):
    title = data.title or "Untitled Conversation"
    conversation = {
        "user_id": user["_id"],
        "title": title,
        "created_at": datetime.utcnow()
    }
    result = await db.conversations.insert_one(conversation)
    return ConversationOut(id=str(result.inserted_id), title=title, created_at=conversation["created_at"])

@app.get("/conversations", response_model=List[ConversationOut])
async def get_conversations(user=Depends(get_user)):
    conversations = await db.conversations.find({"user_id": user["_id"]}).to_list(length=100)
    return [ConversationOut(id=str(c["_id"]), title=c["title"], created_at=c["created_at"]) for c in conversations]

@app.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str, user=Depends(get_user)):
    await db.prompts.delete_many({"conversation_id": ObjectId(conversation_id), "user_id": user["_id"]})
    result = await db.conversations.delete_one({"_id": ObjectId(conversation_id), "user_id": user["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(404, "Conversation not found")
    return {"status": "deleted"}

@app.get("/conversations/{conversation_id}/prompts", response_model=List[PromptOut])
async def get_prompts(conversation_id: str, user=Depends(get_user)):
    prompts = await db.prompts.find({
        "conversation_id": ObjectId(conversation_id),
        "user_id": user["_id"]
    }).sort("created_at", 1).to_list(length=100)

    return [
        PromptOut(
            id=str(p["_id"]),
            prompt=p["prompt"],
            video_url=f"/video/{p['_id']}",
            created_at=p["created_at"]
        ) for p in prompts
    ]

# ----- Generation Endpoint -----
@app.post("/generate")
async def generate(prompt: Prompt, user=Depends(get_user)):
    user_id = str(user["_id"])

    # Validate conversation
    convo = await db.conversations.find_one({"_id": ObjectId(prompt.conversation_id), "user_id": user["_id"]})
    if not convo:
        raise HTTPException(404, "Conversation not found")

    scenes_dir = os.path.abspath(f"scenes/{user_id}")
    media_dir = os.path.abspath(f"media/{user_id}")
    os.makedirs(scenes_dir, exist_ok=True)
    os.makedirs(media_dir, exist_ok=True)

    scene_filename = "scene.py"
    script_path = os.path.join(scenes_dir, scene_filename)
    scene_name = "GeneratedScene"
    video_output_dir = os.path.join(media_dir, "videos","scene","480p15")
    os.makedirs(video_output_dir, exist_ok=True)
    video_path = os.path.join(video_output_dir, f"{scene_name}.mp4")
    log_path = os.path.join(media_dir, "render.log")

    try:
        # Get previous prompts in order (acts like message history)
        history_cursor = db.prompts.find({
            "conversation_id": ObjectId(prompt.conversation_id),
            "user_id": user["_id"]
        }).sort("created_at", 1)

        history = await history_cursor.to_list(length=100)

        # Format previous messages as chat history
        conversation = [{"role": p["role"], "content": p["prompt"]} for p in history]

        # Append the current prompt
        conversation.append({"role": "user", "content": prompt.prompt})

        # Add the system message if needed (enforced in generate_manim_code)
        code = extract_code_block(generate_manim_code(conversation))

        scene_name = "GeneratedScene"
        if f"class {scene_name}" not in code:
            raise HTTPException(500, f"Generated code must contain 'class {scene_name}'")

        # fallback: if generated code uses Tex(...) and no LaTeX is available,
        # replace Tex with Text to avoid runtime FileNotFoundError from pdflatex.
        safe_code = _replace_tex_with_text(code)

        with open(script_path, "w") as f:
            f.write(safe_code)

        with open(log_path, "w") as log_file:
            subprocess.run(
                [sys.executable, "-m", "manim", "-ql", script_path, scene_name, "--media_dir", media_dir],
                stdout=log_file,
                stderr=log_file,
                check=True
            )
        
        result = await db.prompts.insert_one({
            "prompt": prompt.prompt,
            "role":"user",
            "user_id": user["_id"],
            "conversation_id": ObjectId(prompt.conversation_id),
            "video_path": video_path,
            "scene_name": scene_name,
            "script_path": script_path,
            "created_at": datetime.utcnow()
        })

        await db.prompts.insert_one({
            "prompt": code,
            "role":"assistant",
            "user_id": user["_id"],
            "conversation_id": ObjectId(prompt.conversation_id),
            "video_path": video_path,
            "scene_name": scene_name,
            "script_path": script_path,
            "created_at": datetime.utcnow()
        })

        return {
            "status": "rendered",
            "video_url": f"/video/{result.inserted_id}",
            "scene": scene_name
        }

    except subprocess.CalledProcessError:
        raise HTTPException(500, f"Render failed. See log at: {log_path}")
    except Exception as e:
        raise HTTPException(500, str(e))

# ----- Serve Video -----
@app.get("/video/{prompt_id}")
async def serve_video(prompt_id: str, user=Depends(get_user)):
    try:
        entry = await db.prompts.find_one({"_id": ObjectId(prompt_id)})
        print(entry)
        if entry and os.path.exists(entry["video_path"]):
            return FileResponse(entry["video_path"], media_type="video/mp4")
        raise HTTPException(404, "Video not found")
    except:
        raise HTTPException(404, "Invalid ID or video not found")
