import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  STORAGE_KEY,
  defaultPreferences,
  loadPreferences,
  savePreferences,
  validatePreferences,
} from "@/features/customization/preferences";
import { projects } from "@/data/projects";
import { defaultProjectOrder } from "@/data/projects";
import { defaultSectionOrder } from "@/data/navigation";

const validPrefs = {
  version: 1,
  theme: "light",
  accent: "#22d3ee",
  sectionOrder: [...defaultSectionOrder],
  projectOrder: [...defaultProjectOrder],
  projectLayout: "list",
  featuredOverrides: { shopsync: true },
};

describe("validatePreferences", () => {
  it("accepts a valid record", () => {
    const result = validatePreferences(validPrefs);
    expect(result).not.toBeNull();
    expect(result?.theme).toBe("light");
    expect(result?.accent).toBe("#22d3ee");
    expect(result?.projectLayout).toBe("list");
    expect(result?.featuredOverrides).toEqual({ shopsync: true });
  });

  it("rejects non-objects", () => {
    expect(validatePreferences(null)).toBeNull();
    expect(validatePreferences("junk")).toBeNull();
    expect(validatePreferences([1, 2])).toBeNull();
  });

  it("rejects unknown schema versions", () => {
    expect(validatePreferences({ ...validPrefs, version: 99 })).toBeNull();
    expect(validatePreferences({ ...validPrefs, version: undefined })).toBeNull();
  });

  it("falls back per-field on invalid values", () => {
    const result = validatePreferences({
      ...validPrefs,
      theme: "sepia",
      accent: "not-a-color",
      projectLayout: "table",
      featuredOverrides: { shopsync: "yes", bogusProject: true, "snake-agent": false },
    });
    expect(result?.theme).toBe("light");
    expect(result?.accent).toBe("#6d4aff");
    expect(result?.projectLayout).toBe("grid");
    // Unknown project ids stripped; boolean checked.
    expect(result?.featuredOverrides).toEqual({ "snake-agent": false });
  });

  it("repairs partial or invalid orders", () => {
    const result = validatePreferences({
      ...validPrefs,
      sectionOrder: ["contact", "nope", "skills"],
      projectOrder: "invalid",
    });
    expect(result?.sectionOrder[0]).toBe("contact");
    expect(result?.sectionOrder).toHaveLength(defaultSectionOrder.length);
    expect(result?.projectOrder).toEqual(defaultProjectOrder);
  });
});

describe("load / save preferences", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("returns defaults when nothing is stored", () => {
    const { preferences, persisted } = loadPreferences();
    expect(persisted).toBe(false);
    expect(preferences).toEqual(defaultPreferences());
  });

  it("round-trips a saved record", () => {
    expect(savePreferences(validPrefs as never)).toBe(true);
    const { preferences, persisted } = loadPreferences();
    expect(persisted).toBe(true);
    expect(preferences.theme).toBe("light");
    expect(preferences.accent).toBe("#22d3ee");
  });

  it("falls back to defaults on corrupted JSON without throwing", () => {
    window.localStorage.setItem(STORAGE_KEY, "%%%");
    const { preferences, persisted } = loadPreferences();
    expect(persisted).toBe(false);
    expect(preferences).toEqual(defaultPreferences());
  });

  it("falls back to defaults when storage is blocked", () => {
    const boom = () => {
      throw new DOMException("Blocked");
    };
    const blocked = {
      length: 0,
      clear: boom,
      getItem: boom,
      key: () => null,
      removeItem: boom,
      setItem: boom,
    } as Storage;
    const real = Object.getOwnPropertyDescriptor(window, "localStorage");
    Object.defineProperty(window, "localStorage", { value: blocked, configurable: true });
    try {
      const { preferences, persisted } = loadPreferences();
      expect(persisted).toBe(false);
      expect(preferences).toEqual(defaultPreferences());
    } finally {
      if (real) Object.defineProperty(window, "localStorage", real);
    }
  });

  it("default preferences cover the full data catalog", () => {
    expect(defaultPreferences().projectOrder).toEqual(projects.map((p) => p.id));
    expect(defaultPreferences().accent).toBe("#6d4aff");
  });
});
