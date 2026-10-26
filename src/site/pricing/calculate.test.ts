import { describe, expect, it } from 'vitest';
import { pricing, type PricingConfig } from '../../config/pricing';
import { calculateEstimate, normalizeInput, type PricedEstimate } from './calculate';
import { ca, caCents, estimateSummary } from './format';

function priced(input: Parameters<typeof calculateEstimate>[0], config: PricingConfig = pricing): PricedEstimate {
  const e = calculateEstimate(input, config);
  if (e.kind !== 'priced') throw new Error(`erwartet priced, erhalten ${e.kind}`);
  return e;
}

describe('Tarifgrenzen', () => {
  it.each([
    [1, 'starter'],
    [10, 'starter'],
    [11, 'praxis'],
    [25, 'praxis'],
    [26, 'plus'],
    [50, 'plus'],
    [51, 'individuell'],
  ])('%i Mitarbeiter → %s', (employees, tierId) => {
    expect(calculateEstimate({ employees }, pricing).tier.id).toBe(tierId);
  });

  it('ab 51 Mitarbeitern keine Beträge („Individuell“)', () => {
    const e = calculateEstimate({ employees: 51, billing: 'jahr', setup: true }, pricing);
    expect(e.kind).toBe('custom');
    expect(e).not.toHaveProperty('perMonth');
    expect(calculateEstimate({ employees: 60 }, pricing).kind).toBe('custom');
  });
});

describe('Zahlweise', () => {
  it('monatlich: 12 × Monatspreis pro Jahr', () => {
    const e = priced({ employees: 18, billing: 'monat' });
    expect(e.perMonth).toBe(89);
    expect(e.perYear).toBe(89 * 12);
  });

  it('jährlich = 10 × Monatspreis', () => {
    for (const employees of [5, 18, 40]) {
      const e = priced({ employees, billing: 'jahr' });
      expect(e.perYear).toBe(e.monthlyListPrice * 10);
    }
    expect(priced({ employees: 18, billing: 'jahr' }).perYear).toBe(890);
  });

  it('Ersparnis bei jährlicher Zahlung = 2 Monatspreise', () => {
    expect(priced({ employees: 18, billing: 'jahr' }).yearlySavings).toBe(178);
    expect(priced({ employees: 3, billing: 'jahr' }).yearlySavings).toBe(98);
    const monthly = priced({ employees: 18, billing: 'monat' });
    const yearly = priced({ employees: 18, billing: 'jahr' });
    expect(monthly.perYear - yearly.perYear).toBe(yearly.yearlySavings);
  });

  it('entspricht ca. 74 €/Monat bei 890 €/Jahr', () => {
    expect(ca(priced({ employees: 18, billing: 'jahr' }).perMonth)).toBe('ca. 74 €');
  });
});

describe('Einrichtungsservice', () => {
  it('aus: 0 € und Gesamtkosten = Jahresbetrag', () => {
    const e = priced({ employees: 18, billing: 'jahr', setup: false });
    expect(e.setup).toBe(0);
    expect(e.firstYearTotal).toBe(890);
  });

  it('an: 199 € einmalig im ersten Jahr', () => {
    const e = priced({ employees: 18, billing: 'jahr', setup: true });
    expect(e.setup).toBe(199);
    expect(e.firstYearTotal).toBe(890 + 199);
  });
});

describe('Pro-Kopf-Wert', () => {
  it('Kosten pro Mitarbeiter und Monat', () => {
    expect(priced({ employees: 10, billing: 'monat' }).perEmployeeMonth).toBeCloseTo(4.9);
    expect(priced({ employees: 18, billing: 'jahr' }).perEmployeeMonth).toBeCloseTo(890 / 12 / 18);
  });

  it('Anzeige auf 10 Cent gerundet', () => {
    expect(caCents(890 / 12 / 18)).toBe('ca. 4,10 €');
    expect(caCents(4.9)).toBe('ca. 4,90 €');
  });
});

describe('Brutto-Umrechnung', () => {
  it('multipliziert alle Beträge mit 1 + vatRate', () => {
    const e = priced({ employees: 18, billing: 'jahr', setup: true, gross: true });
    expect(e.vatFactor).toBeCloseTo(1.19);
    expect(e.perYear).toBeCloseTo(890 * 1.19);
    expect(e.setup).toBeCloseTo(199 * 1.19);
    expect(e.firstYearTotal).toBeCloseTo((890 + 199) * 1.19);
  });

  it('wirkt nicht bei Kleinunternehmerregelung', () => {
    const config: PricingConfig = { ...pricing, vatMode: 'kleinunternehmer' };
    const e = priced({ employees: 18, billing: 'jahr', gross: true }, config);
    expect(e.input.gross).toBe(false);
    expect(e.perYear).toBe(890);
  });
});

describe('Upgrade-Hinweis', () => {
  it.each([
    [9, 'praxis'],
    [10, 'praxis'],
    [24, 'plus'],
    [25, 'plus'],
    [49, 'individuell'],
  ])('bei %i Mitarbeitern Hinweis auf %s', (employees, next) => {
    expect(priced({ employees }).upgradeHint?.nextTier.id).toBe(next);
  });

  it('kein Hinweis weit unter der Grenze', () => {
    expect(priced({ employees: 8 }).upgradeHint).toBeNull();
    expect(priced({ employees: 18 }).upgradeHint).toBeNull();
  });
});

describe('ungültige Eingaben', () => {
  it.each([
    [0, 1],
    [-5, 1],
    ['abc', 1],
    ['', 1],
    [null, 1],
    [undefined, 1],
    [Number.NaN, 1],
    ['18', 18],
    ['7,4', 7],
    [12.6, 13],
    [500, 60],
    [Infinity, 1],
  ])('%s → %i Mitarbeiter', (employees, expected) => {
    expect(normalizeInput({ employees }, pricing).employees).toBe(expected);
  });

  it('unbekannte Zahlweise → monatlich, Einrichtung/Brutto nur bei eindeutigen Werten', () => {
    const n = normalizeInput({ employees: 5, billing: 'quartal', setup: 'vielleicht', gross: 'x' }, pricing);
    expect(n).toEqual({ employees: 5, billing: 'monat', setup: false, gross: false });
    expect(normalizeInput({ employees: 5, billing: 'jahr', setup: '1', gross: 'true' }, pricing)).toEqual({
      employees: 5,
      billing: 'jahr',
      setup: true,
      gross: true,
    });
  });
});

describe('Zusammenfassung für Anfrage', () => {
  it('enthält Tarif, Zahlweise und ca.-Beträge', () => {
    const text = estimateSummary(priced({ employees: 18, billing: 'jahr', setup: true }), 'zzgl. MwSt.');
    expect(text).toBe(
      'Beispielrechnung: 18 Mitarbeiter, Tarif Praxis, jährlich, mit Einrichtung – ca. 890 €/Jahr + ca. 199 € einmalig (zzgl. MwSt.)',
    );
  });
});
