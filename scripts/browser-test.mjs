/**
 * End-to-end browser verification for the portfolio.
 *
 * Serves the production build, exercises every advertised interaction,
 * captures screenshots to /tmp/portfolio-shots, and asserts correctness.
 *
 * Usage:
 *   npm run build && npm run preview -- --port 4173 &   # or let this script serve
 *   node scripts/browser-test.mjs [baseURL]
 */
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://localhost:4173/";
const SHOTS = "/tmp/portfolio-shots";
mkdirSync(SHOTS, { recursive: true });

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10_000);
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(String(err)));

  await page.goto(BASE, { waitUntil: "networkidle" });

  // ---------- load & structure ----------
  check("page loads with hero heading", await page.locator("h1#hero-heading").isVisible());
  check(
    "hero carries the editorial headline",
    /building/i.test((await page.locator("h1#hero-heading").textContent()) ?? "") &&
      /digital experiences/i.test((await page.locator("h1#hero-heading").textContent()) ?? ""),
  );
  const sectionIds = await page.locator("main > div > section").evaluateAll((els) => els.map((e) => e.id));
  check(
    "all ten sections render",
    sectionIds.length === 10 &&
      ["hero", "about", "projects", "skills", "services", "archive", "experience", "education", "achievements", "contact"].every((id) => sectionIds.includes(id)),
    sectionIds.join(","),
  );
  const navHrefs = await page.locator("header nav ul a").evaluateAll((els) => els.map((a) => a.getAttribute("href")));
  check(
    "nav links match rendered section ids",
    navHrefs.every((h) => sectionIds.includes(h.slice(1))),
    `${navHrefs.length} links`,
  );
  check(
    "availability indicator shown",
    /open to work/i.test((await page.getByRole("banner").textContent()) ?? ""),
  );
  check("no horizontal overflow", (await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)));
  // overflow:hidden hides scrollbars but can still CLIP content — assert the
  // hero metadata column stays inside the layout container (same right edge
  // as the masthead row above it).
  const heroEdges = await page.evaluate(() => {
    const masthead = document.querySelector("#hero .border-y");
    const chip = [...document.querySelectorAll("#hero p")].find((p) => /freelance/i.test(p.textContent ?? ""));
    return { masthead: masthead?.getBoundingClientRect().right, chip: chip?.getBoundingClientRect().right };
  });
  check(
    "hero metadata column not clipped",
    heroEdges.masthead !== undefined && heroEdges.chip !== undefined && heroEdges.chip <= heroEdges.masthead + 1,
    JSON.stringify(heroEdges),
  );

  await page.screenshot({ path: `${SHOTS}/01-hero.png` });

  // ---------- theme & accent via customization panel ----------
  await page.getByRole("button", { name: /customize/i }).click();
  await page.waitForTimeout(400);
  check("panel opens", await page.getByRole("dialog", { name: /customize this portfolio/i }).isVisible());
  await page.screenshot({ path: `${SHOTS}/02-panel.png` });

  // Round-trip both themes: default is dark (charcoal), so flip to light and back.
  await page.getByRole("radio", { name: "light" }).click();
  check("light theme applies", (await page.evaluate(() => document.documentElement.dataset.theme)) === "light");
  await page.screenshot({ path: `${SHOTS}/03-light.png` });
  await page.getByRole("radio", { name: "dark" }).click();
  check("dark theme applies", (await page.evaluate(() => document.documentElement.dataset.theme)) === "dark");
  // Leave the visitor on light so the persistence probe below has a non-default state.
  await page.getByRole("radio", { name: "light" }).click();
  await page.waitForTimeout(100);

  await page.getByRole("radio", { name: "Cyan" }).click();
  const accent = await page.evaluate(() => document.documentElement.style.getPropertyValue("--accent").trim());
  check("cyan preset applies", accent.toLowerCase() === "#22d3ee", accent);

  await page.locator('input[type="color"]').fill("#ff6b00");
  const customAccent = await page.evaluate(() => document.documentElement.style.getPropertyValue("--accent").trim());
  check("custom color applies", customAccent.toLowerCase() === "#ff6b00", customAccent);
  await page.screenshot({ path: `${SHOTS}/04-custom-accent-light.png` });

  // persistence: reload keeps theme/accent
  await page.reload({ waitUntil: "networkidle" });
  check(
    "prefs persist across reload",
    (await page.evaluate(() => document.documentElement.dataset.theme)) === "light" &&
      (await page.evaluate(() => document.documentElement.style.getPropertyValue("--accent").trim())).toLowerCase() === "#ff6b00",
  );

  // ---------- section reorder via keyboard-accessible arrows ----------
  await page.getByRole("button", { name: /customize/i }).click();
  // Move Skills up once: default (hero, about, projects, skills) → (hero, about, skills, projects).
  // Nav follows the visitor's order, so it flips from About>Projects>Skills to About>Skills>Projects.
  const skillsRow = page.locator('li[aria-label^="Skills. Position"]');
  await skillsRow.getByRole("button", { name: "Move Skills up" }).click();
  const navAfter = await page.locator("header nav ul a").evaluateAll((els) => els.map((a) => a.textContent?.trim()));
  check("section reorder updates nav order", navAfter[0] === "About" && navAfter[1] === "Skills", navAfter.slice(0, 3).join(" > "));
  const sectionOrder = await page.locator("main > div > section").evaluateAll((els) => els.map((e) => e.id));
  check("DOM section order follows preference", sectionOrder[2] === "skills" && sectionOrder[3] === "projects", sectionOrder.slice(0, 4).join(","));

  // reset all
  await page.getByRole("button", { name: "Reset everything to default" }).click();
  await page.waitForTimeout(200);
  const navReset = await page.locator("header nav ul a").evaluateAll((els) => els.map((a) => a.textContent?.trim()));
  check("reset restores nav order", navReset[0] === "About" && navReset[1] === "Projects", navReset.slice(0, 3).join(" > "));
  check("reset restores dark theme", (await page.evaluate(() => document.documentElement.dataset.theme)) === "dark");
  const storedAfterReset = await page.evaluate(() => window.localStorage.getItem("jh-portfolio-prefs"));
  check("reset clears stored prefs", storedAfterReset === null);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // ---------- project archive ----------
  // Archive is intentionally out of the minimal navbar — travel by hash.
  await page.evaluate(() => {
    location.hash = "#archive";
  });
  await page.waitForTimeout(300);
  const cardsBefore = await page.locator("#archive article").count();
  check("archive shows non-featured projects", cardsBefore >= 5, `${cardsBefore} cards`);
  await page.getByRole("searchbox", { name: /search projects/i }).fill("pypdf");
  await page.waitForTimeout(300);
  const cardsSearch = await page.locator("#archive article").count();
  check("search filters to matches", cardsSearch === 1, `${cardsSearch} card`);
  await page.getByRole("button", { name: "Clear search" }).click();
  await page.getByRole("button", { name: /filter by category.*robotics/i }).or(page.getByRole("button", { name: /^Robotics/ })).first().click();
  await page.waitForTimeout(200);
  const roboticsCards = await page.locator("#archive article").count();
  check("category filter works", roboticsCards === 1, `${roboticsCards} card`);
  await page.getByRole("button", { name: /^All/ }).click();

  // list layout toggle
  await page.getByRole("button", { name: "List view" }).click();
  await page.waitForTimeout(200);
  check("list layout applies", await page.locator("#archive article").first().locator("h3").isVisible());
  await page.screenshot({ path: `${SHOTS}/05-archive-list.png` });
  await page.reload({ waitUntil: "networkidle" });
  const layoutKept = await page.evaluate(() => JSON.parse(window.localStorage.getItem("jh-portfolio-prefs") ?? "{}").projectLayout);
  check("layout persists after reload", layoutKept === "list", String(layoutKept));
  await page.evaluate(() => {
    location.hash = "#archive";
  });
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "Grid view" }).click();

  // ---------- project detail dialog ----------
  await page.locator("#archive article").first().getByRole("button", { name: /details about/i }).click();
  await page.waitForTimeout(300);
  check("detail dialog opens", await page.getByRole("dialog").isVisible());
  const dialogText = await page.getByRole("dialog").textContent();
  check("dialog shows problem/approach/learnings", /The problem/.test(dialogText ?? "") && /Approach/.test(dialogText ?? "") && /learnings/i.test(dialogText ?? ""));
  await page.screenshot({ path: `${SHOTS}/06-detail-dialog.png` });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  check("escape closes dialog", (await page.getByRole("dialog").count()) === 0);

  // ---------- copy email ----------
  await page.locator('a[href="#contact"]').first().click();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /^Copy email/i }).click();
  await page.waitForTimeout(200);
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  check("copy email works", clip === "jahinhasan01@gmail.com", clip);
  check("copy feedback shown", /Copied/.test(await page.locator('button[aria-label^="Copy email"]').textContent() ?? ""));

  // ---------- CV download link ----------
  const cvStatus = await page.evaluate(async (base) => {
    const res = await fetch(base.replace(/\/$/, "") + "/documents/Md_Jahin_Hasan_CV.pdf");
    return res.status;
  }, BASE);
  check("CV asset exists", cvStatus === 200, `HTTP ${cvStatus}`);

  // ---------- github links ----------
  const ghLinks = await page.evaluate(() =>
    [...document.querySelectorAll('a[href*="github.com/jahinhasan"]')].map((a) => a.href),
  );
  check("github repo links present", ghLinks.length >= 10, `${ghLinks.length} links`);
  const badGh = ghLinks.filter(
    (h) =>
      !/^https:\/\/github\.com\/jahinhasan\/[\w.-]+\/?(\?.*)?$/.test(h) &&
      h !== "https://github.com/jahinhasan" &&
      h !== "https://github.com/jahinhasan?tab=repositories",
  );
  check("no malformed github links", badGh.length === 0, badGh.join(", "));

  // ---------- mobile ----------
  const mobile = await context.newPage();
  await mobile.setViewportSize({ width: 390, height: 844 });
  await mobile.goto(BASE, { waitUntil: "networkidle" });
  check("mobile: no horizontal overflow", await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await mobile.getByRole("button", { name: "Open menu" }).click();
  await mobile.waitForTimeout(300);
  check("mobile menu opens", await mobile.locator("#mobile-menu").isVisible());
  await mobile.screenshot({ path: `${SHOTS}/07-mobile-menu.png` });
  await mobile.locator('#mobile-menu a[href="#projects"]').click();
  await mobile.waitForTimeout(600);
  check("mobile menu closes on nav", (await mobile.locator("#mobile-menu").count()) === 0);
  await mobile.screenshot({ path: `${SHOTS}/08-mobile-projects.png` });
  await mobile.close();

  // ---------- reduced motion sanity ----------
  const rm = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const rmPage = await rm.newPage();
  await rmPage.goto(BASE, { waitUntil: "networkidle" });
  check("reduced motion: page loads", await rmPage.locator("h1#hero-heading").isVisible());
  await rm.close();

  // ---------- console errors ----------
  check("no console errors", consoleErrors.length === 0, consoleErrors.slice(0, 3).join(" | "));

  // full-page screenshot at the end (default light, default accent);
  // scroll through first so scroll-reveal animations have fired everywhere
  await page.evaluate(() => window.localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.7);
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${SHOTS}/09-full.png`, fullPage: true });

  await browser.close();

  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  if (failed.length) {
    console.log("FAILED:", failed.map((f) => f.name).join(", "));
    process.exit(1);
  }
}

// Serve dist if no server is already up.
const base = BASE;
const isUp = await fetch(base, { method: "HEAD" }).then(() => true, () => false);
if (!isUp) {
  console.log("starting vite preview…");
  const server = spawn("npx", ["vite", "preview", "--port", "4173", "--strictPort"], { stdio: "ignore", detached: true });
  await new Promise((r) => setTimeout(r, 1500));
  process.on("exit", () => process.kill(-server.pid, "SIGTERM"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
