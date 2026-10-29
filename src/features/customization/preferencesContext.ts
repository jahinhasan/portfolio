import { createContext } from "react";
import type { Preferences } from "@/types";

export interface PreferencesContextValue {
  preferences: Preferences;
  /** True when localStorage works and held valid data on load. */
  persisted: boolean;
  storageAvailable: boolean;
  setTheme: (theme: Preferences["theme"]) => void;
  setAccent: (hex: string) => void;
  resetAccent: () => void;
  moveSection: (from: number, to: number) => void;
  resetSectionOrder: () => void;
  moveProject: (from: number, to: number) => void;
  resetProjectOrder: () => void;
  setProjectLayout: (layout: Preferences["projectLayout"]) => void;
  setProjectFeatured: (projectId: string, featured: boolean) => void;
  resetAll: () => void;
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);
