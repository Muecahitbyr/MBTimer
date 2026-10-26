import { describe, expect, it } from 'vitest';
import { holidaysNRW } from './holidays';
import { isoWeek } from './date';

describe('Feiertage NRW', () => {
  it('berechnet bewegliche Feiertage 2026', () => {
    const h = holidaysNRW(2026);
    expect(h.get('2026-04-03')).toBe('Karfreitag');
    expect(h.get('2026-04-06')).toBe('Ostermontag');
    expect(h.get('2026-05-14')).toBe('Christi Himmelfahrt');
    expect(h.get('2026-05-25')).toBe('Pfingstmontag');
    expect(h.get('2026-06-04')).toBe('Fronleichnam');
    expect(h.size).toBe(11);
  });

  it('Kalenderwoche nach ISO 8601', () => {
    expect(isoWeek('2026-10-26')).toBe(44);
    expect(isoWeek('2026-01-01')).toBe(1);
    expect(isoWeek('2027-01-01')).toBe(53);
  });
});
