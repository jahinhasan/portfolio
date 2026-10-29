import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionShellProps {
  id: string;
  /** Mono eyebrow number, e.g. "03". */
  kicker: string;
  /** Mono eyebrow label, e.g. "Featured Projects". */
  label: string;
  /** Large display heading. Authored copy, may differ from `label`. */
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Shared section chrome: anchored <section>, numbered mono kicker,
 * display-font heading, optional lede. Keeps every section visually
 * consistent while its content stays free to differ.
 */
export function SectionShell({
  id,
  kicker,
  label,
  title,
  description,
  children,
  className,
}: SectionShellProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("scroll-mt-24 py-20 sm:py-24", className)}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <header className="mb-10 sm:mb-14">
          <p className="mb-3 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-faint">
            <span className="text-accent">{kicker}</span>
            <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
            <span>{label}</span>
          </p>
          <h2
            id={`${id}-heading`}
            className="font-display text-3xl font-semibold tracking-tight text-balance text-ink sm:text-4xl"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{description}</p>
          ) : null}
        </header>
        {children}
      </div>
    </section>
  );
}
