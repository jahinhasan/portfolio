export interface AccentPreset {
  id: string;
  name: string;
  hex: string;
}

/** Six accent presets. The acid-lime house accent leads; the rest are alternatives. */
export const accentPresets: AccentPreset[] = [
  { id: "lime", name: "Acid Lime", hex: "#c8f04d" },
  { id: "cyan", name: "Cyan", hex: "#22d3ee" },
  { id: "amber", name: "Amber", hex: "#fbbf24" },
  { id: "magenta", name: "Magenta", hex: "#f472b6" },
  { id: "violet", name: "Violet", hex: "#a78bfa" },
  { id: "coral", name: "Coral", hex: "#fb7185" },
];

export const defaultAccent = accentPresets[0]!;

/** Fallback readable foreground when contrast computation is unavailable. */
export const FALLBACK_ACCENT_FG = "#ffffff";
