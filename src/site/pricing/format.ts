import type { Billing, PricedEstimate } from './calculate';

const euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const euroCents = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Ganze Euro, immer mit „ca.“. */
export function ca(amount: number): string {
  return `ca. ${euro.format(Math.round(amount))}`;
}

/** Pro-Kopf-Werte auf 10 Cent gerundet, immer mit „ca.“. */
export function caCents(amount: number): string {
  return `ca. ${euroCents.format(Math.round(amount * 10) / 10)}`;
}

export function billingLabel(billing: Billing): string {
  return billing === 'jahr' ? 'jährlich' : 'monatlich';
}

export function employeesLabel(n: number, max = 50): string {
  return n > max ? `${max}+` : String(n);
}

/** Text für Anfrage/E-Mail, z. B. „Beispielrechnung: 18 Mitarbeiter, Tarif Team, jährlich, mit Einrichtung – ca. 890 €/Jahr + ca. 199 € einmalig“. */
export function estimateSummary(e: PricedEstimate, vatSuffix: string): string {
  const { employees, billing, setup } = e.input;
  const price = billing === 'jahr' ? `${ca(e.perYear)}/Jahr` : `${ca(e.perMonth)}/Monat`;
  const setupPart = setup ? ` + ${ca(e.setup)} einmalig` : '';
  return (
    `Beispielrechnung: ${employees} Mitarbeiter, Tarif ${e.tier.name}, ${billingLabel(billing)}, ` +
    `${setup ? 'mit' : 'ohne'} Einrichtung – ${price}${setupPart} (${vatSuffix})`
  );
}
