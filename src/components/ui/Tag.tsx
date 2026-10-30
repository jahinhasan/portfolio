import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TagProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

/** Small mono chip for technologies and meta labels. */
export function Tag({ children, title, className }: TagProps) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center border border-line bg-raised px-2 py-0.5 font-mono text-[11px] leading-5 text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

interface PillProps {
  children: ReactNode;
  tone?: "accent" | "neutral";
  className?: string;
}

/** Slightly larger pill for statuses like "Featured". */
export function Pill({ children, tone = "neutral", className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider",
        tone === "accent"
          ? "bg-accent text-accent-fg"
          : "border border-line text-faint",
        className,
      )}
    >
      {children}
    </span>
  );
}
