import { useContext } from "react";
import type { SectionId } from "@/types";
import { PreferencesContext } from "./preferencesContext";

/** Access the customization store. Throws outside the provider. */
export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}

/** Convenience: the live section order for navigation and rendering. */
export function useSectionOrder(): SectionId[] {
  return usePreferences().preferences.sectionOrder;
}
