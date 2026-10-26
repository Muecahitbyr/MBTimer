/**
 * Einzige Quelle für alle Preise und preisbezogenen Texte.
 * Beträge sind unverbindliche Richtwerte (netto, in Euro) – nirgends sonst hartcodieren.
 */

export type VatMode = 'net' | 'kleinunternehmer';
export type TierId = 'starter' | 'team' | 'plus' | 'individuell';

export interface PricingTier {
  id: TierId;
  name: string;
  /** Obergrenze Mitarbeiter; null = keine Grenze (individuelle Kalkulation). */
  maxEmployees: number | null;
  /** Monatspreis netto in Euro; null = auf Anfrage. */
  monthlyNet: number | null;
  /** Kurzbeschreibung auf der Karte. */
  tagline: string;
  /** Zusätzliche Leistungen über den Funktionsumfang hinaus. */
  extras: string[];
  /** Hervorhebung, z. B. „Beliebt“. */
  badge?: string;
}

export interface PricingConfig {
  currency: 'EUR';
  vatMode: VatMode;
  /** Nur für die optionale Anzeige „ca. brutto“. */
  vatRate: number;
  /** Jahreszahlung = (12 − yearlyFreeMonths) × Monatspreis. */
  yearlyFreeMonths: number;
  trialDays: number;
  tiers: PricingTier[];
  setupService: { price: number; label: string; items: string[] };
  /** In allen Tarifen enthalten. */
  includedFeatures: string[];
  calculator: { minEmployees: number; maxEmployees: number };
}

export const pricing: PricingConfig = {
  currency: 'EUR',
  vatMode: 'net',
  vatRate: 0.19,
  yearlyFreeMonths: 2,
  trialDays: 30,
  tiers: [
    {
      id: 'starter',
      name: 'Starter',
      maxEmployees: 10,
      monthlyNet: 49,
      tagline: 'Für kleine Teams und Betriebe',
      extras: [],
    },
    {
      id: 'team',
      name: 'Team',
      maxEmployees: 25,
      monthlyNet: 89,
      tagline: 'Für wachsende Teams und mittelgroße Betriebe',
      extras: [],
      badge: 'Beliebt',
    },
    {
      id: 'plus',
      name: 'Plus',
      maxEmployees: 50,
      monthlyNet: 149,
      tagline: 'Für größere Betriebe und mehrere Standorte',
      extras: ['Mehrere Standorte', 'Bevorzugter Support'],
    },
    {
      id: 'individuell',
      name: 'Individuell',
      maxEmployees: null,
      monthlyNet: null,
      tagline: 'Über 50 Mitarbeiter oder mehrere Betriebe',
      extras: ['Mehrere Betriebe und Standorte', 'Bevorzugter Support', 'Individuelle Abstimmung der Einrichtung'],
    },
  ],
  setupService: {
    price: 199,
    label: 'Einrichtungsservice',
    items: ['Mitarbeiter anlegen', 'Arbeitszeitpläne eintragen', 'Kiosk-Tablet einrichten'],
  },
  includedFeatures: [
    'Zeiterfassung mit Kommen/Gehen',
    'Kiosk-Tablet als Stempeluhr',
    'Urlaubsanträge & Urlaubskalender',
    'Krankmeldungen',
    'Freistellungen',
    'Zeitkorrekturen',
    'Überstunden-Genehmigung',
    'Neuigkeiten ans Team',
    'Statistiken für die Leitung',
  ],
  calculator: { minEmployees: 1, maxEmployees: 60 },
};

/** Pflichthinweis unter Tarifkarten und Rechner. */
export const PRICE_DISCLAIMER =
  'Unverbindliche Beispielrechnung – kein Angebot. Die tatsächlichen Kosten können abweichen. Ein verbindliches Angebot erhalten Sie auf Anfrage.';

export function vatNote(config: PricingConfig = pricing): string {
  return config.vatMode === 'net' ? 'zzgl. MwSt.' : 'gem. § 19 UStG keine Umsatzsteuer';
}

export function trialNote(config: PricingConfig = pricing): string {
  return `${config.trialDays} Tage kostenlos testen – ohne Zahlungsdaten, monatlich kündbar`;
}

/** Tarife mit festem Richtpreis (ohne „Individuell“), aufsteigend nach Grenze. */
export function pricedTiers(config: PricingConfig = pricing): PricingTier[] {
  return config.tiers
    .filter((t) => t.monthlyNet !== null && t.maxEmployees !== null)
    .sort((a, b) => (a.maxEmployees ?? 0) - (b.maxEmployees ?? 0));
}
