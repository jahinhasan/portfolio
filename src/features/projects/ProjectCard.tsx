import { ArrowUpRight, ExternalLink, Star } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import type { Project } from "@/types";
import { projectCategoryLabels } from "@/data/projects";
import { isProjectFeatured } from "./useProjects";
import { ProjectArt } from "./ProjectArt";
import { Tag, Pill } from "@/components/ui/Tag";
import { cn } from "@/lib/cn";

interface ProjectCardProps {
  project: Project;
  featuredOverrides: Record<string, boolean>;
  layout: "grid" | "list";
  onOpenDetails: (project: Project) => void;
  draggable?: boolean;
  handleProps?: Record<string, unknown>;
}

export function ProjectCard({
  project,
  featuredOverrides,
  layout,
  onOpenDetails,
  draggable = false,
  handleProps,
}: ProjectCardProps) {
  const featured = isProjectFeatured(project, featuredOverrides);
  const isList = layout === "list";

  const art = project.screenshot ? (
    <img
      src={project.screenshot}
      alt={`${project.name} screenshot`}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
    />
  ) : (
    <ProjectArt project={project} className="h-full w-full" />
  );

  const meta = (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-faint">
      <span>{project.year}</span>
      <span aria-hidden="true">·</span>
      <span>{projectCategoryLabels[project.category]}</span>
      {featured ? (
        <Pill tone="accent">
          <Star size={10} aria-hidden="true" /> Featured
        </Pill>
      ) : null}
    </div>
  );

  const tech = (
    <div className="flex flex-wrap gap-1.5">
      {project.tech.slice(0, 4).map((t) => (
        <Tag key={t}>{t}</Tag>
      ))}
      {project.tech.length > 4 ? <Tag>+{project.tech.length - 4}</Tag> : null}
    </div>
  );

  const actions = (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onOpenDetails(project)}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-accent/12 px-3 font-mono text-xs font-medium text-accent transition-colors hover:bg-accent/20"
        aria-label={`Details about ${project.name}`}
      >
        Details
        <ArrowUpRight size={13} aria-hidden="true" />
      </button>
      <a
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.name} on GitHub (opens in new tab)`}
        title="View repository on GitHub"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-accent hover:text-accent"
      >
        <GithubIcon size={15} />
      </a>
      {project.demo ? (
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.name} live demo (opens in new tab)`}
          title="Open live demo"
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:border-accent hover:text-accent"
        >
          <ExternalLink size={15} aria-hidden="true" />
        </a>
      ) : null}
    </div>
  );

  if (isList) {
    return (
      <article
        className={cn(
          "group flex gap-4 rounded-xl border border-line bg-surface p-3 transition-colors hover:border-line-strong sm:gap-5 sm:p-4",
          draggable && "cursor-grab active:cursor-grabbing",
        )}
      >
        <div className="hidden w-40 shrink-0 overflow-hidden rounded-lg border border-line sm:block md:w-52">
          <div className="aspect-[16/10] transition-transform duration-300 group-hover:scale-[1.03]">{art}</div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-display text-base font-semibold text-ink">{project.name}</h3>
              {meta}
            </div>
            {actions}
          </div>
          <p className="text-sm leading-relaxed text-muted">{project.tagline}</p>
          <div className="mt-auto">{tech}</div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-panel",
        draggable && "cursor-grab active:cursor-grabbing",
      )}
    >
      <div className="relative overflow-hidden border-b border-line">
        <div className="aspect-[16/9] transition-transform duration-300 group-hover:scale-[1.03]">{art}</div>
        {handleProps ? (
          <button
            type="button"
            {...handleProps}
            className="absolute right-2 top-2 rounded-md bg-bg/80 p-1.5 text-muted opacity-0 backdrop-blur transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
            aria-label={`Reorder ${project.name}`}
          >
            <GripVertical />
          </button>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">{project.name}</h3>
          <div className="mt-1.5">{meta}</div>
        </div>
        <p className="text-sm leading-relaxed text-muted">{project.tagline}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          {tech}
          {actions}
        </div>
      </div>
    </article>
  );
}

function GripVertical() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="9" cy="5" r="1.6" />
      <circle cx="15" cy="5" r="1.6" />
      <circle cx="9" cy="12" r="1.6" />
      <circle cx="15" cy="12" r="1.6" />
      <circle cx="9" cy="19" r="1.6" />
      <circle cx="15" cy="19" r="1.6" />
    </svg>
  );
}
