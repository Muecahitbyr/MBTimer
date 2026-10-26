import { dailyTargetMinutes, scheduleFor } from '../data/schedules';
import type { Absence, AbsenceType, DemoData, Employee, TimeEntry } from '../data/types';
import { daysInMonth, eachDay, nowHHMM, toMinutes, weekday, type ISODate } from './date';
import { holidayName } from './holidays';

export type DayStatus =
  | 'arbeit'
  | 'laeuft'
  | 'unvollstaendig'
  | 'fehlt'
  | 'heute'
  | 'urlaub'
  | 'krank'
  | 'freistellung'
  | 'feiertag'
  | 'frei'
  | 'zukunft'
  | 'ausserhalb';

export interface DayInfo {
  date: ISODate;
  status: DayStatus;
  holiday?: string;
  absence?: Absence;
  entries: TimeEntry[];
  soll: number;
  ist: number;
  pause: number;
  /** Abweichung, die in Saldo und Überstundenkonto eingeht. */
  diff: number;
}

export interface Clock {
  today: ISODate;
  nowMinutes: number;
}

export function currentClock(today: ISODate): Clock {
  return { today, nowMinutes: toMinutes(nowHHMM()) };
}

export function entryMinutes(e: TimeEntry, clock: Clock): number {
  const end = e.end ? toMinutes(e.end) : e.date === clock.today ? clock.nowMinutes : null;
  if (end === null) return 0;
  return Math.max(0, end - toMinutes(e.start) - e.breakMinutes);
}

export function isWorkday(employeeId: string, date: ISODate): boolean {
  return scheduleFor(employeeId).days.includes(weekday(date)) && !holidayName(date);
}

export function countWorkdays(employeeId: string, from: ISODate, to: ISODate): number {
  if (to < from) return 0;
  return eachDay(from, to).filter((d) => isWorkday(employeeId, d)).length;
}

export function approvedAbsenceOn(data: DemoData, employeeId: string, date: ISODate): Absence | undefined {
  return data.absences.find((a) => a.employeeId === employeeId && a.status === 'genehmigt' && a.from <= date && date <= a.to);
}

export function dayInfo(data: DemoData, employeeId: string, date: ISODate, clock: Clock): DayInfo {
  const holiday = holidayName(date);
  const base = { date, holiday, entries: [] as TimeEntry[], soll: 0, ist: 0, pause: 0, diff: 0 };
  if (date < data.rangeStart) return { ...base, status: 'ausserhalb' };

  const schedule = scheduleFor(employeeId);
  const workday = schedule.days.includes(weekday(date)) && !holiday;
  const soll = workday ? dailyTargetMinutes(schedule) : 0;
  const entries = data.entries.filter((e) => e.employeeId === employeeId && e.date === date).sort((a, b) => a.start.localeCompare(b.start));
  const absence = approvedAbsenceOn(data, employeeId, date);

  if (absence && workday) {
    // Abwesenheitstage werden mit der Sollzeit gutgeschrieben.
    return { ...base, status: absence.type, absence, soll, ist: soll, diff: 0, entries };
  }

  const ist = entries.reduce((sum, e) => sum + entryMinutes(e, clock), 0);
  const pause = entries.reduce((sum, e) => sum + e.breakMinutes, 0);
  const open = entries.some((e) => e.end === null);

  if (date > clock.today) return { ...base, status: holiday ? 'feiertag' : workday ? 'zukunft' : 'frei', soll };
  if (entries.length === 0) {
    if (holiday) return { ...base, status: 'feiertag' };
    if (!workday) return { ...base, status: 'frei' };
    if (date === clock.today) return { ...base, status: 'heute', soll };
    return { ...base, status: 'fehlt', soll, diff: -soll };
  }
  if (open) {
    if (date === clock.today) return { ...base, status: 'laeuft', entries, soll, ist, pause };
    return { ...base, status: 'unvollstaendig', entries, soll, ist, pause, diff: ist - soll };
  }
  return { ...base, status: 'arbeit', entries, soll, ist, pause, diff: ist - soll };
}

export interface PeriodSummary {
  soll: number;
  sollBisHeute: number;
  ist: number;
  diff: number;
  days: DayInfo[];
}

export function summarize(days: DayInfo[], clock: Clock): PeriodSummary {
  return {
    days,
    soll: days.reduce((s, d) => s + d.soll, 0),
    sollBisHeute: days.filter((d) => d.date <= clock.today).reduce((s, d) => s + d.soll, 0),
    ist: days.reduce((s, d) => s + d.ist, 0),
    diff: days.reduce((s, d) => s + d.diff, 0),
  };
}

export function monthSummary(data: DemoData, employeeId: string, monthIso: ISODate, clock: Clock): PeriodSummary {
  return summarize(daysInMonth(monthIso).map((d) => dayInfo(data, employeeId, d, clock)), clock);
}

/** Überstundenkonto: Übertrag + Abweichungen aller Tage im Demo-Zeitraum bis heute. */
export function overtimeBalance(data: DemoData, employee: Employee, clock: Clock): number {
  return eachDay(data.rangeStart, clock.today).reduce((sum, d) => sum + dayInfo(data, employee.id, d, clock).diff, employee.overtimeCarryMinutes);
}

export interface VacationStats {
  entitlement: number;
  approved: number;
  pending: number;
  remaining: number;
}

export function absenceDays(a: Absence, year?: number): number {
  if (year === undefined) return countWorkdays(a.employeeId, a.from, a.to);
  const from = a.from < `${year}-01-01` ? `${year}-01-01` : a.from;
  const to = a.to > `${year}-12-31` ? `${year}-12-31` : a.to;
  return countWorkdays(a.employeeId, from, to);
}

export function vacationStats(data: DemoData, employee: Employee, year: number): VacationStats {
  const own = data.absences.filter((a) => a.employeeId === employee.id && a.type === 'urlaub');
  const approved = employee.vacationTakenBefore + own.filter((a) => a.status === 'genehmigt').reduce((s, a) => s + absenceDays(a, year), 0);
  const pending = own.filter((a) => a.status === 'beantragt').reduce((s, a) => s + absenceDays(a, year), 0);
  return { entitlement: employee.vacationDays, approved, pending, remaining: employee.vacationDays - approved };
}

export type Presence =
  | { kind: 'anwesend'; since: string }
  | { kind: 'gegangen'; at: string }
  | { kind: 'abwesend'; type: AbsenceType }
  | { kind: 'frei' }
  | { kind: 'nicht-eingestempelt' };

export function presence(data: DemoData, employeeId: string, clock: Clock): Presence {
  const today = clock.today;
  const entries = data.entries.filter((e) => e.employeeId === employeeId && e.date === today);
  const open = entries.find((e) => e.end === null);
  if (open) return { kind: 'anwesend', since: open.start };
  const absence = approvedAbsenceOn(data, employeeId, today);
  if (absence) return { kind: 'abwesend', type: absence.type };
  if (entries.length) return { kind: 'gegangen', at: entries.map((e) => e.end ?? '').sort().at(-1) ?? '' };
  if (!isWorkday(employeeId, today)) return { kind: 'frei' };
  return { kind: 'nicht-eingestempelt' };
}

export function openEntry(data: DemoData, employeeId: string, today: ISODate): TimeEntry | undefined {
  return data.entries.find((e) => e.employeeId === employeeId && e.date === today && e.end === null);
}
