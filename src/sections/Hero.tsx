import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, Copy, Download, FolderGit2, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { Button } from "@/components/ui/Button";
import { useCopyToClipboard } from "@/hooks/useClipboard";
import { Check } from "lucide-react";

/**
 * Landing hero: positioning, headline, CTAs, and an abstract workflow-graph
 * visual (SVG, accent-reactive, disabled under reduced motion).
 */
export function Hero() {
  const { status, copy } = useCopyToClipboard();
  const reduced = useReducedMotion();

  return (
    <section id="hero" aria-labelledby="hero-heading" className="relative overflow-hidden">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 pb-20 pt-28 sm:px-8 sm:pt-36 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pb-28">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.2em] text-faint"
          >
            <span className="text-accent">{profile.name}</span>
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
            <span className="text-accent">Automating</span> repetitive work.{" "}
            Exploring <span className="text-accent">intelligent systems</span>.
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
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 font-mono text-xs transition-colors hover:border-accent hover:text-accent"
              aria-live="polite"
            >
              {status === "copied" ? (
                <Check size={13} className="text-accent" aria-hidden="true" />
              ) : (
                <Copy size={13} aria-hidden="true" />
              )}
              {status === "copied" ? "Copied!" : status === "failed" ? "Copy failed" : profile.email}
            </button>
            <p className="text-xs leading-5 text-faint">{profile.goal}</p>
          </motion.div>
        </div>

        <WorkflowVisual />
      </div>

      {/* Scroll hint */}
      <a
        href="#about"
        aria-label="Scroll to the about section"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-faint transition-colors hover:text-accent lg:block"
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
 * Abstract workflow-automation graph: nodes, edges, and slow traveling
 * pulses. Purely decorative (aria-hidden) and honest — it encodes nothing
 * that pretends to be live data.
 */
function WorkflowVisual() {
  const reduced = useReducedMotion();
  const pulse = reduced
    ? {}
    : {
        strokeDasharray: "6 90",
        animate: { strokeDashoffset: [0, -96] },
        transition: { repeat: Infinity, duration: 3.2, ease: "linear" as const },
      };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      aria-hidden="true"
      className="relative mx-auto hidden w-full max-w-md lg:block"
    >
      <svg viewBox="0 0 420 420" className="w-full">
        <defs>
          <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="210" cy="210" r="200" fill="url(#hero-glow)" />

        {/* Concentric guide rings */}
        {[80, 132, 184].map((r) => (
          <circle key={r} cx="210" cy="210" r={r} fill="none" stroke="var(--line)" strokeDasharray="2 6" />
        ))}

        {/* Edges from center hub to orbit nodes */}
        {nodePositions.map((p) => (
          <line
            key={`edge-${p.x}-${p.y}`}
            x1="210"
            y1="210"
            x2={p.x}
            y2={p.y}
            stroke="var(--line-strong)"
            strokeWidth="1.5"
          />
        )).concat(
          // Pulses traveling along the same edges
          nodePositions.map((p, i) => (
            <line
              key={`pulse-${p.x}-${p.y}`}
              x1="210"
              y1="210"
              x2={p.x}
              y2={p.y}
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              {...pulse}
              // Stagger the pulses per edge
              {...(reduced
                ? {}
                : { transition: { ...pulse.transition, delay: i * 0.55 }, style: { display: "block" } })}
            />
          )),
        )}

        {/* Hub */}
        <circle cx="210" cy="210" r="34" fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.5" />
        <circle cx="210" cy="210" r="10" fill="var(--accent)" opacity="0.9" />
        <text x="210" y="258" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="var(--faint)" letterSpacing="2">
          build → automate → learn
        </text>

        {/* Orbit nodes */}
        {nodePositions.map((p) => (
          <g key={`node-${p.x}-${p.y}`}>
            <circle cx={p.x} cy={p.y} r="17" fill="var(--raised)" stroke="var(--line-strong)" />
            <circle cx={p.x} cy={p.y} r="5" fill="var(--accent)" opacity={p.o} />
          </g>
        ))}
      </svg>
    </motion.div>
  );
}

const nodePositions = [
  { x: 210, y: 26, o: 0.9 },
  { x: 376, y: 140, o: 0.55 },
  { x: 340, y: 350, o: 0.75 },
  { x: 96, y: 356, o: 0.6 },
  { x: 40, y: 150, o: 0.8 },
];
