import { GraduationCap } from "lucide-react";
import { SectionShell } from "@/components/ui/SectionShell";
import { getSectionMeta } from "@/data/navigation";
import { education } from "@/data/experience";

const meta = getSectionMeta("education");

export function Education() {
  return (
    <SectionShell
      id={meta.id}
      kicker={meta.index}
      label={meta.label}
      title="Education"
    >
      <div className="grid gap-4">
        {education.map((entry) => (
          <article
            key={entry.id}
            className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-6 sm:flex-row sm:items-start"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-accent-ink">
              <GraduationCap size={20} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-lg font-semibold text-ink">{entry.degree}</h3>
              <p className="mt-0.5 text-sm text-muted">{entry.institution}</p>
              <p className="mt-0.5 text-sm text-faint">{entry.location}</p>
              <p className="mt-2 inline-block rounded-md border border-line bg-raised px-2 py-0.5 font-mono text-[11px] text-muted">
                {entry.period}
              </p>
              <ul className="mt-4 space-y-1.5">
                {entry.notes.map((note, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                    <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
