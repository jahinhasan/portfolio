import { useMemo } from "react";
import type { Project } from "@/types";
import { getProjectById } from "@/data/projects";
import { usePreferences } from "@/features/customization/PreferencesContext";

/** Effective featured state = data default, overridden by visitor choice. */
export function isProjectFeatured(project: Project, overrides: Record<string, boolean>): boolean {
  return overrides[project.id] ?? project.featured;
}

export interface UseProjectsResult {
  /** All projects in the visitor's (or default) order. */
  ordered: Project[];
  /** Projects whose effective featured state is true, in display order. */
  featured: Project[];
  /** Everything else, in display order. */
  rest: Project[];
}

export function useProjects(): UseProjectsResult {
  const { preferences } = usePreferences();

  return useMemo(() => {
    const ordered = preferences.projectOrder
      .map((id) => getProjectById(id))
      .filter((p): p is Project => p !== undefined);
    const featured = ordered.filter((p) => isProjectFeatured(p, preferences.featuredOverrides));
    const rest = ordered.filter((p) => !isProjectFeatured(p, preferences.featuredOverrides));
    return { ordered, featured, rest };
  }, [preferences.projectOrder, preferences.featuredOverrides]);
}
