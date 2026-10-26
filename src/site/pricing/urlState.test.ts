import { describe, expect, it } from 'vitest';
import { pricing } from '../../config/pricing';
import { normalizeInput } from './calculate';
import { DEFAULT_EMPLOYEES, readEstimateParams, writeEstimateParams } from './urlState';

describe('URL-Parameter', () => {
  it('liest eine geteilte Rechnung', () => {
    const n = normalizeInput(readEstimateParams('?ma=18&zahlweise=jahr&einrichtung=1'), pricing);
    expect(n).toEqual({ employees: 18, billing: 'jahr', setup: true, gross: false });
  });

  it('nutzt Standardwerte ohne Parameter', () => {
    expect(normalizeInput(readEstimateParams(''), pricing).employees).toBe(DEFAULT_EMPLOYEES);
  });

  it('korrigiert manipulierte Werte', () => {
    const n = normalizeInput(readEstimateParams('?ma=-3&zahlweise=woche&einrichtung=abc'), pricing);
    expect(n).toEqual({ employees: 1, billing: 'monat', setup: false, gross: false });
  });

  it('schreibt die Rechnung und behält fremde Parameter', () => {
    const search = writeEstimateParams('?foo=bar', { employees: 18, billing: 'jahr', setup: true, gross: false });
    expect(search).toBe('?foo=bar&ma=18&zahlweise=jahr&einrichtung=1');
    expect(writeEstimateParams('?ma=5&einrichtung=1', { employees: 7, billing: 'monat', setup: false, gross: true })).toBe(
      '?ma=7&zahlweise=monat&brutto=1',
    );
  });
});
