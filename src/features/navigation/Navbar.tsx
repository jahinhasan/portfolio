import { useEffect, useState } from "react";
import { Menu, Palette, X } from "lucide-react";
import type { SectionId } from "@/types";
import { getSectionMeta } from "@/data/navigation";
import { profile } from "@/data/profile";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { cn } from "@/lib/cn";

interface NavbarProps {
  sectionOrder: readonly SectionId[];
  onOpenCustomize: () => void;
}

/**
 * Minimal editorial navbar: JH mark, the four primary links (About,
 * Projects, Skills, Contact — order follows the visitor's section order),
 * a live availability indicator, and a CSS scroll-progress hairline.
 * Solid backgrounds only — no translucency tricks.
 */
export function Navbar({ sectionOrder, onOpenCustomize }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useScrollSpy(sectionOrder);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navSections = sectionOrder.filter((id) => getSectionMeta(id).inNavbar);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-colors duration-200",
          scrolled || menuOpen ? "border-b border-line bg-bg" : "border-b border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8"
        >
          <a
            href="#hero"
            className="flex items-center gap-2.5"
            aria-label={`${profile.name} — back to top`}
          >
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center bg-accent font-display text-[13px] text-accent-fg"
            >
              JH
            </span>
            <span className="hidden font-mono text-xs uppercase tracking-[0.18em] text-muted sm:inline">
              {profile.shortName}
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-6 lg:flex">
            {navSections.map((id) => {
              const meta = getSectionMeta(id);
              const isActive = active === id;
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "link-underline relative py-1.5 font-mono text-[13px] uppercase tracking-[0.14em] transition-colors",
                      isActive ? "text-accent-ink" : "text-muted hover:text-ink",
                    )}
                  >
                    {meta.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            {/* Availability indicator */}
            <p className="hidden items-center gap-2 border border-line px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted md:inline-flex">
              <span className="relative flex size-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping bg-accent opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 bg-accent" />
              </span>
              Open to work
            </p>
            <button
              type="button"
              onClick={onOpenCustomize}
              className="inline-flex h-9 items-center gap-2 border border-line px-3 font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:border-accent hover:text-accent-ink"
              aria-haspopup="dialog"
            >
              <Palette size={15} aria-hidden="true" />
              <span className="hidden sm:inline">Customize</span>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-9 w-9 items-center justify-center border border-line text-muted transition-colors hover:text-ink lg:hidden"
            >
              {menuOpen ? <X size={17} aria-hidden="true" /> : <Menu size={17} aria-hidden="true" />}
            </button>
          </div>
        </nav>
        {/* Scroll progress — pure CSS, only where scroll-timeline is supported */}
        <div className="scroll-progress" aria-hidden="true" />
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        sectionOrder={sectionOrder}
        active={active}
      />
    </>
  );
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  sectionOrder: readonly SectionId[];
  active: SectionId;
}

function MobileMenu({ open, onClose, sectionOrder, active }: MobileMenuProps) {
  const containerRef = useFocusTrap<HTMLDivElement>({
    active: open,
    onEscape: onClose,
  });

  if (!open) return null;

  return (
    <div id="mobile-menu" className="fixed inset-0 z-30 lg:hidden">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-black/60" />
      <div
        ref={containerRef}
        className="absolute inset-x-0 top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-bg p-5"
      >
        <ul className="space-y-1" aria-label="Site sections">
          {sectionOrder.map((id) => {
            const meta = getSectionMeta(id);
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={onClose}
                  aria-current={active === id ? "true" : undefined}
                  className={cn(
                    "flex items-center gap-3 border-l-2 px-3 py-2.5 text-base font-medium transition-colors",
                    active === id
                      ? "border-accent bg-raised text-accent-ink"
                      : "border-line text-muted hover:bg-raised hover:text-ink",
                  )}
                >
                  <span aria-hidden="true" className="font-mono text-[10px] text-faint">
                    {meta.index}
                  </span>
                  {meta.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
