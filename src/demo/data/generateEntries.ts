import { addMonths, eachDay, fromMinutes, startOfMonth, toMinutes, weekday, type ISODate } from '../lib/date';
import { holidayName } from '../lib/holidays';
import { employees, PERSONA_IDS } from './employees';
import { dailyTargetMinutes, scheduleFor } from './schedules';
import type { Absence, CorrectionRequest, TimeEntry } from './types';

/** Deterministischer Zufall (mulberry32), damit die Demo bei jedem Aufruf gleich aussieht. */
function seededRandom(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const between = (rnd: () => number, min: number, max: number) => Math.round(min + rnd() * (max - min));

/** Gesetzliche Mindestpause (vereinfacht nach ArbZG § 4). */
export function requiredBreak(workMinutesGross: number): number {
  if (workMinutesGross > 9 * 60 + 45) return 45;
  if (workMinutesGross > 6 * 60 + 30) return 30;
  return 0;
}

export function demoRangeStart(today: ISODate): ISODate {
  return startOfMonth(addMonths(today, -2));
}

function isAbsent(absences: Absence[], employeeId: string, date: ISODate): boolean {
  return absences.some((a) => a.employeeId === employeeId && a.status === 'genehmigt' && a.from <= date && date <= a.to);
}

/**
 * Erzeugt Stempelzeiten aus den Arbeitszeitplänen für den Demo-Zeitraum bis heute.
 * Urlaub, Krankheit, Freistellungen und Feiertage werden ausgespart; Korrekturanträge bestimmen die Ausgangslage.
 */
export function generateEntries(today: ISODate, nowMinutes: number, absences: Absence[], corrections: CorrectionRequest[]): TimeEntry[] {
  const entries: TimeEntry[] = [];
  const days = eachDay(demoRangeStart(today), today);

  for (const emp of employees) {
    const schedule = scheduleFor(emp.id);
    const target = dailyTargetMinutes(schedule);
    for (const date of days) {
      if (!schedule.days.includes(weekday(date)) || holidayName(date) || isAbsent(absences, emp.id, date)) continue;
      const id = `t-${emp.id}-${date}`;

      const correction = corrections.find((c) => c.employeeId === emp.id && c.date === date);
      if (correction) {
        const times = correction.status === 'genehmigt' ? correction.requested : correction.original;
        if (times) {
          const gross = times.end ? toMinutes(times.end) - toMinutes(times.start) : 0;
          entries.push({ id, employeeId: emp.id, date, start: times.start, end: times.end, breakMinutes: requiredBreak(gross), source: correction.status === 'genehmigt' ? 'korrektur' : 'kiosk' });
        }
        continue;
      }

      const rnd = seededRandom(`${emp.id}|${date}`);
      const start = toMinutes(schedule.start) + between(rnd, -12, 8);
      // Meist knapp über Soll, gelegentlich deutlich länger (Notfälle, Besprechungen).
      const extra = rnd() < 0.12 ? between(rnd, 40, 95) : between(rnd, -10, 22);
      const net = Math.max(60, target + extra);
      const brk = net > 9 * 60 ? 45 : net > 6 * 60 ? 30 : 0;
      const end = start + net + brk;

      if (date === today) {
        // Personas stempeln selbst; die übrigen sind je nach Uhrzeit schon da.
        if (PERSONA_IDS.includes(emp.id) || nowMinutes < start) continue;
        const done = nowMinutes >= end;
        entries.push({ id, employeeId: emp.id, date, start: fromMinutes(start), end: done ? fromMinutes(end) : null, breakMinutes: done ? brk : 0, source: 'kiosk' });
        continue;
      }
      entries.push({ id, employeeId: emp.id, date, start: fromMinutes(start), end: fromMinutes(end), breakMinutes: brk, source: rnd() < 0.8 ? 'kiosk' : 'web' });
    }
  }
  return entries;
}
