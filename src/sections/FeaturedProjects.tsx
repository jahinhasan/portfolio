import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { ArrowUpRight } from "lucide-react";
import { CSS as CSSUtil } from "@dnd-kit/utilities";
import type { DragEndEvent } from "@dnd-kit/core";
import type { Project } from "@/types";
import { SectionShell } from "@/components/ui/SectionShell";
import { getSectionMeta } from "@/data/navigation";
import { projectCategoryLabels } from "@/data/projects";
import { GithubIcon } from "@/components/icons";
import { Tag } from "@/components/ui/Tag";
import { usePreferences } from "@/features/customization/usePreferences";
import { useProjects } from "@/features/projects/useProjects";
import { ProjectArt } from "@/features/projects/ProjectArt";
import { cn } from "@/lib/cn";

const meta = getSectionMeta("projects");

interface FeaturedProjectsProps {
  onOpenDetails: (project: Project) => void;
}

/**
 * Selected projects as an editorial showcase — full-width rows with
 * alternating composition, oversized index numerals, and hard borders.
 * No grid of identical cards. Visitors can still drag rows (grip handle
 * appears on hover / focus) or reorder them from the customization panel.
 */
export function FeaturedProjects({ onOpenDetails }: FeaturedProjectsProps) {
  const { featured } = useProjects();
  const { preferences, moveProject } = usePreferences();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    // Map featured-subsequence positions onto the full project order.
    const from = preferences.projectOrder.indexOf(String(active.id));
    const to = preferences.projectOrder.indexOf(String(over.id));
    if (from === -1 || to === -1) return;
    moveProject(from, to);
  };

  return (
    <SectionShell
      id={meta.id}
      kicker={meta.index}
      label={meta.label}
      title="Selected projects"
      description="Four builds that show the range — from a Three.js mission-control site to a Laravel marketplace. Drag a row to reorder them your way."
      splitHeader
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={featured.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <div className="border-t border-line">
            {featured.map((project, i) => (
              <SortableRow key={project.id} project={project} index={i} onOpenDetails={onOpenDetails} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </SectionShell>
  );
}

function SortableRow({
  project,
  index,
  onOpenDetails,
}: {
  project: Project;
  index: number;
  onOpenDetails: (project: Project) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
  });

  const style = {
    transform: CSSUtil.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  const reversed = index % 2 === 1;
  const numeral = String(index + 1).padStart(2, "0");

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? "opacity-80" : undefined}>
      <article className="group relative grid items-center gap-6 border-b border-line py-10 sm:py-12 lg:grid-cols-12 lg:gap-10">
        {/* Oversized index numeral */}
        <span
          aria-hidden="true"
          className="display-outline pointer-events-none absolute -top-1 right-0 font-display text-6xl leading-none opacity-90 sm:text-7xl lg:-top-3 lg:text-8xl"
        >
          {numeral}
        </span>

        {/* Visual — real screenshot when one exists, abstract plate otherwise */}
        <div className={cn("relative lg:col-span-7", reversed && "lg:order-2 lg:col-span-6 lg:col-start-7")}>
          <div className="border border-line-strong shadow-hard transition-transform duration-200 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none motion-reduce:transition-none">
            {project.screenshot ? (
              <img
                src={project.screenshot}
                alt={`${project.name} screenshot`}
                width={1280}
                height={720}
                loading="lazy"
                decoding="async"
                className="aspect-video w-full object-cover object-top"
              />
            ) : (
              <div className="aspect-video w-full overflow-hidden">
                <ProjectArt project={project} className="h-full w-full" />
              </div>
            )}
          </div>
          <div className="absolute -bottom-3 left-4 flex items-center gap-2">
            <button
              type="button"
              {...attributes}
              {...listeners}
              tabIndex={0}
              aria-label={`Drag handle. Reorder ${project.name}. Press space and use arrow keys to reposition.`}
              className="border border-line-strong bg-bg px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-faint opacity-0 transition-opacity cursor-grab focus-visible:opacity-100 group-hover:opacity-100 active:cursor-grabbing motion-reduce:opacity-100"
            >
              ⠿ drag
            </button>
          </div>
        </div>

        {/* Text column */}
        <div className={cn("lg:col-span-5", reversed && "lg:order-1 lg:col-span-6")}>
          <p className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
            <span className="bg-accent px-1.5 py-0.5 font-semibold text-accent-fg">{numeral}</span>
            <span>{project.year}</span>
            <span aria-hidden="true">·</span>
            <span>{projectCategoryLabels[project.category]}</span>
            <span aria-hidden="true">·</span>
            <span>{project.role}</span>
          </p>

          <h3 className="display-section text-2xl text-ink sm:text-3xl">{project.name}</h3>

          <p className="mt-4 max-w-xl leading-relaxed text-muted">{project.tagline}</p>

          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies used">
            {project.tech.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => onOpenDetails(project)}
              className="inline-flex items-center gap-1.5 bg-accent px-3.5 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-accent-fg transition-transform hover:-translate-y-0.5"
              aria-label={`Details about ${project.name}`}
            >
              Details
              <ArrowUpRight size={14} aria-hidden="true" />
            </button>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-accent-ink"
            >
              <GithubIcon size={15} aria-hidden="true" />
              Source
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
