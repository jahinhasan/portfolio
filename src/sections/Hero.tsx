import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, Check, Copy, Download, FolderGit2, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { Button } from "@/components/ui/Button";
import { useCopyToClipboard } from "@/hooks/useClipboard";
import portrait from "@/assets/jahin.jpg";

/** Floating labels around the portrait — hue-coded, matching the brand mix. */
const chips = [
  { label: "Web Development", hue: "#6d4aff", className: "left-[-2.5rem] top-[14%] lg:left-[-3.5rem]" },
  { label: "Automation", hue: "#0891b2", className: "right-[-1.5rem] top-[44%] lg:right-[-2.5rem]" },
  { label: "Intelligent Systems", hue: "#db2777", className: "bottom-[10%] left-[-1rem] lg:left-[-2rem]" },
] as const;

/**
 * Landing hero: positioning, headline, CTAs, and the owner's portrait in a
 * gradient frame with floating discipline chips. The pastel color field and
 * animations are decorative and switched off under reduced motion.
 */
export function Hero() {
  const { status, copy } = useCopyToClipboard();
  const reduced = useReducedMotion();

  return (
    <section id="hero" aria-labelledby="hero-heading" className="relative overflow-hidden">
      <div className="hero-glow" aria-hidden="true" />
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 pb-20 pt-28 sm:px-8 sm:pt-36 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pb-28">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.2em] text-faint"
          >
            <span className="text-accent-ink">{profile.name}</span>
            <span aria-hidden="true">/</span>
            <span>{profile.location}</span>
          </motion.p>

          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="max-w-2xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-balance text-ink sm:text-5xl lg:text-[3.4rem]"
          >
            Building useful software.{" "}
            <span className="text-gradient">Automating</span> repetitive work.{" "}
            Exploring <span className="text-gradient">intelligent systems</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {profile.heroIntro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button href="#projects">
              <FolderGit2 size={16} aria-hidden="true" />
              Explore Projects
            </Button>
            <Button href={profile.cvPath} variant="outline" download>
              <Download size={16} aria-hidden="true" />
              Download CV
            </Button>
            <Button href="#contact" variant="ghost">
              <Mail size={16} aria-hidden="true" />
              Contact
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center gap-3 text-sm text-muted"
          >
            <button
              type="button"
              onClick={() => void copy(profile.email)}
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 font-mono text-xs transition-colors hover:border-accent hover:text-accent-ink"
              aria-live="polite"
            >
              {status === "copied" ? (
                <Check size={13} className="text-accent-ink" aria-hidden="true" />
              ) : (
                <Copy size={13} aria-hidden="true" />
              )}
              {status === "copied" ? "Copied!" : status === "failed" ? "Copy failed" : profile.email}
            </button>
            <p className="text-xs leading-5 text-faint">{profile.goal}</p>
          </motion.div>
        </div>

        <PortraitCard />
      </div>

      {/* Scroll hint */}
      <a
        href="#about"
        aria-label="Scroll to the about section"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-faint transition-colors hover:text-accent-ink lg:block"
      >
        <motion.span
          animate={reduced ? undefined : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="block"
        >
          <ArrowDown size={18} aria-hidden="true" />
        </motion.span>
      </a>
    </section>
  );
}

/**
 * Portrait in a conic-gradient frame with floating discipline chips.
 * Chips are decorative labels, not links, so they are aria-hidden and
 * duplicated by the surrounding headline/section content.
 */
function PortraitCard() {
  const reduced = useReducedMotion();
  const float = (delay: number) =>
    reduced
      ? {}
      : {
          animate: { y: [0, -7, 0] },
          transition: { repeat: Infinity, duration: 4.2, ease: "easeInOut" as const, delay },
        };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="relative mx-auto w-full max-w-xs pb-10 lg:max-w-sm"
    >
      {/* Gradient frame + soft plate shadow */}
      <div className="portrait-ring rounded-[1.75rem] p-[3px] shadow-[0_24px_60px_-24px_rgb(109_74_255/0.45)]">
        <div className="overflow-hidden rounded-[calc(1.75rem-3px)] bg-raised">
          <img
            src={portrait}
            alt="Portrait of Md. Jahin Hasan"
            width={1117}
            height={1600}
            className="aspect-[4/5] w-full object-cover object-top"
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      {/* Floating discipline chips */}
      {chips.map((chip, i) => (
        <motion.span
          key={chip.label}
          aria-hidden="true"
          {...float(i * 0.9)}
          className={`absolute flex items-center gap-2 rounded-full border border-line bg-surface/90 py-1.5 pl-2 pr-3 text-xs font-medium text-ink shadow-[0_10px_30px_-12px_rgb(23_26_36/0.35)] backdrop-blur-sm ${chip.className}`}
        >
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: chip.hue, boxShadow: `0 0 10px ${chip.hue}` }}
          />
          {chip.label}
        </motion.span>
      ))}

      {/* Mono caption under the plate */}
      <p
        aria-hidden="true"
        className="mt-3 text-center font-mono text-[11px] uppercase tracking-[0.24em] text-faint"
      >
        build → automate → learn
      </p>
    </motion.div>
  );
}
