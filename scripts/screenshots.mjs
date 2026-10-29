/**
 * Erzeugt echte Screenshots der Demo für die Webseite (public/screenshots/*.webp).
 *
 *   npm run screenshots                     → Demo-Screenshots für die Webseite
 *   npm run screenshots -- --pricing <dir>  → Preisseite (Desktop + Handy) als PNG nach <dir>
 *
 * Voraussetzung: Playwright-Chromium (einmalig: npx playwright install chromium).
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { chromium } from 'playwright';

const OUT = path.resolve('public/screenshots');

const DEMO_SHOTS = [
  { name: 'dashboard', persona: 'Als Chef anmelden', path: '/demo/dashboard', viewport: { width: 1200, height: 750 }, scale: 1.2 },
  { name: 'zeiterfassung', persona: 'Als Mitarbeiterin anmelden', path: '/demo/zeiterfassung', viewport: { width: 1200, height: 750 }, scale: 1.2, prepare: showPreviousWeek },
  { name: 'urlaubskalender', persona: 'Als Urlaubsbeauftragte anmelden', path: '/demo/urlaubskalender', viewport: { width: 1200, height: 750 }, scale: 1.2 },
  { name: 'kiosk', path: '/demo/kiosk', viewport: { width: 1024, height: 712 }, scale: 1180 / 1024 },
];

/** Aktuelle Woche zuklappen, Vorwoche aufklappen und ins Bild holen. */
async function showPreviousWeek(page) {
  const heads = page.locator('[id^="kw-"][id$="-kopf"]');
  const n = await heads.count();
  if (n < 2) return;
  await heads.nth(n - 1).click();
  await heads.nth(n - 2).click();
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    const open = [...document.querySelectorAll('[id^="kw-"][id$="-kopf"]')].find((h) => h.getAttribute('aria-expanded') === 'true');
    if (open) window.scrollTo(0, open.getBoundingClientRect().top + window.scrollY - 250);
  });
}

/** Feste Uhrzeit (heute, 10:15 Uhr), damit Anwesenheiten in den Screenshots sichtbar sind. */
function screenshotTime() {
  const d = new Date();
  d.setHours(10, 15, 0, 0);
  return d;
}

/** PNG → WebP über Canvas im Browser (keine Zusatzwerkzeuge nötig). */
async function toWebp(page, png, width, quality = 0.82) {
  const dataUrl = await page.evaluate(
    async ({ b64, width, quality }) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = Math.round((img.height * width) / img.width);
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/webp', quality);
    },
    { b64: png.toString('base64'), width, quality },
  );
  return Buffer.from(dataUrl.split(',')[1], 'base64');
}

async function demoShots(browser, base) {
  await mkdir(OUT, { recursive: true });
  const encoder = await browser.newPage();
  for (const shot of DEMO_SHOTS) {
    const context = await browser.newContext({
      viewport: shot.viewport,
      deviceScaleFactor: shot.scale,
      isMobile: !!shot.mobile,
      hasTouch: !!shot.mobile,
      colorScheme: 'light',
      locale: 'de-DE',
    });
    await context.clock.setFixedTime(screenshotTime());
    const page = await context.newPage();
    await page.goto(`${base}/demo`);
    if (shot.persona) {
      await page.getByRole('button', { name: shot.persona }).click();
      await page.waitForURL('**/demo/dashboard');
      if (shot.path !== '/demo/dashboard') await page.goto(`${base}${shot.path}`);
    } else {
      await page.goto(`${base}${shot.path}`);
    }
    await page.waitForLoadState('networkidle');
    if (shot.prepare) await shot.prepare(page);
    await page.waitForTimeout(400);
    const png = await page.screenshot();
    const fullWidth = Math.round(shot.viewport.width * shot.scale);
    await writeFile(path.join(OUT, `${shot.name}.webp`), await toWebp(encoder, png, fullWidth));
    await writeFile(path.join(OUT, `${shot.name}-small.webp`), await toWebp(encoder, png, Math.round(fullWidth / 2)));
    console.log(`✓ ${shot.name}`);
    await context.close();
  }
}

async function pricingShots(browser, base, outDir) {
  await mkdir(outDir, { recursive: true });
  const variants = [
    { name: 'preise-desktop', viewport: { width: 1440, height: 900 }, scale: 1 },
    { name: 'preise-handy', viewport: { width: 390, height: 844 }, scale: 2, isMobile: true },
  ];
  for (const v of variants) {
    const context = await browser.newContext({ viewport: v.viewport, deviceScaleFactor: v.scale, isMobile: v.isMobile, hasTouch: v.isMobile, colorScheme: 'light', locale: 'de-DE' });
    const page = await context.newPage();
    await page.goto(`${base}/preise?ma=18&zahlweise=jahr&einrichtung=1`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, `${v.name}.png`), fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(`✓ ${v.name} (horizontaler Überlauf: ${overflow}px)`);
    await context.close();
  }
}

const args = process.argv.slice(2);
const pricingIdx = args.indexOf('--pricing');
const browser = await chromium.launch();
const server = await createServer({ server: { port: 5199, strictPort: true }, logLevel: 'error' });
await server.listen();
const base = 'http://localhost:5199';
try {
  if (pricingIdx >= 0) await pricingShots(browser, base, path.resolve(args[pricingIdx + 1] ?? 'screenshots'));
  else await demoShots(browser, base);
} finally {
  await browser.close();
  await server.close();
}
