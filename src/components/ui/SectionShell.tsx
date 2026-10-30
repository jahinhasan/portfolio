import type { ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/cn";

interface SectionShellProps {
  id: string;
  /** Mono eyebrow number, e.g. "03". */
  kicker: string;
  /** Mono eyebrow label, e.g. "Selected Projects". */
  label: string;
  /** Large display heading. Authored copy, may differ from `label`. */
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  /** Alternate the header layout: meta column right of the title on wide screens. */
  splitHeader?: boolean;
}

/**
 * Shared section chrome: anchored <section>, hairline top rule with a
 * numbered mono kicker, display-font uppercase heading, optional lede.
 * Keeps every section structurally consistent while its content stays
 * free to differ.
 */
export function SectionShell({
  id,
  kicker,
  label,
  title,
  description,
  children,
  className,
  splitHeader = false,
}: SectionShellProps) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("scroll-mt-24 border-t border-line py-20 sm:py-28", className)}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div
          ref={ref}
          className={cn(
            "reveal-group transition-[opacity,transform] duration-500 ease-out",
            shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
        >
          <header className={cn("mb-10 sm:mb-14", splitHeader && "lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-10")}>
            <div>
              <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-faint">
                <span className="bg-accent px-1.5 py-0.5 font-semibold text-accent-fg">{kicker}</span>
                <span>{label}</span>
              </p>
              <h2 id={`${id}-heading`} className="display-section text-ink">
                {title}
              </h2>
            </div>
            {description ? (
              <p
                className={cn(
                  "mt-5 max-w-2xl text-base leading-relaxed text-muted",
                  splitHeader && "lg:mt-0 lg:max-w-sm lg:text-right",
                )}
              >
                {description}
              </p>
            ) : null}
          </header>
          {children}
        </div>
      </div>
    </section>
  );
}
