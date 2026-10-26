import { StrictMode } from 'react';
import { prerender } from 'react-dom/static';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import Root from './Root';
import App from './App';

export { PRERENDER_ROUTES, fullTitle, pageMeta } from './site/seo';

/** Rendert eine Route zu HTML (wartet auf lazy geladene Seiten). Emotion schreibt die Styles inline mit. */
export async function render(url: string): Promise<string> {
  const { prelude } = await prerender(
    <StrictMode>
      <Root>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </Root>
    </StrictMode>,
  );
  return new Response(prelude).text();
}

/** Setzt hell/dunkel vor dem ersten Zeichnen (verhindert Aufblitzen im Dunkelmodus). */
export const colorSchemeScript = renderToStaticMarkup(<InitColorSchemeScript attribute="class" defaultMode="system" />);
