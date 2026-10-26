import type { WorkSchedule } from './types';

const h = (hours: number) => Math.round(hours * 60);

/** Arbeitszeitpläne: Wochenstunden, Arbeitstage (1 = Mo … 5 = Fr) und üblicher Beginn. */
export const schedules: WorkSchedule[] = [
  { employeeId: 'e1', weeklyMinutes: h(40), days: [1, 2, 3, 4, 5], start: '07:45' },
  { employeeId: 'e2', weeklyMinutes: h(38), days: [1, 2, 3, 4, 5], start: '07:30' },
  { employeeId: 'e3', weeklyMinutes: h(32), days: [1, 2, 3, 4], start: '08:00' },
  { employeeId: 'e4', weeklyMinutes: h(40), days: [1, 2, 3, 4, 5], start: '07:30' },
  { employeeId: 'e5', weeklyMinutes: h(30), days: [1, 2, 4, 5], start: '08:00' },
  { employeeId: 'e6', weeklyMinutes: h(40), days: [1, 2, 3, 4, 5], start: '07:45' },
  { employeeId: 'e7', weeklyMinutes: h(35), days: [1, 2, 3, 4, 5], start: '08:30' },
  { employeeId: 'e8', weeklyMinutes: h(24), days: [1, 3, 5], start: '08:00' },
  { employeeId: 'e9', weeklyMinutes: h(40), days: [1, 2, 3, 4, 5], start: '07:30' },
  { employeeId: 'e10', weeklyMinutes: h(40), days: [1, 2, 3, 4, 5], start: '07:00' },
  { employeeId: 'e11', weeklyMinutes: h(20), days: [1, 2, 3, 4, 5], start: '13:00' },
  { employeeId: 'e12', weeklyMinutes: h(10), days: [2, 4], start: '14:00' },
];

export function scheduleFor(employeeId: string): WorkSchedule {
  const s = schedules.find((x) => x.employeeId === employeeId);
  if (!s) throw new Error(`Kein Arbeitszeitplan für ${employeeId}`);
  return s;
}

export function dailyTargetMinutes(s: WorkSchedule): number {
  return s.days.length ? s.weeklyMinutes / s.days.length : 0;
}
