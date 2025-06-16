import httpx, os
from dotenv import load_dotenv

API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL = os.getenv("OPENROUTER_MODEL")

def generate_manim_code(messages: list) -> str:
    load_dotenv()
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "X-Title": "Manim AI Generator"
    }
    print(MODEL)

    # Ensure system message is present
    if not any(m["role"] == "system" for m in messages):
        messages.insert(0, {
            "role": "system",
            "content": "You are a manim python code generator. Generate the python code with the following restrictions. Only return valid Manim Python code. Import everything used. Use from manim import *. Always define the scene in a class named GeneratedScene.Add voiceovers to the code using the `self.set_speech_service` method. Do not include any other text or explanations.using from manim_voiceover import VoiceoverScene from manim_voiceover.services.azure import AzureService "
        })

    data = {
        "model": MODEL,
        "messages": messages
    }

    print(f"Sending request to OpenRouter with model {MODEL} and messages: {messages}")

    try:
        response = httpx.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=data)
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(e)
        raise RuntimeError(f"OpenRouter error: {str(e)}")