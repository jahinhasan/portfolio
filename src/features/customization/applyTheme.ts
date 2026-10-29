import type { ThemeMode } from "@/types";
import { FALLBACK_ACCENT_FG } from "@/data/theme";
import { hexToRgb, readableForeground } from "@/lib/color";

/**
 * Side-effect module: reflect theme state onto <html> so CSS custom
 * properties and color-scheme stay in sync with the visitor's choices.
 */

export function applyDocumentTheme(mode: ThemeMode): void {
  const root = document.documentElement;
  root.dataset.theme = mode;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", mode === "dark" ? "#0a0b0f" : "#f5f5f8");
}

export function applyAccent(hex: string): void {
  const root = document.documentElement;
  const rgb = hexToRgb(hex);
  if (!rgb) return;
  root.style.setProperty("--accent", hex);
  root.style.setProperty("--accent-fg", readableForeground(hex) ?? FALLBACK_ACCENT_FG);
}
