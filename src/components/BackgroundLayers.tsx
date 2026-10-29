import { useEffect, useRef } from "react";

/**
 * Fixed, decorative background: drifting aurora blobs, a morphing organic
 * shape, a pointer-following spotlight, and film grain (all styled in
 * global.css). The spotlight is wired here — pointer coordinates are
 * mirrored into CSS custom properties on rAF, and only for fine pointers
 * with motion allowed; otherwise the gradient rests at its default corner.
 */
export function BackgroundLayers() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let raf = 0;
    const onMove = (event: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        el.style.setProperty("--pointer-x", `${event.clientX}px`);
        el.style.setProperty("--pointer-y", `${event.clientY}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="bg-layers">
      <div className="bg-blob bg-blob--violet" />
      <div className="bg-blob bg-blob--cyan" />
      <div className="bg-blob bg-blob--rose" />
      <div className="bg-blob bg-blob--amber" />
      <div className="bg-morph" />
      <div className="bg-spotlight" />
      <div className="bg-grain" />
    </div>
  );
}
