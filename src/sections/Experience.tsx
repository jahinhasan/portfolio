import { ArrowUpRight } from "lucide-react";
import { SectionShell } from "@/components/ui/SectionShell";
import { getSectionMeta } from "@/data/navigation";
import { experience } from "@/data/experience";

const meta = getSectionMeta("experience");

export function Experience() {
  return (
    <SectionShell
      id={meta.id}
      kicker={meta.index}
      label={meta.label}
      title="Project experience"
      description="No employment history yet — this is the work that counts instead: shipped projects and team activity, with dates."
    >
      <ol className="relative space-y-0 border-l border-line pl-0">
        {experience.map((entry) => (
          <li key={entry.id} className="relative pb-10 pl-8 last:pb-0">
            {/* Timeline node */}
            <span
              aria-hidden="true"
              className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-bg"
            />
            <p className="mb-1.5 font-mono text-[11px] uppercase tracking-wider text-faint">
              {entry.period}
            </p>
            <h3 className="font-display text-lg font-semibold text-ink">{entry.title}</h3>
            <p className="mb-3 text-sm text-accent">{entry.org}</p>
            <ul className="space-y-2">
              {entry.points.map((point, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/70" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            {entry.link ? (
              <a
                href={entry.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-accent hover:underline"
              >
                {entry.link.label}
                <ArrowUpRight size={12} aria-hidden="true" />
              </a>
            ) : null}
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
