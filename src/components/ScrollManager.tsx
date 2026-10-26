import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrollt bei Navigation zum Anker (#preise usw.) oder an den Seitenanfang.
 * Reagiert auf location.key, damit auch ein erneuter Klick auf denselben Anker wirkt.
 */
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    // Lazy geladene Seiten brauchen evtl. einen Moment, bis das Ziel existiert.
    const timer = window.setInterval(() => {
      const el = document.getElementById(id);
      if (el || ++tries > 20) {
        window.clearInterval(timer);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
          el.focus({ preventScroll: true });
        }
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, [pathname, hash, key]);

  return null;
}
