import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Preferences, SectionId, ThemeMode } from "@/types";
import { arrayMove } from "@/lib/ordering";
import { isStorageAvailable } from "@/lib/storage";
import { defaultAccent } from "@/data/theme";
import {
  clearPreferences,
  defaultPreferences,
  type LoadedPreferences,
  loadPreferences,
  savePreferences,
} from "./preferences";
import { applyAccent, applyDocumentTheme } from "./applyTheme";

interface PreferencesContextValue {
  preferences: Preferences;
  /** True when localStorage works and held valid data on load. */
  persisted: boolean;
  storageAvailable: boolean;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (hex: string) => void;
  resetAccent: () => void;
  moveSection: (from: number, to: number) => void;
  resetSectionOrder: () => void;
  moveProject: (from: number, to: number) => void;
  resetProjectOrder: () => void;
  setProjectLayout: (layout: ProjectLayout) => void;
  setProjectFeatured: (projectId: string, featured: boolean) => void;
  resetAll: () => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

interface ProviderProps {
  children: ReactNode;
  initial: LoadedPreferences;
}

export function PreferencesProvider({ children, initial }: ProviderProps) {
  const [preferences, setPreferences] = useState<Preferences>(initial.preferences);
  const [persisted, setPersisted] = useState(initial.persisted);
  const storageAvailable = useMemo(() => isStorageAvailable(), []);

  /** Update state, mirror onto <html>, and persist. */
  const update = useCallback(
    (next: Preferences) => {
      applyDocumentTheme(next.theme);
      applyAccent(next.accent);
      setPreferences(next);
      if (savePreferences(next)) setPersisted(true);
    },
    [],
  );

  const setTheme = useCallback(
    (theme: ThemeMode) => update({ ...preferences, theme }),
    [preferences, update],
  );

  const setAccent = useCallback(
    (hex: string) => update({ ...preferences, accent: hex }),
    [preferences, update],
  );

  const resetAccent = useCallback(
    () => update({ ...preferences, accent: defaultAccent.hex }),
    [preferences, update],
  );

  const moveSection = useCallback(
    (from: number, to: number) =>
      update({ ...preferences, sectionOrder: arrayMove(preferences.sectionOrder, from, to) }),
    [preferences, update],
  );

  const resetSectionOrder = useCallback(
    () => update({ ...preferences, sectionOrder: defaultPreferences().sectionOrder }),
    [preferences, update],
  );

  const moveProject = useCallback(
    (from: number, to: number) =>
      update({ ...preferences, projectOrder: arrayMove(preferences.projectOrder, from, to) }),
    [preferences, update],
  );

  const resetProjectOrder = useCallback(
    () => update({ ...preferences, projectOrder: defaultPreferences().projectOrder }),
    [preferences, update],
  );

  const setProjectLayout = useCallback(
    (projectLayout: Preferences["projectLayout"]) => update({ ...preferences, projectLayout }),
    [preferences, update],
  );

  const setProjectFeatured = useCallback(
    (projectId: string, featured: boolean) =>
      update({
        ...preferences,
        featuredOverrides: { ...preferences.featuredOverrides, [projectId]: featured },
      }),
    [preferences, update],
  );

  const resetAll = useCallback(() => {
    clearPreferences();
    const fresh = defaultPreferences();
    setPersisted(false);
    update(fresh);
  }, [update]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      preferences,
      persisted,
      storageAvailable,
      setTheme,
      setAccent,
      resetAccent,
      moveSection,
      resetSectionOrder,
      moveProject,
      resetProjectOrder,
      setProjectLayout,
      setProjectFeatured,
      resetAll,
    }),
    [
      preferences,
      persisted,
      storageAvailable,
      setTheme,
      setAccent,
      resetAccent,
      moveSection,
      resetSectionOrder,
      moveProject,
      resetProjectOrder,
      setProjectLayout,
      setProjectFeatured,
      resetAll,
    ],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}

/** Convenience hooks for consuming ordered data. */

export function useSectionOrder(): SectionId[] {
  return usePreferences().preferences.sectionOrder;
}

export type ProjectLayout = Preferences["projectLayout"];

export { loadPreferences };
