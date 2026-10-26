/**
 * Erzeugt statisches HTML für die Webseiten-Routen (läuft automatisch in npm run build).
 * Die Demo bleibt eine reine Browser-App; für sie (und unbekannte Pfade) liefert der Server
 * per SPA-Fallback dist/index.html aus, das im Browser neu gerendert wird.
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DIST = path.resolve('dist');
const SSR = path.resolve('dist-ssr');

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const { render, colorSchemeScript, pageMeta, PRERENDER_ROUTES, fullTitle } = await import(
  pathToFileURL(path.join(SSR, 'entry-server.js')).href
);
const template = await readFile(path.join(DIST, 'index.html'), 'utf8');

/**
 * Statische Seiten optimieren:
 * - kleine CSS-Datei (Schrift-Definitionen) inline statt render-blockierend,
 * - Haupt-Skript erst nach dem ersten Zeichnen laden (Hydration); das HTML ist ja schon sichtbar,
 * - Modulpreloads entfernen (sie würden mit dem ersten Zeichnen um Bandbreite konkurrieren).
 */
async function optimizeHead(html) {
  for (const [tag, href] of html.matchAll(/<link rel="stylesheet" crossorigin href="([^"]+)">/g)) {
    const css = await readFile(path.join(DIST, href), 'utf8');
    html = html.replace(tag, `<style>${css}</style>`);
  }
  html = html.replace(/<link rel="modulepreload" crossorigin href="[^"]+">/g, '');
  return html.replace(
    /<script type="module" crossorigin src="([^"]+)"><\/script>/,
    (_, src) => `<script type="module">requestAnimationFrame(()=>setTimeout(()=>import(${JSON.stringify(src)})))</script>`,
  );
}

const heroPreload =
  '<link rel="preload" as="image" type="image/webp" href="/screenshots/dashboard.webp" imagesrcset="/screenshots/dashboard-small.webp 720w, /screenshots/dashboard.webp 1440w" imagesizes="(min-width: 900px) 50vw, 100vw" fetchpriority="high" />';

for (const route of PRERENDER_ROUTES) {
  const meta = pageMeta[route];
  const body = await render(route);
  // Liefert der Server diese Datei für eine andere Route aus (SPA-Fallback), bleibt der Inhalt bis zum Neu-Rendern unsichtbar.
  const guard = `<script>(function(){var p=location.pathname.replace(/\\/+$/,'')||'/';if(p!==${JSON.stringify(route)})document.documentElement.setAttribute('data-spa','')})()</script><style>[data-spa] #root{visibility:hidden}</style>`;
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(fullTitle(meta.title))}</title>`)
    .replace('</head>', `${guard}${route === '/' ? heroPreload : ''}</head>`)
    .replace('<div id="root"></div>', `${colorSchemeScript}<div id="root" data-route="${route}">${body}</div>`);
  html = await optimizeHead(html);
  if (meta.description) {
    html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${escapeHtml(meta.description)}$2`);
  }
  const file = route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route.slice(1), 'index.html');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
  console.log(`✓ ${route} → ${path.relative(process.cwd(), file)} (${Math.round(html.length / 1024)} KB)`);
}

await rm(SSR, { recursive: true, force: true });
