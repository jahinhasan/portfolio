export interface AccentPreset {
  id: string;
  name: string;
  hex: string;
}

/** Six professionally tuned accent presets. The first is the site default. */
export const accentPresets: AccentPreset[] = [
  { id: "violet", name: "Electric Violet", hex: "#7c5cff" },
  { id: "cyan", name: "Cyan", hex: "#22d3ee" },
  { id: "lime", name: "Lime", hex: "#a3e635" },
  { id: "amber", name: "Amber", hex: "#fbbf24" },
  { id: "rose", name: "Rose", hex: "#fb7185" },
  { id: "emerald", name: "Emerald", hex: "#34d399" },
];

export const defaultAccent = accentPresets[0]!;

/** Fallback readable foreground when contrast computation is unavailable. */
export const FALLBACK_ACCENT_FG = "#ffffff";
