import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import type { Project } from "@/types";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { projectCategoryLabels } from "@/data/projects";

interface ProjectDetailDialogProps {
  project: Project | null;
  onClose: () => void;
}

/**
 * Long-form project view: problem, approach, implemented features, and
 * honest learnings. Content comes verbatim from src/data/projects.ts.
 */
export function ProjectDetailDialog({ project, onClose }: ProjectDetailDialogProps) {
  return (
    <Dialog
      open={project !== null}
      onClose={onClose}
      title={project?.name ?? ""}
      description={project ? `${project.year} · ${projectCategoryLabels[project.category]}` : undefined}
      className="sm:max-w-3xl"
    >
      {project ? (
        <div className="space-y-8">
          <div className="flex flex-wrap items-center gap-2">
            {project.tech.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>

          <section aria-labelledby="detail-problem">
            <h3 id="detail-problem" className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-faint">
              The problem
            </h3>
            <p className="leading-relaxed text-muted">{project.details.problem}</p>
          </section>

          <section aria-labelledby="detail-approach">
            <h3 id="detail-approach" className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-faint">
              Approach
            </h3>
            <ul className="space-y-2.5">
              {project.details.approach.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span aria-hidden="true" className="mt-0.5 font-mono text-xs text-accent-ink">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="detail-features">
            <h3 id="detail-features" className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-faint">
              Implemented features
            </h3>
            <ul className="grid gap-2 sm:grid-cols-2">
              {project.details.features.map((item, i) => (
                <li key={i} className="flex gap-2.5 rounded-lg border border-line bg-raised/50 p-3 text-sm leading-relaxed text-muted">
                  <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="detail-learnings">
            <h3 id="detail-learnings" className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-faint">
              Challenges & learnings
            </h3>
            <ul className="space-y-2">
              {project.details.learnings.map((item, i) => (
                <li key={i} className="border-l-2 border-accent/40 pl-3 text-sm leading-relaxed text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <footer className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
            <Button href={project.github} size="sm">
              <GithubIcon size={14} />
              View repository
            </Button>
            {project.demo ? (
              <Button href={project.demo} variant="outline" size="sm">
                <ExternalLink size={14} aria-hidden="true" />
                Live demo
              </Button>
            ) : null}
            <p className="ml-auto font-mono text-[11px] text-faint">{project.role}</p>
          </footer>
        </div>
      ) : null}
    </Dialog>
  );
}
