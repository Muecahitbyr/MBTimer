import { describe, expect, it } from 'vitest';
import { createInitialData } from '../data/initialState';
import { employees } from '../data/employees';
import { dayInfo, overtimeBalance, presence, vacationStats } from './time';
import { addDays, eachDay } from './date';

const today = '2026-10-26'; // Montag
const clock = { today, nowMinutes: 10 * 60 };
const data = createInitialData(today, clock.nowMinutes);
const lea = employees.find((e) => e.id === 'e4')!;

describe('Demo-Daten', () => {
  it('sind deterministisch', () => {
    expect(createInitialData(today, clock.nowMinutes)).toEqual(data);
  });

  it('decken etwa drei Monate ab und enthalten nur @example.com-Adressen', () => {
    expect(data.rangeStart).toBe('2026-08-01');
    expect(employees).toHaveLength(12);
    expect(employees.every((e) => e.email.endsWith('@example.com'))).toBe(true);
  });

  it('keine Stempelzeiten an Urlaubstagen', () => {
    for (const a of data.absences.filter((x) => x.status === 'genehmigt')) {
      expect(data.entries.some((e) => e.employeeId === a.employeeId && e.date >= a.from && e.date <= a.to)).toBe(false);
    }
  });

  it('Personas sind heute noch nicht eingestempelt', () => {
    expect(presence(data, 'e4', clock).kind).toBe('nicht-eingestempelt');
    expect(presence(data, 'e10', clock)).toEqual({ kind: 'abwesend', type: 'urlaub' });
  });
});

describe('Zeitberechnung', () => {
  it('Urlaubstag wird mit Soll gutgeschrieben', () => {
    const a = data.absences.find((x) => x.employeeId === 'e4' && x.status === 'genehmigt')!;
    const d = dayInfo(data, 'e4', a.from, clock);
    expect(d.status).toBe('urlaub');
    expect(d.diff).toBe(0);
    expect(d.ist).toBe(d.soll);
  });

  it('vergessenes Ausstempeln ist unvollständig', () => {
    const k = data.corrections.find((c) => c.employeeId === 'e4' && c.status === 'offen')!;
    expect(dayInfo(data, 'e4', k.date, clock).status).toBe('unvollstaendig');
  });

  it('Überstundenkonto = Übertrag + Summe der Abweichungen', () => {
    const sum = eachDay(data.rangeStart, today).reduce((s, d) => s + dayInfo(data, 'e4', d, clock).diff, 0);
    expect(overtimeBalance(data, lea, clock)).toBe(lea.overtimeCarryMinutes + sum);
  });

  it('Zukunft zählt nicht ins Saldo', () => {
    expect(dayInfo(data, 'e4', addDays(today, 1), clock).diff).toBe(0);
  });

  it('Resturlaub berücksichtigt genommene und genehmigte Tage', () => {
    const v = vacationStats(data, lea, 2026);
    expect(v.approved).toBe(lea.vacationTakenBefore + 5);
    expect(v.pending).toBe(3);
    expect(v.remaining).toBe(30 - v.approved);
  });
});
