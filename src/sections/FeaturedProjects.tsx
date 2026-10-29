import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";
import { CSS as CSSUtil } from "@dnd-kit/utilities";
import type { Project } from "@/types";
import { SectionShell } from "@/components/ui/SectionShell";
import { getSectionMeta } from "@/data/navigation";
import { usePreferences } from "@/features/customization/PreferencesContext";
import { useProjects } from "@/features/projects/useProjects";
import { ProjectCard } from "@/features/projects/ProjectCard";

const meta = getSectionMeta("projects");

interface FeaturedProjectsProps {
  onOpenDetails: (project: Project) => void;
}

/**
 * Featured project grid. Visitors can drag cards (grip handle appears on
 * hover / focus) to reorder them — order persists locally. Keyboard users
 * can reorder the same cards from the customization panel's arrow buttons.
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
      title="Selected work"
      description="The projects that best show how I build. Drag any card to reorder them your way — the grip appears on hover."
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={featured.map((p) => p.id)} strategy={rectSortingStrategy}>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {featured.map((project) => (
              <SortableCard key={project.id} project={project} onOpenDetails={onOpenDetails} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </SectionShell>
  );
}

function SortableCard({
  project,
  onOpenDetails,
}: {
  project: Project;
  onOpenDetails: (project: Project) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
  });
  const { preferences } = usePreferences();

  const style = {
    transform: CSSUtil.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? "opacity-80" : undefined}>
      <ProjectCard
        project={project}
        featuredOverrides={preferences.featuredOverrides}
        layout="grid"
        onOpenDetails={onOpenDetails}
        draggable
        handleProps={{
          ...attributes,
          ...listeners,
          tabIndex: 0,
          "aria-label": `Drag handle. Reorder ${project.name}. Press space and use arrow keys to reposition.`,
        }}
      />
    </div>
  );
}
