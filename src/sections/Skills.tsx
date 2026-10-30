import { SectionShell } from "@/components/ui/SectionShell";
import { getSectionMeta } from "@/data/navigation";
import { skillGroups } from "@/data/skills";
import { getProjectById } from "@/data/projects";

const meta = getSectionMeta("skills");

/**
 * Technical skills as a typographic table — group label in the left
 * column, skills as large inline text. No chips, no progress bars:
 * every entry cites its repositories on hover/focus instead.
 */
export function Skills() {
  return (
    <SectionShell
      id={meta.id}
      kicker={meta.index}
      label={meta.label}
      title="Technical skills"
      description="Grouped by craft. Every entry appears in a public repository — hover a skill to see where. No proficiency scores; usage is the honest signal."
    >
      <dl className="border-t border-line">
        {skillGroups.map((group) => (
          <div
            key={group.id}
            className="grid gap-3 border-b border-line py-7 md:grid-cols-[180px_1fr] md:gap-8"
          >
            <dt className="flex items-baseline gap-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-faint">
              <span aria-hidden="true" className="inline-block size-2 shrink-0 bg-accent" />
              {group.label}
            </dt>
            <dd>
              <ul className="flex flex-wrap items-baseline gap-x-1 gap-y-2 text-xl font-medium text-ink sm:text-2xl" aria-label={group.label}>
                {group.skills.map((skill, i) => {
                  const evidence = skill.evidence
                    .map((id) => getProjectById(id)?.name)
                    .filter(Boolean)
                    .join(", ");
                  return (
                    <li key={skill.name} className="flex items-baseline">
                      {i > 0 ? (
                        <span aria-hidden="true" className="px-2 text-faint">
                          /
                        </span>
                      ) : null}
                      <span
                        tabIndex={0}
                        title={evidence ? `Used in: ${evidence}` : undefined}
                        aria-description={evidence ? `Used in: ${evidence}` : undefined}
                        className="cursor-help transition-colors hover:text-accent-ink focus-visible:text-accent-ink"
                      >
                        {skill.name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}
