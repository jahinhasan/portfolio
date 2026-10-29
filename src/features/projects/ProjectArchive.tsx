import { useDeferredValue, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { LayoutGrid, List, Search, X } from "lucide-react";
import type { Project } from "@/types";
import { projectCategoryLabels } from "@/data/projects";
import { usePreferences } from "@/features/customization/usePreferences";
import { filterProjects, presentCategories } from "./filtering";
import type { CategoryFilter } from "./filtering";
import { ProjectCard } from "./ProjectCard";
import { cn } from "@/lib/cn";

interface ProjectArchiveProps {
  /** Projects the visitor has NOT marked featured — the archive pool. */
  projects: Project[];
  onOpenDetails: (project: Project) => void;
}

/**
 * Searchable, filterable project archive with grid/list display modes.
 * Layout choice is persisted via the preferences system.
 */
export function ProjectArchive({ projects, onOpenDetails }: ProjectArchiveProps) {
  const { preferences, setProjectLayout } = usePreferences();
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const categories = useMemo(() => presentCategories(projects), [projects]);
  const visible = useMemo(
    () => filterProjects(projects, category, deferredQuery),
    [projects, category, deferredQuery],
  );

  const categoriesWithCount = useMemo(
    () =>
      categories.map((c) => ({
        id: c,
        label: projectCategoryLabels[c],
        count: projects.filter((p) => p.category === c).length,
      })),
    [categories, projects],
  );

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1 lg:max-w-sm">
          <Search size={15} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            type="search"
            role="searchbox"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or technology…"
            aria-label="Search projects by name or technology"
            className="h-10 w-full rounded-lg border border-line bg-surface pl-9 pr-9 text-sm text-ink placeholder:text-faint focus:border-accent focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-faint hover:text-ink"
            >
              <X size={14} aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {/* Layout switch — segmented control */}
        <div
          role="group"
          aria-label="Display mode"
          className="flex h-10 shrink-0 items-center gap-0.5 rounded-lg border border-line bg-surface p-1"
        >
          <LayoutButton
            active={preferences.projectLayout === "grid"}
            onClick={() => setProjectLayout("grid")}
            label="Grid view"
          >
            <LayoutGrid size={15} aria-hidden="true" />
          </LayoutButton>
          <LayoutButton
            active={preferences.projectLayout === "list"}
            onClick={() => setProjectLayout("list")}
            label="List view"
          >
            <List size={15} aria-hidden="true" />
          </LayoutButton>
        </div>
      </div>

      {/* Category filter row */}
      <div role="group" aria-label="Filter by category" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        <FilterChip
          active={category === "all"}
          onClick={() => setCategory("all")}
          count={projects.length}
        >
          All
        </FilterChip>
        {categoriesWithCount.map((c) => (
          <FilterChip
            key={c.id}
            active={category === c.id}
            onClick={() => setCategory(c.id)}
            count={c.count}
          >
            {c.label}
          </FilterChip>
        ))}
      </div>

      {/* Results */}
      {visible.length > 0 ? (
        <div
          className={cn(
            "grid gap-4",
            preferences.projectLayout === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
          )}
        >
          {visible.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              featuredOverrides={preferences.featuredOverrides}
              layout={preferences.projectLayout}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-line-strong p-12 text-center">
          <p className="font-display text-lg text-ink">No projects match</p>
          <p className="mt-1 text-sm text-muted">
            Nothing found for “{query}” in this category. Try a different term or filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
            className="mt-4 font-mono text-xs uppercase tracking-wider text-accent-ink hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      <p aria-live="polite" className="font-mono text-[11px] uppercase tracking-wider text-faint">
        {visible.length} project{visible.length === 1 ? "" : "s"} shown
      </p>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-accent bg-accent/12 text-accent-ink"
          : "border-line text-muted hover:border-line-strong hover:text-ink",
      )}
    >
      {children}
      <span aria-hidden="true" className={cn("font-mono text-[10px]", active ? "text-accent-ink/70" : "text-faint")}>
        {count}
      </span>
    </button>
  );
}

function LayoutButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-8 w-9 items-center justify-center rounded-md transition-colors",
        active ? "bg-accent/15 text-accent-ink" : "text-faint hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
