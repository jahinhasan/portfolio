import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Preferences } from "@/types";
import { arrayMove } from "@/lib/ordering";
import { isStorageAvailable } from "@/lib/storage";
import { defaultAccent } from "@/data/theme";
import { clearPreferences, defaultPreferences, type LoadedPreferences, savePreferences } from "./preferences";
import { applyAccent, applyDocumentTheme } from "./applyTheme";
import { PreferencesContext } from "./preferencesContext";
import type { PreferencesContextValue } from "./preferencesContext";

interface ProviderProps {
  children: ReactNode;
  initial: LoadedPreferences;
}

export function PreferencesProvider({ children, initial }: ProviderProps) {
  const [preferences, setPreferences] = useState(initial.preferences);
  const [persisted, setPersisted] = useState(initial.persisted);
  const storageAvailable = useMemo(() => isStorageAvailable(), []);

  /** Update state, mirror onto <html>, and persist. */
  const update = useCallback((next: Preferences) => {
    applyDocumentTheme(next.theme);
    applyAccent(next.accent);
    setPreferences(next);
    if (savePreferences(next)) setPersisted(true);
  }, []);

  const setTheme = useCallback(
    (theme: Preferences["theme"]) => update({ ...preferences, theme }),
    [preferences, update],
  );

  const setAccent = useCallback(
    (accent: string) => update({ ...preferences, accent }),
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
    // Reset means reset: clear the stored record rather than saving defaults.
    clearPreferences();
    setPersisted(false);
    const fresh = defaultPreferences();
    applyDocumentTheme(fresh.theme);
    applyAccent(fresh.accent);
    setPreferences(fresh);
  }, []);

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
