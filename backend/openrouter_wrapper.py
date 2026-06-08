import ast
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
11. Do not use external images, files, assets, APIs, or dependencies.
12. The video generated should be atleast 30sec long
13. The video should not have any overlapping text or object

FINAL RULE:

The entire response must be a single valid Python source file and nothing else.
"""


FORBIDDEN_PATTERNS = [
    "SVGMobject(",
]


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


def _strip_markdown_fences(code: str) -> str:
    code = code.strip()

    if code.startswith("```"):
        code = re.sub(r"^```(?:python)?\s*", "", code)

    if code.endswith("```"):
        code = re.sub(r"\s*```$", "", code)

    return code.strip()


def _extract_python_source(code: str) -> str:
    idx = code.find("from manim import *")

    if idx != -1:
        return code[idx:].strip()

    return code.strip()


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


def _validate_generated_code(code: str) -> None:
    try:
        ast.parse(code)
    except SyntaxError as e:
        raise RuntimeError(
            f"Generated invalid Python code: {e}"
        )

    for pattern in FORBIDDEN_PATTERNS:
        if pattern in code:
            raise RuntimeError(
                f"Forbidden Manim construct detected: {pattern}"
            )

    if "from manim import *" not in code:
        raise RuntimeError(
            "Generated code is missing 'from manim import *'."
        )

    if "class GeneratedScene(Scene):" not in code:
        raise RuntimeError(
            "GeneratedScene class not found."
        )

    compile(code, "<generated>", "exec")


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
        raise RuntimeError(
            "No user message found."
        )

    task = latest_user_message["content"]

    prompt = f"""
        Generate Manim code for the following task.

        Requirements:
        - Output only executable Python code.
        - No markdown.
        - No explanations.
        - No prose.
        - No backticks.
        - Must define class GeneratedScene(Scene).
        - Must be self-contained.
        - No external assets.

        Task:
        {task}
    """

    try:
        genai = importlib.import_module(
            "google.generativeai"
        )

        genai.configure(
            api_key=gemini_api_key
        )

        model = genai.GenerativeModel(
            model_name=gemini_model,
            system_instruction=SYSTEM_PROMPT,
        )

        response = model.generate_content(
            prompt
        )
        print(response)
        code = getattr(response, "text", "")

        if not code:
            raise RuntimeError(
                "Empty response from Gemini."
            )

        code = _strip_markdown_fences(code)
        code = _extract_python_source(code)
        code = _normalize_scene_name(code)

        _validate_generated_code(code)

        return code

    except Exception as e:
        raise RuntimeError(
            f"Gemini API error: {e}"
        )