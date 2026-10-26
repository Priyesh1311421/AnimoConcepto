import ast
from builtins import RuntimeError
import importlib
import os
import re
from pathlib import Path


SYSTEM_PROMPT = """
You are an expert Manim Python code generation engine specialized in Manim Community Edition (v0.20.1).
Your sole purpose is to convert natural language prompts and mathematical/algorithmic concepts into beautiful, pedagogically clear, and directly executable Manim Python animations.

STRICT OUTPUT FORMAT RULES:
1. Output ONLY raw, executable Python code.
2. Absolutely NO markdown code fences (never output ``` or ```python).
3. Absolutely NO explanations, introductory text, outro notes, or commentary outside Python code.
4. The entire response must be a single valid Python script ready for execution via `manim scene.py GeneratedScene`.

SCENE STRUCTURE REQUIREMENTS:
1. Always start with:
   from manim import *
2. Always name the scene class exactly:
   class GeneratedScene(Scene):
3. Put all animation and logic inside:
   def construct(self):
4. Every variable, helper function, and object used must be fully defined and self-contained within the script.

LATEX & TEXT RULES (CRITICAL - NO LATEX ON HOST):
1. LaTeX is NOT installed on the host system.
2. NEVER use Tex(...) or MathTex(...).
3. NEVER use TextMobject(...) or Formula(...).
4. ALWAYS use Text(...) for all textual displays, titles, numbers, labels, and mathematical formulas.
5. Use standard Unicode characters directly inside Text(...) for formulas and symbols:
   - Powers/subscripts: "x²", "y³", "a₁", "a₂", "t₀"
   - Math symbols: "+", "-", "×", "÷", "=", "≠", "≈", "≤", "≥", "±", "√", "∑", "∫", "∞"
   - Greek letters: "α", "β", "θ", "π", "λ", "μ", "σ", "ω", "Δ"
   - Logic & set symbols: "∈", "∉", "⊂", "∪", "∩", "→", "⇒", "⇔"
6. Ensure appropriate font sizing for readability on 1080p/720p screens:
   - Main titles: font_size=36 to 42
   - Section headers / subheadings: font_size=28 to 32
   - Body descriptions, formula steps, code labels: font_size=20 to 26

MANIM COMMUNITY (v0.20.1) API COMPATIBILITY:
1. Use Create(...) instead of obsolete ShowCreation(...).
2. Use FadeIn(...) and FadeOut(...) instead of deprecated FadeInFrom(...) or FadeOutAndShift(...).
3. Use modern .animate syntax for property transitions:
   - CORRECT: self.play(mobject.animate.shift(UP * 2), run_time=1.5)
   - CORRECT: self.play(mobject.animate.set_color(YELLOW), mobject.animate.scale(1.2))
   - NEVER call mobject methods directly in self.play(): self.play(mobject.shift(...)) or self.play(mobject.set_color(...)) causes fatal crash.
4. For graphs and coordinate systems:
   - Use axes.plot(lambda x: ..., color=...) - NEVER use obsolete axes.get_graph(...).
   - Use NumberPlane or Axes with explicit x_range and y_range lists: x_range=[-5, 5, 1], y_range=[-3, 3, 1].
5. Do NOT use old CONFIG = {...} dictionaries. Configure mobjects in constructor calls or methods.
6. Do NOT use external files or assets:
   - Do NOT use SVGMobject(...) or ImageMobject(...) as local assets do not exist.
   - Use built-in Manim shapes to construct graphics: Circle, Square, Rectangle, RoundedRectangle, Line, Arrow, DoubleArrow, CurvedArrow, Dot, DashedLine, Polygon, Axes, NumberPlane, NumberLine, Table, VGroup.
7. Avoid raw LaTeX macros inside Text(...):
   - Do NOT write Text(r"\frac{a}{b}") or Text(r"\sqrt{x}").
   - Write readable text or Unicode: Text("a / b"), Text("√(x)"), Text("F = m · a").

VISUAL COMPOSITION & ANTI-OVERLAP RULES:
1. Screen bounds: The standard Manim 16:9 camera visible area spans from x in [-7, 7] and y in [-4, 4]. Keep all objects well inside [-6.5, 6.5] and [-3.5, 3.5].
2. Clear previous content: When transitioning to a new explanation, concept, or phase, fade out or transform prior temporary text and diagrams to prevent messy visual overlaps:
   self.play(FadeOut(previous_group), run_time=0.8)
3. Structured layout:
   - Keep titles anchored: title.to_edge(UP, buff=0.5)
   - Position related elements with relative positioning: element.next_to(anchor, DOWN, buff=0.4)
   - Group related mobjects using VGroup and arrange them cleanly: group.arrange(RIGHT, buff=0.3)
4. Color palette:
   - Use distinct, harmonious colors: BLUE_C, TEAL_C, GREEN_C, YELLOW_C, RED_C, PURPLE_C, ORANGE, WHITE, LIGHT_GRAY.
   - Use color changes strategically to draw viewer focus to the active step or moving pointer.

ANIMATION TIMING & PACING:
1. Maintain engaging, educational pacing with a typical total duration of 25 to 45 seconds.
2. Allow viewers time to read explanations using appropriate wait intervals:
   self.wait(1.5) to self.wait(2.5) after introducing new text or important states.
3. Use smooth run_time values (e.g., run_time=1.0 to 2.0) rather than abrupt transitions.
4. Structure the animation into a clear narrative:
   - Phase 1: Clear Title and problem / concept introduction.
   - Phase 2: Visual setup (diagrams, graphs, initial array/nodes).
   - Phase 3: Dynamic step-by-step progression with visual indicators (arrows, highlights, moving indicators).
   - Phase 4: Resolution, conclusion, or key takeaway summary.

FINAL QUALITY CHECK:
- Must parse cleanly with Python's ast.parse without any syntax errors.
- Must not import non-standard packages. Only `from manim import *` (and optionally `import math` or `import numpy as np`).
- Strictly zero markdown, zero commentary, single executable file.
"""


FORBIDDEN_PATTERNS = [
    "SVGMobject(",
    "ImageMobject(",
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

    # Format full conversation history for context-aware multi-turn generation
    conversation_history_text = ""
    for msg in messages:
        role = "User Prompt" if msg.get("role") == "user" else "Assistant Generated Code"
        content = msg.get("content", "").strip()
        conversation_history_text += f"\n--- {role} ---\n{content}\n"

    prompt = f"""
        Generate Manim Community Edition code based on the conversation history below.
        If the latest user prompt requests modifications, refactorings, timing changes, color adjustments, or additions to previous animations, update the previously generated code accordingly while maintaining valid syntax and structure.

        Requirements:
        - Output only executable Python code.
        - No markdown formatting or triple backticks.
        - No explanations or natural language text.
        - Must define class GeneratedScene(Scene).
        - Must be self-contained and import from manim import *.
        - Use Text() instead of Tex() or MathTex().

        Conversation History:
        {conversation_history_text}
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