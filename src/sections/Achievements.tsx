import { Trophy } from "lucide-react";
import { SectionShell } from "@/components/ui/SectionShell";
import { getSectionMeta } from "@/data/navigation";
import { achievements } from "@/data/experience";

const meta = getSectionMeta("achievements");

export function Achievements() {
  return (
    <SectionShell
      id={meta.id}
      kicker={meta.index}
      label={meta.label}
      title="Recognition"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {achievements.map((achievement) => (
          <article
            key={achievement.id}
            className="relative border border-line bg-surface p-6"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center bg-accent/12 text-accent-ink">
                <Trophy size={18} aria-hidden="true" />
              </span>
              <p className="font-mono text-xs uppercase tracking-wider text-faint">{achievement.year}</p>
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold leading-snug text-ink">
              {achievement.title}
            </h3>
            <p className="mt-1 text-sm text-accent-ink">{achievement.org}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{achievement.description}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
