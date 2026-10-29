import type { Project } from "@/types";
import { SectionShell } from "@/components/ui/SectionShell";
import { getSectionMeta } from "@/data/navigation";
import { useProjects } from "@/features/projects/useProjects";
import { ProjectArchive } from "@/features/projects/ProjectArchive";

const meta = getSectionMeta("archive");

interface ArchiveSectionProps {
  onOpenDetails: (project: Project) => void;
}

/** Searchable, filterable archive of everything beyond the featured picks. */
export function ArchiveSection({ onOpenDetails }: ArchiveSectionProps) {
  const { rest } = useProjects();

  return (
    <SectionShell
      id={meta.id}
      kicker={meta.index}
      label={meta.label}
      title="Project archive"
      description="Everything else, searchable and filterable — including coursework and competition builds. Search matches names and technologies."
    >
      <ProjectArchive projects={rest} onOpenDetails={onOpenDetails} />
    </SectionShell>
  );
}
