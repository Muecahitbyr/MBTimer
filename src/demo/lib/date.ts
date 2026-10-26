/** Kleine Datumshilfen ohne Zusatzbibliothek. Datumswerte als lokale 'YYYY-MM-DD'-Strings. */

export type ISODate = string;

const pad = (n: number) => String(n).padStart(2, '0');

export function toISO(d: Date): ISODate {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromISO(iso: ISODate): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: ISODate, days: number): ISODate {
  const d = fromISO(iso);
  d.setDate(d.getDate() + days);
  return toISO(d);
}

/** 1 = Montag … 7 = Sonntag */
export function weekday(iso: ISODate): number {
  const day = fromISO(iso).getDay();
  return day === 0 ? 7 : day;
}

export function startOfWeek(iso: ISODate): ISODate {
  return addDays(iso, 1 - weekday(iso));
}

export function startOfMonth(iso: ISODate): ISODate {
  return `${iso.slice(0, 7)}-01`;
}

export function addMonths(monthIso: ISODate, months: number): ISODate {
  const d = fromISO(startOfMonth(monthIso));
  d.setMonth(d.getMonth() + months);
  return toISO(d);
}

export function daysInMonth(monthIso: ISODate): ISODate[] {
  const first = startOfMonth(monthIso);
  const result: ISODate[] = [];
  for (let d = first; d.slice(0, 7) === first.slice(0, 7); d = addDays(d, 1)) result.push(d);
  return result;
}

export function eachDay(from: ISODate, to: ISODate): ISODate[] {
  const result: ISODate[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) result.push(d);
  return result;
}

/** ISO-8601-Kalenderwoche */
export function isoWeek(iso: ISODate): number {
  const d = fromISO(iso);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function todayISO(): ISODate {
  return toISO(new Date());
}

export function nowHHMM(): string {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function fromMinutes(min: number): string {
  const m = ((Math.round(min) % 1440) + 1440) % 1440;
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
}

/** Dauer als „7:45 h“, optional mit Vorzeichen. */
export function formatDuration(min: number, signed = false): string {
  const abs = Math.abs(Math.round(min));
  const text = `${Math.floor(abs / 60)}:${pad(abs % 60)} h`;
  if (!signed) return min < 0 ? `−${text}` : text;
  if (Math.round(min) === 0) return `±${text}`;
  return `${min > 0 ? '+' : '−'}${text}`;
}

const dateFmt = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
const shortFmt = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit' });
const longFmt = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const monthFmt = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' });
const weekdayShortFmt = new Intl.DateTimeFormat('de-DE', { weekday: 'short' });

export const formatDate = (iso: ISODate) => dateFmt.format(fromISO(iso));
export const formatShort = (iso: ISODate) => shortFmt.format(fromISO(iso));
export const formatLong = (iso: ISODate) => longFmt.format(fromISO(iso));
export const formatMonth = (iso: ISODate) => monthFmt.format(fromISO(iso));
export const formatWeekdayShort = (iso: ISODate) => weekdayShortFmt.format(fromISO(iso)).replace('.', '');

export const WEEKDAY_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
