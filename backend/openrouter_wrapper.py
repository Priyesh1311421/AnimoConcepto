import importlib
import os
import re
from pathlib import Path

SYSTEM_PROMPT = """
You are an expert Manim Python code generation engine.

Your sole responsibility is to generate executable Manim Community Edition Python source code.

STRICT OUTPUT REQUIREMENTS:

- Output ONLY raw Python code.
- Never output markdown.
- Never output triple backticks.
- Never output explanations.
- Never output notes.
- Never output comments directed to the user.
- Never output any text before or after the code.
- The response must be directly executable as a .py file.

MANIM REQUIREMENTS:

1. Always use:
   from manim import *

2. Always define:
   class GeneratedScene(Scene):

3. Put all animation logic inside:
   def construct(self):

4. Import every library used.

5. Generate complete code.
6. No TODOs.
7. No placeholders.
8. No natural language.
9. Never use Tex or MathTex. Use only Text().

FINAL RULE:

The entire response must be a single valid Python source file and nothing else.
"""


def _load_dotenv_file() -> None:
    dotenv_path = Path(__file__).with_name(".env")

    if not dotenv_path.exists():
        return

    for raw_line in dotenv_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()

        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)

        key = key.strip()
        value = value.strip().strip('"').strip("'")

        if key and key not in os.environ:
            os.environ[key] = value


def _normalize_scene_name(code: str) -> str:
    if "class GeneratedScene(Scene):" in code:
        return code

    code, _ = re.subn(
        r"class\s+\w+\s*\(\s*Scene\s*\)\s*:",
        "class GeneratedScene(Scene):",
        code,
        count=1,
    )

    return code


def _strip_markdown_fences(code: str) -> str:
    code = code.strip()

    if code.startswith("```"):
        code = re.sub(r"^```(?:python)?\s*", "", code)

    if code.endswith("```"):
        code = re.sub(r"\s*```$", "", code)

    return code.strip()


def generate_manim_code(messages: list) -> str:
    _load_dotenv_file()

    gemini_api_key = (
        os.getenv("GEMINI_API_KEY")
        or os.getenv("GOOGLE_API_KEY")
    )

    gemini_model = (
        os.getenv("GEMINI_MODEL")
        or os.getenv("GOOGLE_MODEL")
        or "gemini-2.0-flash"
    )

    if not gemini_api_key:
        raise RuntimeError(
            "Gemini API key not configured. Set GEMINI_API_KEY."
        )

    latest_user_message = next(
        (
            message
            for message in reversed(messages)
            if message.get("role") == "user"
        ),
        None,
    )

    if latest_user_message is None:
        raise RuntimeError("No user message found.")

    try:
        genai = importlib.import_module("google.generativeai")

        genai.configure(api_key=gemini_api_key)

        model = genai.GenerativeModel(
            model_name=gemini_model,
            system_instruction=SYSTEM_PROMPT,
        )

        chat = model.start_chat(history=[])

        response = chat.send_message(
            latest_user_message["content"]
        )

        print(response)
        code = getattr(response, "text", "")

        if not code:
            raise RuntimeError("Empty response from Gemini.")

        code = _strip_markdown_fences(code)
        code = _normalize_scene_name(code)

        if "from manim import *" not in code:
            raise RuntimeError(
                "Generated code is missing 'from manim import *'."
            )

        if "class GeneratedScene(Scene):" not in code:
            raise RuntimeError(
                "GeneratedScene class not found."
            )

        return code

    except Exception as e:
        raise RuntimeError(f"Gemini API error: {e}")