import type { ReactNode } from "react";
import { GraduationCap, MapPin, Target, Wrench } from "lucide-react";
import { SectionShell } from "@/components/ui/SectionShell";
import { getSectionMeta } from "@/data/navigation";
import { aboutParagraphs, profile } from "@/data/profile";

const meta = getSectionMeta("about");

export function About() {
  return (
    <SectionShell
      id={meta.id}
      kicker={meta.index}
      label={meta.label}
      title="Practical builder, honest engineer"
      description="What I work on, how I work, and where I'm headed."
    >
      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          {aboutParagraphs.map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>

        <aside aria-label="Quick facts" className="space-y-3">
          <FactCard icon={<GraduationCap size={16} aria-hidden="true" />} label="Studying">
            CSE undergraduate, BAUST — Rangpur, Bangladesh
          </FactCard>
          <FactCard icon={<Wrench size={16} aria-hidden="true" />} label="Building with">
            Laravel & FastAPI backends, React frontends, Python automation and ML tooling
          </FactCard>
          <FactCard icon={<Target size={16} aria-hidden="true" />} label="Looking for">
            Internships and real-world projects in web development or automation
          </FactCard>
          <FactCard icon={<MapPin size={16} aria-hidden="true" />} label="Based in">
            {profile.location} — open to remote work
          </FactCard>
        </aside>
      </div>
    </SectionShell>
  );
}

function FactCard({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3.5 rounded-xl border border-line bg-surface p-4">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/12 text-accent-ink">
        {icon}
      </span>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-faint">{label}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink">{children}</p>
      </div>
    </div>
  );
}
