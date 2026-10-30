# Jahin Hasan — Portfolio

Personal portfolio for **Jahin Hasan** — developer positioned as
*Frontend Developer | Web Developer | Automation Enthusiast*, available for freelance
projects. Single-page React app, no backend, everything a visitor customizes stays in
their own browser. Neo-brutalist editorial design: deep charcoal, warm off-white type,
an acid-lime accent, Archivo Black display headlines, hairline rules, hard offset
shadows, and a light "warm paper" theme as the alternative.

## Stack

- **React 19** + **TypeScript** (strict) + **Vite 7**
- **Tailwind CSS v4** (design tokens via `@theme inline`)
- **Motion** for entrance fades; scroll reveals use IntersectionObserver +
  CSS transitions with a fail-safe timer (respects `prefers-reduced-motion`)
- **Pure-CSS devices** — blueprint dot grid, animated link underlines, a
  scroll-progress hairline (`animation-timeline: scroll()` where supported)
- **dnd-kit** for drag-and-drop (section ordering, featured project rows)
- **lucide-react** icons + a few local inline SVGs
- **Vitest** + **Testing Library** (83 unit tests) and a **Playwright** browser suite (35 checks)

## Quick start

```bash
npm install
npm run dev          # dev server at http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run build:pages` | Production build with `base=/portfolio/` (GitHub Pages project site) |
| `npm run preview` | Serve `dist/` locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc -b --noEmit` |
| `npm run test` | Vitest unit suite |
| `npm run test:browser` | Playwright end-to-end suite (serves `dist/` itself) |
| `npm run og` | Regenerate `public/images/og-image.png` from `scripts/og-source.html` |
| `python3 scripts/generate_cv.py` | Regenerate the placeholder CV PDF |

## Deploying

The site is static — `dist/` is the whole deliverable.

**GitHub Pages (project site):** already wired up — `.github/workflows/deploy.yml`
builds with `base=/portfolio/` and publishes on every push to `main` (or a manual
"Run workflow" click). Pages must be set to **Source: GitHub Actions** in repo settings.
The build assumes the site lives at `https://<user>.github.io/portfolio/` — if you deploy somewhere
else (custom domain, Netlify, Vercel root), update:

1. `index.html` — `<link rel="canonical">` and the JSON-LD `url`
2. `public/sitemap.xml` — the single `<loc>`
3. `src/data/profile.ts` — `siteUrl`

**Never pushed automatically by any tooling here.** Push decisions stay with you.

## Editing content

All content lives in typed data files under `src/data/` — edit these, not components:

| File | Contents |
| --- | --- |
| `profile.ts` | Name, positioning, availability, email, phone, location, about paragraphs. `linkedin` is `null` until a real URL exists — the UI hides LinkedIn entirely while it's null. |
| `projects.ts` | All 12 projects. Exactly four are `featured: true` (the Selected Projects showcase — a test enforces which); the rest go to the archive. `demo` stays `undefined` unless a live demo actually exists (a test enforces this). `mirrorOf` marks a repo that duplicates another entry. |
| `skills.ts` | 4 skill groups (Frontend / Backend / Database / Tools). Every skill carries `evidence` — project ids that prove it, shown as tooltips. Don't add a skill you can't evidence. |
| `experience.ts` | Experience timeline, education, achievements. Only the verified UIU CSE Fest 2025 result is listed. Education has no invented years — add real ones when you want them. |
| `navigation.ts` | Section labels and the default section order. |

After editing, run `npm run test` — the data-integrity tests catch broken ids, missing
evidence, unfeatured-catalog mismatches, and fabricated demo links.

## Swapping assets

- **CV**: `public/documents/Md_Jahin_Hasan_CV.pdf` is the official CV (same
  filename, or update `cvPath` in `profile.ts`). Regenerate a placeholder with
  `python3 scripts/generate_cv.py` if ever needed.
- **OG image**: edit `scripts/og-source.html`, run `npm run og`. Output is a 2400×1260
  (2× DPR) PNG referenced by the social meta tags.

## Visitor customization (how it works)

The **Customize** button in the navbar opens a panel where each visitor can:

- Switch dark (charcoal, default) / light (warm paper) theme and pick one of six
  accent presets (acid lime leads) or any custom color — foreground text is
  re-derived for contrast (WCAG AA) on every choice
- Reorder the ten page sections by dragging (or with keyboard: handle → Space → arrows →
  Space; every row also has ↑/↓ buttons)
- Reorder the featured project grid and toggle which projects are featured
- Switch the archive between grid and list layouts
- Reset individual settings or everything

All of it persists to `localStorage` under `jh-portfolio-prefs` (schema-versioned and
validated on load — corrupt or partial data falls back to defaults). Nothing leaves the
browser; the panel says so explicitly. The published site, its source, and other visitors
are never affected.

## Testing

- `src/test/` — storage abstraction, order resolution, preference validation, filtering,
  contrast math, data integrity, provider behavior (83 tests)
- `scripts/browser-test.mjs` — real-Chromium checks: editorial hero, ten sections,
  availability indicator, theme/accent application and persistence, section reorder →
  nav sync, archive search/filter/layout, dialogs, clipboard, CV asset, GitHub links,
  mobile viewport overflow, reduced motion (35 checks)

```bash
npm test && npm run test:browser
```

## Structure

```text
src/
  components/      ui primitives (Button, Dialog, SectionShell, Tag, icons)
  sections/        the ten page sections
  features/
    customization/ preferences model, context, theme application, panel
    projects/      cards, archive, filtering, detail dialogs, artwork
    navigation/    navbar, mobile menu, back-to-top
  data/            ALL editable content (see above)
  hooks/           scrollspy, focus trap, clipboard
  lib/             storage, color math, ordering utilities
  styles/          global.css (design tokens)
  types/           shared TypeScript types
scripts/           browser tests, OG/CV generators
public/            favicon, robots.txt, sitemap.xml, documents/, images/
```

## Before you publish — confirm these

- [ ] **Canonical URL** — `index.html`, `sitemap.xml`, `profile.ts` assume
      `https://jahinhasan.github.io/portfolio/`; change if deploying elsewhere
- [ ] **LinkedIn** — no URL is invented; add the real one in `src/data/profile.ts`
- [ ] **Education years** — enrollment/expected graduation are deliberately blank
- [ ] **ShopSync role split** — confirm how you'd phrase individual vs team contribution
- [ ] **Deployment target** — then decide if `base=/portfolio/` (`build:pages`) still applies

## Design system quick reference

| Token | Dark (default) | Light |
| --- | --- | --- |
| `--bg` | `#121411` deep charcoal | `#f1efe7` warm paper |
| `--surface` | `#191c17` | `#faf9f3` |
| `--ink` | `#f1efe7` warm off-white | `#1b1d16` |
| `--accent` (default preset) | `#c8f04d` acid lime | same, `--accent-ink` darkened for text |

House rules: no gradients, no glassmorphism, no rounded cards, no floating shapes,
no skill bars. Type: Archivo Black (display, uppercase) / Inter (body) / JetBrains Mono
(metadata). Screenshots of real projects only — `screenshot` stays unset otherwise.
