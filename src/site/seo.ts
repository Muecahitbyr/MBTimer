import { pricedTiers, vatNote } from '../config/pricing';
import { ca } from './pricing/format';

const DEFAULT_TITLE = 'MBzeit – Arbeitszeiterfassung für Arzt- und Zahnarztpraxen';
const DEFAULT_DESCRIPTION =
  'MBzeit – webbasierte Arbeitszeiterfassung mit Personalverwaltung für Arzt- und Zahnarztpraxen. Stempeln am Tablet, Urlaub, Krankmeldungen, Zeitkorrekturen.';

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
    description: `MBzeit-Tarife ab ${ca(cheapest)} pro Monat (${vatNote()}), alle Funktionen inklusive. Unverbindlicher Kostenrechner für Ihre Praxis.`,
  },
  '/impressum': { title: 'Impressum' },
  '/datenschutz': { title: 'Datenschutz' },
  '/demo': { title: 'Demo', description: 'Interaktive Demo von MBzeit mit einer fiktiven Zahnarztpraxis – alle Daten sind erfunden.' },
};

/** Routen, die beim Build als statisches HTML erzeugt werden. */
export const PRERENDER_ROUTES = Object.keys(pageMeta);

export function fullTitle(title: string | null): string {
  return title ? `${title} | MBzeit` : DEFAULT_TITLE;
}

export function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/';
}
