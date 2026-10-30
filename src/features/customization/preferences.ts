import type { Preferences, ThemeMode } from "@/types";
import { isHexColor } from "@/lib/color";
import { resolveProjectOrder, resolveSectionOrder } from "@/lib/ordering";
import { readJson, removeKey, writeJson } from "@/lib/storage";
import { projects } from "@/data/projects";
import { defaultAccent } from "@/data/theme";

export const STORAGE_KEY = "jh-portfolio-prefs";
export const PREFERENCES_VERSION = 1 as const;

const THEMES: readonly ThemeMode[] = ["dark", "light"];
const LAYOUTS = ["grid", "list"] as const;
const PROJECT_IDS = new Set(projects.map((p) => p.id));

export function defaultPreferences(): Preferences {
  return {
    version: PREFERENCES_VERSION,
    theme: "dark",
    accent: defaultAccent.hex,
    sectionOrder: resolveSectionOrder(undefined),
    projectOrder: resolveProjectOrder(undefined),
    projectLayout: "grid",
    featuredOverrides: {},
  };
}

/**
 * Validate an unknown parsed value into a complete Preferences object.
 * Invalid fields fall back to defaults instead of rejecting the whole
 * record, so a partially corrupted write loses as little as possible.
 * Returns null only when the value is not an object at all.
 */
export function validatePreferences(raw: unknown): Preferences | null {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return null;
  const record = raw as Record<string, unknown>;

  // Unknown schema version → start fresh rather than misread fields.
  if (record.version !== PREFERENCES_VERSION) return null;

  const theme: ThemeMode = THEMES.includes(record.theme as ThemeMode)
    ? (record.theme as ThemeMode)
    : "dark";

  const accent =
    typeof record.accent === "string" && isHexColor(record.accent)
      ? record.accent
      : defaultAccent.hex;

  const projectLayout: Preferences["projectLayout"] = (LAYOUTS as readonly string[]).includes(
    record.projectLayout as string,
  )
    ? (record.projectLayout as Preferences["projectLayout"])
    : "grid";

  const featuredOverrides: Record<string, boolean> = {};
  if (record.featuredOverrides !== null && typeof record.featuredOverrides === "object") {
    for (const [key, value] of Object.entries(
      record.featuredOverrides as Record<string, unknown>,
    )) {
      if (PROJECT_IDS.has(key) && typeof value === "boolean") {
        featuredOverrides[key] = value;
      }
    }
  }

  return {
    version: PREFERENCES_VERSION,
    theme,
    accent,
    sectionOrder: resolveSectionOrder(record.sectionOrder),
    projectOrder: resolveProjectOrder(record.projectOrder),
    projectLayout,
    featuredOverrides,
  };
}

export interface LoadedPreferences {
  preferences: Preferences;
  /** False when storage is unavailable or held unusable data. */
  persisted: boolean;
}

export function loadPreferences(): LoadedPreferences {
  const validated = readJson<Preferences>(STORAGE_KEY, validatePreferences);
  if (validated) return { preferences: validated, persisted: true };
  return { preferences: defaultPreferences(), persisted: false };
}

export function savePreferences(preferences: Preferences): boolean {
  return writeJson(STORAGE_KEY, preferences);
}

export function clearPreferences(): void {
  removeKey(STORAGE_KEY);
}
