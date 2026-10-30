/**
 * Breakpoint audit: capture the site at every required breakpoint and
 * assert no horizontal overflow at any of them. Requires a server on
 * :4173 (`npm run preview`).
 *
 * Usage: node scripts/breakpoint-shot.mjs   → /tmp/bp-<width>.png + pass/fail
 */
import { chromium } from "playwright";

const BASE = "http://localhost:4173/";
const WIDTHS = [320, 375, 430, 768, 1024, 1440, 1920];

const browser = await chromium.launch();
for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(BASE, { waitUntil: "networkidle" });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  // Scroll through so reveals fire, then full-page shot.
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.7);
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `/tmp/bp-${width}.png`, fullPage: true });
  console.log(`${width}px  overflow=${overflow}px  ${overflow <= 1 ? "OK" : "FAIL"}`);
  await page.close();
}
await browser.close();
