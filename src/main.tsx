import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/inter/wght.css';
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
} else {
  container.textContent = '';
  createRoot(container).render(app);
  document.documentElement.removeAttribute('data-spa');
}
