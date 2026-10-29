import { SectionShell } from "@/components/ui/SectionShell";
import { getSectionMeta } from "@/data/navigation";
import { skillGroups } from "@/data/skills";
import { getProjectById } from "@/data/projects";

const meta = getSectionMeta("skills");

/** One hue per skill group — a curated rotation, independent of the accent. */
const groupHues: Record<string, string> = {
  languages: "#0891b2",
  frontend: "#6d4aff",
  backend: "#d97706",
  databases: "#059669",
  automation: "#db2777",
  systems: "#4f46e5",
  aiml: "#7c3aed",
};

export function Skills() {
  return (
    <SectionShell
      id={meta.id}
      kicker={meta.index}
      label={meta.label}
      title="Tools I've used, not just listed"
      description="Every entry below appears in a public repository — hover a skill to see where. No proficiency scores; usage is the honest signal."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {skillGroups.map((group) => (
          <div key={group.id} className="rounded-xl border border-line bg-surface p-5">
            <h3 className="mb-4 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-faint">
              <span
                aria-hidden="true"
                className="inline-block size-2.5 rounded-[4px]"
                style={{ backgroundColor: groupHues[group.id] ?? "var(--accent)" }}
              />
              {group.label}
            </h3>
            <ul className="flex flex-wrap gap-2" aria-label={group.label}>
              {group.skills.map((skill) => {
                const evidence = skill.evidence
                  .map((id) => getProjectById(id)?.name)
                  .filter(Boolean)
                  .join(", ");
                return (
                  <li key={skill.name}>
                    <span
                      tabIndex={0}
                      title={evidence ? `Used in: ${evidence}` : undefined}
                      aria-description={evidence ? `Used in: ${evidence}` : undefined}
                      className="inline-block cursor-help rounded-md border border-line bg-raised px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-accent/50 hover:text-ink focus-visible:border-accent"
                    >
                      {skill.name}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
