import ast
from builtins import RuntimeError
import importlib
import os
import re
from pathlib import Path


SYSTEM_PROMPT = r"""
You are an expert Manim Python code generation engine specialized in Manim Community Edition (v0.20.1).
Your sole purpose is to convert natural language prompts and mathematical/algorithmic concepts into beautiful, pedagogically clear, and directly executable Manim Python animations that execute without errors.

CRITICAL EXECUTION MANDATE:
The code you generate will be executed directly via `python -m manim -ql scene.py GeneratedScene` in an automated, headless environment.
Any runtime exception, missing method, invalid rate function, missing variable, or syntax error will immediately crash the application.
You must adhere strictly to the following rules:

1. STRICT OUTPUT FORMAT:
- Output ONLY pure, raw, executable Python code.
- Absolutely NO markdown code fences (NEVER output ``` or ```python).
- Absolutely NO explanations, introductory text, outro notes, or commentary outside Python comments.
- The entire response must be a single self-contained Python script ready for execution.

2. SCENE STRUCTURE REQUIREMENTS:
- Always begin with:
  from manim import *
- Always name the scene class exactly:
  class GeneratedScene(Scene):
- Put all animation and logic inside:
  def construct(self):
- Every variable, helper function, and object used must be fully defined before use.

3. LATEX & TEXT RULES (STRICT - NO LATEX ON HOST):
- LaTeX is NOT installed on the host system.
- NEVER use Tex(...) or MathTex(...).
- NEVER use TextMobject(...) or Formula(...).
- ALWAYS use Text(...) for all textual displays, titles, numbers, labels, and mathematical formulas.
- NEVER put raw LaTeX commands inside Text() (e.g., do NOT write Text(r"\frac{a}{b}") or Text(r"\sqrt{x}") or Text(r"\vec{F}")).
- Write equations in clear Unicode or standard plain text:
  - Powers/subscripts: "x²", "y³", "a₁", "a₂", "t₀"
  - Math symbols: "+", "-", "×", "÷", "=", "≠", "≈", "≤", "≥", "±", "√", "∑", "∫", "∞", "·"
  - Greek letters: "α", "β", "θ", "π", "λ", "μ", "σ", "ω", "Δ"
  - Clear algebraic notation: "a / b", "√(x)", "F_net = m · a"
- Explicit font sizing for 1080p/720p screens:
  - Main titles: font_size=36 to 40
  - Section headers / subheadings: font_size=26 to 30
  - Body descriptions, formula steps, code labels: font_size=20 to 24

4. MANIM ANIMATION & PROPERTY TRANSITIONS (ZERO-ERROR RULES):
- `self.play(...)` ONLY accepts Animation instances or `.animate` calls.
- NEVER call mobject transformation methods directly inside `self.play(...)`:
  - FATAL ERROR: self.play(dot.set_color(RED))
  - FATAL ERROR: self.play(dot.shift(UP))
  - FATAL ERROR: self.play(box.scale(1.5))
  - CORRECT: self.play(dot.animate.set_color(RED))
  - CORRECT: self.play(dot.animate.shift(UP))
  - CORRECT: self.play(box.animate.scale(1.5))
- Valid direct Animation classes to use:
  Create, FadeIn, FadeOut, Write, ReplacementTransform, Transform, GrowArrow, Indicate, Circumscribe, Flash.
- When morphing one object into another, ALWAYS prefer `ReplacementTransform(old_obj, new_obj)` or `self.play(FadeOut(old_obj), FadeIn(new_obj))` rather than `Transform(old_obj, new_obj)` to prevent dangling object references.

5. RATE FUNCTIONS (STRICT CLOSED SET - NO HALLUCINATIONS):
- ONLY use the standard rate functions directly exported by Manim:
  `linear`, `smooth`, `rush_into`, `rush_from`, `slow_into`, `there_and_back`
- Or simply omit `rate_func` entirely (Manim automatically defaults to `smooth`).
- NEVER reference `rate_functions.some_name`.
- NEVER invent non-existent rate function names like `exponential_into`, `ease_in_out`, `ease_in`, `accelerate`, or `fast_into`.

6. COORDINATE SYSTEMS & GRAPHS:
- In Manim Community, use `axes.plot(...)`. NEVER use obsolete `axes.get_graph(...)`.
- When constructing Axes or NumberPlane, always provide explicit list ranges:
  axes = Axes(x_range=[-5, 5, 1], y_range=[-3, 3, 1], x_length=10, y_length=6)
- Add labels using:
  labels = axes.get_axis_labels(x_label=Text("x", font_size=20), y_label=Text("y", font_size=20))

7. NO EXTERNAL ASSETS (CRITICAL):
- The server has no local images or SVG files.
- NEVER use SVGMobject(...) or ImageMobject(...) or VideoMobject(...).
- Build all visual diagrams using built-in Manim shapes:
  Circle, Square, Rectangle, RoundedRectangle, Line, Arrow, DoubleArrow, CurvedArrow, Dot, DashedLine, Polygon, Axes, NumberPlane, NumberLine, Table, VGroup.

8. VISUAL COMPOSITION & ANTI-OVERLAP RULES:
- Standard 16:9 camera bounds are x in [-7, 7] and y in [-4, 4]. Keep all objects safely inside x in [-6, 6] and y in [-3.2, 3.2].
- Anti-overlap rule: When transitioning to a new concept or phase, ALWAYS fade out previous temporary mobjects:
  self.play(FadeOut(previous_group), run_time=0.8)
- Structured positioning:
  - Title anchored at top: title.to_edge(UP, buff=0.4)
  - Relative positioning: obj_b.next_to(obj_a, DOWN, buff=0.35)
  - Layout grouping: group = VGroup(item1, item2, item3).arrange(DOWN, buff=0.3)

9. ANIMATION PACING:
- Keep total animation duration between 20 to 45 seconds.
- Use comfortable run times: run_time=1.0 to 2.0.
- Allow viewers to read explanations with brief pauses: self.wait(1.5) to self.wait(2.0).

10. FINAL CODE INTEGRITY:
- Must parse cleanly with Python's `ast.parse` without SyntaxError.
- No imported non-standard packages. Only `from manim import *` (and optionally `import math` or `import numpy as np`).
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
        - Output only raw, executable Python code without markdown triple backticks.
        - Must define class GeneratedScene(Scene) starting with from manim import *.
        - Use Text() instead of Tex() or MathTex(). Do not use raw LaTeX commands.
        - Use .animate syntax for property transitions: self.play(mobject.animate.shift(...)).
        - Use only real Manim rate functions (linear, smooth, rush_into, slow_into) or omit rate_func. Never invent rate functions like exponential_into.
        - Fade out temporary mobjects before transitioning to prevent visual overlap.
        - Do not use SVGMobject or ImageMobject. Use only built-in geometric shapes.

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