import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal, kept deliberately boring: a plain IntersectionObserver +
 * CSS transition instead of a JS animation loop. JS-driven reveals can
 * crawl under load (or never fire for screenshot/print/crawler contexts),
 * leaving sections invisible — so this also force-reveals after 2.5s and
 * reveals instantly under prefers-reduced-motion.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    // A section still unrevealed after 2.5s loses the animation — content
    // visibility always wins over decoration.
    const failsafe = window.setTimeout(() => setShown(true), 2500);
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          io.disconnect();
          window.clearTimeout(failsafe);
        }
      },
      { rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  return { ref, shown };
}
