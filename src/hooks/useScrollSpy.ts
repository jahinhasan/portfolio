import { useEffect, useState } from "react";
import type { SectionId } from "@/types";

/**
 * Tracks which section is currently in view for navbar highlighting.
 * Uses IntersectionObserver; falls back to the first section when the
 * API is unavailable.
 */
export function useScrollSpy(sectionIds: readonly SectionId[]): SectionId {
  const [active, setActive] = useState<SectionId>(sectionIds[0] ?? "hero");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const visible = new Map<SectionId, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as SectionId;
          if (entry.isIntersecting) visible.set(id, entry.intersectionRatio);
          else visible.delete(id);
        }
        if (visible.size === 0) return;
        const best = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
        if (best) setActive(best[0]);
      },
      // A band around the upper-middle of the viewport matches "the section
      // being read" better than the default root bounds.
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sectionIds]);

  return active;
}
