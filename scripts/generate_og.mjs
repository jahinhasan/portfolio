/** Renders scripts/og-source.html to public/images/og-image.png (1200x630). */
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(root, "scripts", "og-source.html");
const out = join(root, "public", "images", "og-image.png");
mkdirSync(join(root, "public", "images"), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
await page.goto(`file://${source}`);
await page.waitForTimeout(300);
await page.screenshot({ path: out, type: "png" });
await browser.close();
console.log(`wrote ${out}`);
