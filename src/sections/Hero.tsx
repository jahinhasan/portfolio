import { motion } from "motion/react";
import { ArrowDown, Download, FolderGit2, Mail } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { profile } from "@/data/profile";
import { Button } from "@/components/ui/Button";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
});

/**
 * Editorial hero: an oversized typographic composition instead of a
 * centered hero. Name/positioning run in a mono masthead row, the
 * display headline carries the page, and a right-hand metadata column
 * holds availability, location, and links. No imagery — type is the hero.
 */
export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-heading" className="blueprint-grid relative overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-28 sm:px-8 sm:pt-36 lg:pb-24">
        {/* Masthead row */}
        <motion.p
          {...fade(0)}
          className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 border-y border-line py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-faint sm:text-xs"
        >
          <span className="text-accent-ink">{profile.name}</span>
          <span aria-hidden="true">/</span>
          <span>{profile.role}</span>
          <span aria-hidden="true" className="hidden sm:inline">/</span>
          <span className="hidden sm:inline">{profile.location}</span>
        </motion.p>

        {/* minmax(0,1fr) keeps the display type's long unbreakable word
            ("EXPERIENCES.") from inflating the track and pushing the
            metadata column past the viewport. */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end lg:gap-16">
          {/* Display composition */}
          <div>
            <motion.h1 {...fade(0.06)} id="hero-heading" className="display-hero text-ink">
              Building
              <br />
              <span className="display-outline">digital</span>{" "}
              <span className="marker">experiences.</span>
            </motion.h1>

            <motion.p
              {...fade(0.14)}
              className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            >
              {profile.heroIntro}
            </motion.p>

            <motion.div {...fade(0.2)} className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="#projects">
                <FolderGit2 size={16} aria-hidden="true" />
                View Projects
              </Button>
              <Button href="#contact" variant="outline">
                <Mail size={16} aria-hidden="true" />
                Get in Touch
              </Button>
              <Button href={profile.cvPath} variant="ghost" download>
                <Download size={16} aria-hidden="true" />
                Download CV
              </Button>
            </motion.div>
          </div>

          {/* Metadata column */}
          <motion.div {...fade(0.26)} className="space-y-4 font-mono text-xs lg:pb-2 lg:text-right">
            <p className="inline-flex max-w-full flex-wrap items-center gap-2 border border-line-strong bg-surface px-3 py-2 uppercase tracking-[0.14em] text-ink">
              <span className="relative flex size-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping bg-accent opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 bg-accent" />
              </span>
              {profile.availability}
            </p>
            <p className="uppercase tracking-[0.14em] text-faint">Based in {profile.location}</p>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline inline-flex items-center gap-2 uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent-ink"
            >
              <GithubIcon size={14} aria-hidden="true" />
              github/jahinhasan
            </a>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.a
          {...fade(0.34)}
          href="#about"
          aria-label="Scroll to the about section"
          className="mt-16 hidden items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-faint transition-colors hover:text-accent-ink lg:inline-flex"
        >
          <ArrowDown size={14} aria-hidden="true" className="animate-bounce motion-reduce:animate-none" />
          scroll
        </motion.a>
      </div>
    </section>
  );
}
