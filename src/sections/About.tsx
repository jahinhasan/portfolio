import { GraduationCap, MapPin, Hammer, Workflow } from "lucide-react";
import { SectionShell } from "@/components/ui/SectionShell";
import { getSectionMeta } from "@/data/navigation";
import { aboutParagraphs, profile } from "@/data/profile";
import portrait from "@/assets/jahin.jpg";

const meta = getSectionMeta("about");

export function About() {
  return (
    <SectionShell
      id={meta.id}
      kicker={meta.index}
      label={meta.label}
      title="About me"
      description="Computer Science background, frontend and backend experience, and a bias toward automation."
      splitHeader
    >
      <div className="grid gap-10 lg:grid-cols-[280px_1fr] lg:gap-14">
        {/* Portrait — flat frame, hard shadow, grayscale until hovered */}
        <figure className="group relative w-fit max-w-full">
          <div className="shadow-hard transition-transform duration-200 group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none motion-reduce:transition-none">
            <img
              src={portrait}
              alt="Portrait of Jahin Hasan"
              width={1117}
              height={1600}
              className="aspect-[4/5] w-64 border border-line-strong object-cover object-top grayscale transition-[filter] duration-300 group-hover:grayscale-0 motion-reduce:transition-none sm:w-72 lg:w-full"
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-faint">
            {profile.name} — {profile.location}
          </figcaption>
        </figure>

        <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-12">
          <div className="space-y-5">
            {aboutParagraphs.map((paragraph, i) => (
              <p key={i} className="leading-relaxed text-muted">
                {paragraph}
              </p>
            ))}
          </div>

          <aside aria-label="Quick facts" className="mt-8 space-y-0 border-t border-line lg:mt-0 lg:border-t-0">
            <Fact icon={<GraduationCap size={15} aria-hidden="true" />} label="Studying">
              CSE, BAUST — Rangpur, Bangladesh
            </Fact>
            <Fact icon={<Hammer size={15} aria-hidden="true" />} label="Building with">
              React &amp; TypeScript on the frontend, Laravel + MySQL on the backend
            </Fact>
            <Fact icon={<Workflow size={15} aria-hidden="true" />} label="Interested in">
              Automation — tools that take repetitive work off human hands
            </Fact>
            <Fact icon={<MapPin size={15} aria-hidden="true" />} label="Based in">
              {profile.location} — open to remote work
            </Fact>
          </aside>
        </div>
      </div>
    </SectionShell>
  );
}

function Fact({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 border-b border-line py-4">
      <span className="mt-0.5 text-accent-ink" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-faint">{label}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink">{children}</p>
      </div>
    </div>
  );
}
