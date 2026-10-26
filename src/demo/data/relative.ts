import { addDays, startOfWeek, type ISODate } from '../lib/date';

/**
 * Datum relativ zu „heute“: Woche (0 = aktuelle Woche, −1 = Vorwoche …) und Wochentag (1 = Mo … 5 = Fr).
 * So bleibt die Demo immer aktuell, egal wann sie aufgerufen wird.
 */
export function rel(today: ISODate, weeks: number, dow: number): ISODate {
  return addDays(startOfWeek(today), weeks * 7 + dow - 1);
}
