/**
 * Accent-color helpers: hex validation, contrast-safe foreground selection.
 * Pure functions so they are directly unit-testable.
 */

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

export function isHexColor(value: string): boolean {
  return HEX_RE.test(value.trim());
}

/** Normalize shorthand (#abc) to six-digit form; null when invalid. */
export function normalizeHex(value: string): string | null {
  const v = value.trim();
  if (!isHexColor(v)) return null;
  const hex = v.toLowerCase();
  if (hex.length === 4) {
    const [hash, r, g, b] = hex;
    return `${hash}${r}${r}${g}${g}${b}${b}`;
  }
  return hex;
}

interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): Rgb | null {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  };
}

/** WCAG 2.x relative luminance of a hex color. */
export function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

/** WCAG contrast ratio between two hex colors. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Pick the readable foreground (white or near-black) for an accent color.
 * Used so custom accent colors never produce unreadable button labels.
 */
export function readableForeground(accentHex: string): string {
  const white = contrastRatio(accentHex, "#ffffff");
  const black = contrastRatio(accentHex, "#101014");
  return white >= black ? "#ffffff" : "#101014";
}
