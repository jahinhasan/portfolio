import type { Project, ProjectCategoryId } from "@/types";

export type CategoryFilter = ProjectCategoryId | "all";

/**
 * Filter projects by category and a free-text query.
 * The query matches project name, tagline, and technology tags,
 * case-insensitively. Ordering of the input list is preserved.
 * Pure — unit-tested.
 */
export function filterProjects(
  projects: readonly Project[],
  category: CategoryFilter,
  query: string,
): Project[] {
  const q = query.trim().toLowerCase();
  return projects.filter((project) => {
    if (category !== "all" && project.category !== category) return false;
    if (q === "") return true;
    const haystack = [project.name, project.tagline, ...project.tech].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}

/** Available categories present in a list of projects, in data-file order. */
export function presentCategories(projects: readonly Project[]): ProjectCategoryId[] {
  const seen: ProjectCategoryId[] = [];
  for (const p of projects) {
    if (!seen.includes(p.category)) seen.push(p.category);
  }
  return seen;
}
