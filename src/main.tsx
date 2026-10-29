import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/inter-tight/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import Root from './Root';
import App from './App';
import { normalizePath } from './site/seo';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <Root>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Root>
  </StrictMode>
);

// Vorgerenderte Seiten (npm run build) werden hydriert. Liefert der Server das HTML einer anderen Route
// aus (SPA-Fallback, z. B. für /demo), wird neu gerendert.
const prerendered = container.dataset.route;
if (prerendered && prerendered === normalizePath(window.location.pathname)) {
  hydrateRoot(container, app);
  replayEarlyClick();
} else {
  // Kein Nachholen nötig (Inhalt war bis hierher unsichtbar) – Klick-Merker sofort abschalten.
  (window as Window & { __mbtReady?: boolean }).__mbtReady = true;
  container.textContent = '';
  createRoot(container).render(app);
  document.documentElement.removeAttribute('data-spa');
}

/**
 * Ein Klick auf einen Button, bevor die vorgerenderte Seite interaktiv war, wurde vom Inline-Skript
 * (scripts/prerender.mjs) zurückgehalten. Sobald React den Button übernommen hat, wird er nachgeholt.
 * Zeichnet React einen Bereich neu statt ihn zu übernehmen (z. B. nachgeladene Seiten), wird der Button
 * über Text und Position wiedergefunden.
 */
function replayEarlyClick() {
  const w = window as Window & { __mbtReady?: boolean; __mbtTakeClick?: () => HTMLElement | null };
  w.__mbtReady = true;
  const target = w.__mbtTakeClick?.();
  if (!target) return;
  const text = target.textContent?.trim() ?? '';
  const sameText = () =>
    [...document.querySelectorAll<HTMLElement>('button,[role="button"]')].filter((el) => (el.textContent?.trim() ?? '') === text);
  const index = sameText().indexOf(target);
  const hydrated = (el: HTMLElement) => Object.keys(el).some((k) => k.startsWith('__reactProps'));
  const deadline = Date.now() + 10_000;
  const tick = () => {
    if (Date.now() > deadline) return;
    const candidate = target.isConnected ? target : sameText()[index];
    if (candidate && hydrated(candidate)) candidate.click();
    else window.setTimeout(tick, 50);
  };
  tick();
}
