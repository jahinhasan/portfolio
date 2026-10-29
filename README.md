# Jahin Hasan — Portfolio

Personal portfolio for **Md. Jahin Hasan** — CSE undergraduate at BAUST, Rangpur, focused on
web development and automation. Single-page React app, no backend, everything a visitor
customizes stays in their own browser. White-first design with a dark mode, a signature
violet→cyan→rose gradient, and a hero portrait.

## Stack

- **React 19** + **TypeScript** (strict) + **Vite 7**
- **Tailwind CSS v4** (design tokens via `@theme inline`)
- **Motion** for hero/panel animation; scroll reveals use IntersectionObserver +
  CSS transitions with a fail-safe timer (respects `prefers-reduced-motion`)
- **Living background** — drifting aurora blobs, a morphing organic shape, a
  pointer-following spotlight, and film grain (`BackgroundLayers`, all
  transform/opacity-only and frozen under reduced motion)
- **dnd-kit** for drag-and-drop (section ordering, featured grid)
- **lucide-react** icons + a few local inline SVGs
- **Vitest** + **Testing Library** (83 unit tests) and a **Playwright** browser suite (32 checks)

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

**GitHub Pages (project site):** push the repo to GitHub, then either

```bash
npm run build:pages && npx gh-pages -d dist
```

or add a Pages workflow that runs `npm run build:pages` and publishes `dist/`. The build
assumes the site lives at `https://<user>.github.io/portfolio/` — if you deploy somewhere
else (custom domain, Netlify, Vercel root), update:

1. `index.html` — `<link rel="canonical">` and the JSON-LD `url`
2. `public/sitemap.xml` — the single `<loc>`
3. `src/data/profile.ts` — `siteUrl`

**Never pushed automatically by any tooling here.** Push decisions stay with you.

## Editing content

All content lives in typed data files under `src/data/` — edit these, not components:

| File | Contents |
| --- | --- |
| `profile.ts` | Name, role, email, phone, location, about paragraphs. `linkedin` is `null` until a real URL exists — the UI hides LinkedIn entirely while it's null. |
| `projects.ts` | All 12 projects. `featured: true` puts one in the homepage grid; the rest go to the archive. `demo` stays `undefined` unless a live demo actually exists (a test enforces this). `mirrorOf` marks a repo that duplicates another entry. |
| `skills.ts` | 7 skill groups. Every skill carries `evidence` — project ids that prove it, shown as tooltips. Don't add a skill you can't evidence. |
| `experience.ts` | Experience timeline, education, achievements. Only the verified UIU CSE Fest 2025 result is listed. Education has no invented years — add real ones when you want them. |
| `navigation.ts` | Section labels and the default section order. |

After editing, run `npm run test` — the data-integrity tests catch broken ids, missing
evidence, unfeatured-catalog mismatches, and fabricated demo links.

## Swapping assets

- **CV**: replace `public/documents/Md_Jahin_Hasan_CV.pdf` with your real CV (same
  filename, or update `cvPath` in `profile.ts`). The current file is a generated
  placeholder, clearly footnoted as such.
- **OG image**: edit `scripts/og-source.html`, run `npm run og`. Output is a 2400×1260
  (2× DPR) PNG referenced by the social meta tags.

## Visitor customization (how it works)

The **Customize** button in the navbar opens a panel where each visitor can:

- Switch dark/light theme and pick one of six accent presets or any custom color —
  foreground text is re-derived for contrast (WCAG AA) on every choice
- Reorder the nine page sections by dragging (or with keyboard: handle → Space → arrows →
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
- `scripts/browser-test.mjs` — real-Chromium checks: theme/accent application and
  persistence, section reorder → nav sync, archive search/filter/layout, dialogs,
  clipboard, CV asset, GitHub links, mobile viewport overflow, reduced motion (32 checks)

```bash
npm test && npm run test:browser
```

## Structure

```text
src/
  components/      ui primitives (Button, Dialog, SectionShell, Tag, icons)
  sections/        the nine page sections
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
- [ ] **CV** — replace the generated placeholder with your official document
- [ ] **Deployment target** — then decide if `base=/portfolio/` (`build:pages`) still applies
