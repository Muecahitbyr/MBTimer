import { addDays, toISO, type ISODate } from './date';

/** Ostersonntag (Gaußsche Osterformel, anonymer gregorianischer Algorithmus). */
function easterSunday(year: number): ISODate {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return toISO(new Date(year, month - 1, day));
}

const cache = new Map<number, Map<ISODate, string>>();

/** Gesetzliche Feiertage in Nordrhein-Westfalen (Demo-Praxis). */
export function holidaysNRW(year: number): Map<ISODate, string> {
  const cached = cache.get(year);
  if (cached) return cached;
  const easter = easterSunday(year);
  const map = new Map<ISODate, string>([
    [`${year}-01-01`, 'Neujahr'],
    [addDays(easter, -2), 'Karfreitag'],
    [addDays(easter, 1), 'Ostermontag'],
    [`${year}-05-01`, 'Tag der Arbeit'],
    [addDays(easter, 39), 'Christi Himmelfahrt'],
    [addDays(easter, 50), 'Pfingstmontag'],
    [addDays(easter, 60), 'Fronleichnam'],
    [`${year}-10-03`, 'Tag der Deutschen Einheit'],
    [`${year}-11-01`, 'Allerheiligen'],
    [`${year}-12-25`, '1. Weihnachtstag'],
    [`${year}-12-26`, '2. Weihnachtstag'],
  ]);
  cache.set(year, map);
  return map;
}

export function holidayName(iso: ISODate): string | undefined {
  return holidaysNRW(Number(iso.slice(0, 4))).get(iso);
}
