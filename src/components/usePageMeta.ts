import { useEffect } from 'react';
import { fullTitle, type PageMeta } from '../site/seo';

/** Setzt Seitentitel und Meta-Beschreibung (ohne Zusatzbibliothek). */
export function usePageMeta({ title, description }: PageMeta) {
  useEffect(() => {
    document.title = fullTitle(title);
    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      const previous = meta?.getAttribute('content');
      meta?.setAttribute('content', description);
      return () => {
        if (previous) meta?.setAttribute('content', previous);
      };
    }
  }, [title, description]);
}
