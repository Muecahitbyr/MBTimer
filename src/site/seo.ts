import { pricedTiers, vatNote } from '../config/pricing';
import { ca } from './pricing/format';

const DEFAULT_TITLE = 'MBTimer – Arbeitszeiterfassung für Betriebe mit Mitarbeitern';
const DEFAULT_DESCRIPTION =
  'MBTimer – webbasierte Arbeitszeiterfassung mit Personalverwaltung für Betriebe jeder Branche. Stempeln am Tablet, Urlaub, Krankmeldungen, Zeitkorrekturen.';

export interface PageMeta {
  title: string | null;
  description?: string;
}

const cheapest = Math.min(...pricedTiers().map((t) => t.monthlyNet ?? Infinity));

/** Seitentitel und Beschreibungen – genutzt im Browser (usePageMeta) und beim Prerendering. */
export const pageMeta: Record<string, PageMeta> = {
  '/': { title: null, description: DEFAULT_DESCRIPTION },
  '/preise': {
    title: 'Preise',
    description: `MBTimer-Tarife ab ${ca(cheapest)} pro Monat (${vatNote()}), alle Funktionen inklusive. Unverbindlicher Kostenrechner für Ihren Betrieb.`,
  },
  '/impressum': { title: 'Impressum' },
  '/datenschutz': { title: 'Datenschutz' },
  '/demo': { title: 'Demo', description: 'Interaktive Demo von MBTimer am Beispiel eines fiktiven Betriebs – alle Daten sind erfunden.' },
};

/** Routen, die beim Build als statisches HTML erzeugt werden. */
export const PRERENDER_ROUTES = Object.keys(pageMeta);

export function fullTitle(title: string | null): string {
  return title ? `${title} | MBTimer` : DEFAULT_TITLE;
}

export function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/';
}
