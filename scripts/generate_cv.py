#!/usr/bin/env python3
"""Generate a placeholder CV PDF from the portfolio's profile data.

Produces a valid single-page A4 PDF using only the standard-14 Helvetica
fonts (no dependencies). Replace public/documents/Md_Jahin_Hasan_CV.pdf
with your official signed CV when ready — the Download CV button points
at that path.

Usage: python3 scripts/generate_cv.py
"""

from __future__ import annotations

import zlib
from pathlib import Path

PAGE_W, PAGE_H = 595.28, 841.89  # A4 in points
MARGIN = 48
CONTENT_W = PAGE_W - 2 * MARGIN

ACCENT = (0.427, 0.29, 1.0)     # #6d4aff
INK = (0.09, 0.10, 0.13)
MUTED = (0.36, 0.38, 0.44)
LINE = (0.82, 0.83, 0.86)

NAME = "MD. JAHIN HASAN"
ROLE = "Software Developer — Web Development & Automation"
CONTACT = "Rangpur, Bangladesh  ·  jahinhasan01@gmail.com  ·  +880 1783-839992  ·  github.com/jahinhasan"

SUMMARY = (
    "CSE undergraduate at Bangladesh Army University of Science and Technology (BAUST), "
    "Rangpur. Builds web applications end to end and writes automation tooling for repetitive "
    "work, with working knowledge of backend systems, networking, and applied machine learning. "
    "Seeking internship opportunities."
)

EDUCATION = [
    (
        "B.Sc. in Computer Science and Engineering",
        "Bangladesh Army University of Science and Technology (BAUST), Rangpur — in progress",
    )
]

PROJECTS = [
    (
        "ShopSync — multi-vendor e-commerce marketplace",
        "Laravel  ·  PHP 8.3  ·  MySQL  ·  Tailwind CSS  ·  Laravel Reverb  ·  Pest",
        "Storefront, shop onboarding with admin moderation, per-item order lifecycle, realtime "
        "buyer-seller chat over WebSockets, inventory audit trail, bKash/Nagad payment "
        "verification, loyalty points and vouchers.",
    ),
    (
        "SmartRoute Lab — network routing simulator",
        "Python  ·  Pydantic  ·  scikit-learn  ·  Streamlit  ·  pytest  ·  GitHub Actions",
        "Hand-written Dijkstra cross-checked against NetworkX; seeded simulation with link "
        "failures; leakage-controlled ML experiment with published, honest results; CI with "
        "ruff and pytest on Python 3.12/3.14.",
    ),
    (
        "APRS — payment recovery digital twin",
        "Python  ·  FastAPI  ·  PostgreSQL  ·  SQLAlchemy  ·  XGBoost  ·  React  ·  Docker",
        "Event-driven platform reconstructing failed payments, scoring recovery risk with ML, "
        "and executing deterministic policy decisions behind a fresh-evidence safety gate on "
        "an append-only audit log.",
    ),
    (
        "Snake Agent — deep reinforcement learning",
        "Python  ·  PyTorch  ·  NumPy  ·  pygame",
        "DQN-style agent (100k training episodes) compared against A* and graph-search "
        "baselines with a seeded benchmark CLI; trained model and history in-repo.",
    ),
    (
        "Web Scraper Tool & PDF Merger — desktop automation",
        "Python  ·  Tkinter  ·  requests  ·  BeautifulSoup4  ·  pandas  ·  pypdf",
        "Threaded GUI scraper with configurable CSS selector rules, rate limiting, retries "
        "with backoff, and CSV/JSON/Excel export; local-first PDF merge/split/rotate/encrypt "
        "tool with a non-blocking UI.",
    ),
    (
        "Team Infinity — vision-guided competition rover",
        "Python  ·  YOLOv5  ·  OpenCV  ·  PySerial  ·  C++ (Arduino)",
        "Real-time object detection feeding steering commands to an Arduino rover; ultrasonic "
        "obstacle-avoidance firmware as a hardware safety layer. 2nd Runner-Up, Line Follower "
        "Robot Competition, UIU CSE Fest 2025.",
    ),
]

SKILLS = [
    ("Languages", "Python, TypeScript, JavaScript, PHP, Dart, SQL, C++ (Arduino)"),
    ("Web", "React, Laravel, FastAPI, Tailwind CSS, Three.js, WebSockets, REST APIs"),
    ("Data", "MySQL, PostgreSQL, SQLite, SQLAlchemy/Alembic, Cloud Firestore, pandas"),
    ("AI/ML", "PyTorch, scikit-learn, XGBoost, YOLOv5 + OpenCV, evaluation methodology"),
    ("Tooling", "Git/GitHub, GitHub Actions CI, Docker, pytest/Pest/Vitest, Linux, Nginx/Caddy"),
]

FOOTER = "Placeholder CV generated for the portfolio build - replace with your official CV document."


WINANSI = {
    "—": "\x97",  # em dash
    "–": "\x96",  # en dash
    "‘": "\x91",
    "’": "\x92",
    "“": "\x93",
    "”": "\x94",
    "•": "\x95",
}


def esc(text: str) -> str:
    for src, dst in WINANSI.items():
        text = text.replace(src, dst)
    return text.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")


def wrap(text: str, width_chars: int) -> list[str]:
    words, lines, current = text.split(), [], ""
    for w in words:
        candidate = f"{current} {w}".strip()
        if len(candidate) <= width_chars:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = w
    if current:
        lines.append(current)
    return lines


