import { ArrowUpRight } from "lucide-react";
import { SectionShell } from "@/components/ui/SectionShell";
import { getSectionMeta } from "@/data/navigation";
import { services } from "@/data/services";

const meta = getSectionMeta("services");

/**
 * "What I Can Help With" — numbered service rows that invert to the
 * accent on hover. A plain list on purpose: no cards, no icons-for-icons.
 */
export function Services() {
  return (
    <SectionShell
      id={meta.id}
      kicker={meta.index}
      label={meta.label}
      title="What I can help with"
      description="Scoped, honest offerings — each one maps to work already visible in the projects above."
    >
      <ul className="border-t border-line">
        {services.map((service, i) => (
          <li key={service.id} className="border-b border-line">
            <div className="group grid items-baseline gap-2 py-6 transition-colors sm:grid-cols-[64px_1fr_auto] sm:gap-6 hover:bg-accent motion-reduce:transition-none sm:py-7">
              <span
                aria-hidden="true"
                className="font-mono text-sm text-faint transition-colors group-hover:text-accent-fg"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-lg uppercase tracking-tight text-ink transition-colors group-hover:text-accent-fg sm:text-xl">
                  {service.title}
                </h3>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted transition-colors group-hover:text-accent-fg/85">
                  {service.description}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="hidden text-faint transition-colors group-hover:text-accent-fg sm:block"
              >
                <ArrowUpRight size={20} />
              </span>
            </div>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
