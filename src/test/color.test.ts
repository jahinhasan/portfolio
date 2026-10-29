import { describe, expect, it } from "vitest";
import {
  contrastRatio,
  hexToRgb,
  isHexColor,
  normalizeHex,
  readableForeground,
  relativeLuminance,
} from "@/lib/color";
import { accentPresets } from "@/data/theme";

describe("isHexColor / normalizeHex", () => {
  it("accepts 3- and 6-digit hex", () => {
    expect(isHexColor("#abc")).toBe(true);
    expect(isHexColor("#a1b2c3")).toBe(true);
    expect(isHexColor("#A1B2C3")).toBe(true);
  });

  it("rejects malformed values", () => {
    expect(isHexColor("")).toBe(false);
    expect(isHexColor("7c5cff")).toBe(false); // no hash
    expect(isHexColor("#a1b2c")).toBe(false);
    expect(isHexColor("#xyzxyz")).toBe(false);
    expect(isHexColor("#a1b2c3ff")).toBe(false); // no 8-digit support
  });

  it("normalizes shorthand to six digits", () => {
    expect(normalizeHex("#7c5cff")).toBe("#7c5cff");
    expect(normalizeHex("#FFF")).toBe("#ffffff");
    expect(normalizeHex(" nope ")).toBeNull();
  });
});

describe("luminance and contrast", () => {
  it("computes known luminances", () => {
    expect(relativeLuminance("#000000")).toBeCloseTo(0);
    expect(relativeLuminance("#ffffff")).toBeCloseTo(1);
  });

  it("black vs white contrast is 21", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0);
  });

  it("is symmetric", () => {
    expect(contrastRatio("#7c5cff", "#ffffff")).toBeCloseTo(contrastRatio("#ffffff", "#7c5cff"));
  });
});

describe("readableForeground", () => {
  it("picks dark text on light accents", () => {
    for (const light of ["#fbbf24", "#a3e635", "#34d399", "#22d3ee"]) {
      expect(readableForeground(light), light).toBe("#101014");
    }
  });

  it("picks white text on clearly dark accents", () => {
    for (const dark of ["#1d4ed8", "#4338ca", "#6d28d9", "#0f766e"]) {
      expect(readableForeground(dark), dark).toBe("#ffffff");
    }
  });

  it("always picks the higher-contrast side", () => {
    const samples = ["#7c5cff", "#6d4aff", "#22d3ee", "#a3e635", "#fbbf24", "#fb7185", "#34d399", "#123456", "#f0f0f0", "#808080"];
    for (const accent of samples) {
      const chosen = readableForeground(accent);
      const white = contrastRatio(accent, "#ffffff");
      const black = contrastRatio(accent, "#101014");
      const best = white >= black ? "#ffffff" : "#101014";
      expect(chosen, accent).toBe(best);
    }
  });

  it("every shipped preset reaches WCAG AA (4.5:1) with its foreground", () => {
    for (const preset of accentPresets) {
      const fg = readableForeground(preset.hex);
      expect(contrastRatio(preset.hex, fg), preset.name).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("returns a sane fallback for garbage input", () => {
    expect(readableForeground("not-a-color")).toBe("#ffffff");
  });
});

describe("hexToRgb", () => {
  it("parses channels", () => {
    expect(hexToRgb("#7c5cff")).toEqual({ r: 124, g: 92, b: 255 });
    expect(hexToRgb("#000")).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb("bad")).toBeNull();
  });
});