def build_content() -> str:
    """Layout with a simple cursor; returns the PDF content stream."""
    parts: list[str] = []
    y = PAGE_H - MARGIN

    def set_color(rgb):
        parts.append(f"{rgb[0]:.3f} {rgb[1]:.3f} {rgb[2]:.3f} rg")

    def text(x: float, size: float, font: str, s: str):
        parts.append(f"BT /{font} {size:.1f} Tf {x:.2f} {y:.2f} Td ({esc(s)}) Tj ET")

    def hline(color=LINE, weight=0.75):
        parts.append(f"{color[0]:.3f} {color[1]:.3f} {color[2]:.3f} RG {weight} w")
        parts.append(f"{MARGIN} {y:.2f} m {PAGE_W - MARGIN} {y:.2f} l S")

    # Header
    set_color(INK)
    y -= 22
    text(MARGIN, 21, "F2", NAME)
    set_color(ACCENT)
    y -= 17
    text(MARGIN, 10.5, "F3", ROLE)
    set_color(MUTED)
    y -= 14
    text(MARGIN, 9, "F1", CONTACT)
    y -= 10
    hline()
    y -= 18

    def section(title: str):
        nonlocal y
        set_color(ACCENT)
        y -= 6
        text(MARGIN, 10.5, "F2", title.upper())
        y -= 16

    def para(s: str, size=9.2, leading=12.6, chars=105, indent=0.0, font="F1", color=MUTED):
        nonlocal y
        set_color(color)
        for line in wrap(s, chars):
            text(MARGIN + indent, size, font, line)
            y -= leading

    set_color(INK)
    para(SUMMARY, color=INK, size=9.4)
    y -= 8

    section("Education")
    for degree, detail in EDUCATION:
        set_color(INK)
        para(degree, font="F2", color=INK, chars=110)
        y += 12.6  # tighten: detail follows immediately
        para(detail)
        y -= 6

    section("Selected projects")
    for name, stack, desc in PROJECTS:
        set_color(INK)
        para(name, font="F2", color=INK, chars=110, size=9.4)
        y += 12.6
        set_color(ACCENT)
        para(stack, size=8.4, leading=11.5, chars=115, color=ACCENT)
        y += 11.5
        para(desc, size=9.0, leading=12.0, chars=112)
        y -= 6

    section("Skills")
    for label, body in SKILLS:
        set_color(INK)
        para(f"{label}:  ", font="F2", color=INK, chars=110, size=9.2)
        # Inline continuation: draw value text right after the label.
        label_w = len(f"{label}:  ") * 9.2 * 0.52
        parts.pop()  # replace label-only line with combined layout below
        y += 12.6
        set_color(INK)
        parts.append(f"BT /F2 9.2 Tf {MARGIN:.2f} {y:.2f} Td ({esc(label + ':')}) Tj ET")
        set_color(MUTED)
        value_lines = wrap(body, 95)
        parts.append(f"BT /F1 9.2 Tf {MARGIN + label_w:.2f} {y:.2f} Td ({esc(value_lines[0])}) Tj ET")
        y -= 12.6
        for extra in value_lines[1:]:
            parts.append(f"BT /F1 9.2 Tf {MARGIN + label_w:.2f} {y:.2f} Td ({esc(extra)}) Tj ET")
            y -= 12.6
        y -= 1

    y -= 2
    hline()
    y -= 12
    set_color(MUTED)
    text(MARGIN, 7.5, "F1", FOOTER)

    return "\n".join(parts)


def build_pdf(content: str) -> bytes:
    compress = zlib.compress(content.encode("latin-1"), 9)
    objects: list[bytes] = []

    def obj(body: bytes) -> None:
        objects.append(body)

    n_content = 1
    n_fonts_first = 2
    # 1: content, 2-4: fonts, 5: page, 6: pages, 7: catalog
    obj(b"<< /Length %d /Filter /FlateDecode >>\nstream\n%s\nendstream" % (len(compress), compress))
    for basefont, fontfile in (
        (b"Helvetica", b"F1"),
        (b"Helvetica-Bold", b"F2"),
        (b"Helvetica-Oblique", b"F3"),
    ):
        obj(
            b"<< /Type /Font /Subtype /Type1 /BaseFont /%s /Encoding /WinAnsiEncoding >>"
            % basefont
        )
    obj(
        (
            "<< /Type /Page /Parent 6 0 R /MediaBox [0 0 %.2f %.2f] "
            "/Resources << /Font << /F1 2 0 R /F2 3 0 R /F3 4 0 R >> >> "
            "/Contents %d 0 R >>" % (PAGE_W, PAGE_H, n_content)
        ).encode()
    )
    obj(b"<< /Type /Pages /Kids [5 0 R] /Count 1 >>")
    obj(b"<< /Type /Catalog /Pages 6 0 R >>")

    out = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
    offsets = [0]
    for i, body in enumerate(objects, start=1):
        offsets.append(len(out))
        out += b"%d 0 obj\n" % i + body + b"\nendobj\n"
    xref_pos = len(out)
    out += b"xref\n0 %d\n" % (len(objects) + 1)
    out += b"0000000000 65535 f \n"
    for off in offsets[1:]:
        out += b"%010d 00000 n \n" % off
    out += (
        b"trailer\n<< /Size %d /Root 7 0 R >>\nstartxref\n%d\n%%%%EOF\n"
        % (len(objects) + 1, xref_pos)
    )
    return bytes(out)


def main() -> None:
    content = build_content()
    pdf = build_pdf(content)
    out = Path(__file__).resolve().parent.parent / "public" / "documents" / "Md_Jahin_Hasan_CV.pdf"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(pdf)
    print(f"wrote {out} ({len(pdf)} bytes)")


if __name__ == "__main__":
    main()
