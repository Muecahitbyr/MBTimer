import { toMinutes, nowHHMM, type ISODate } from '../lib/date';
import { createAbsences } from './absences';
import { createCorrections } from './corrections';
import { demoRangeStart, generateEntries } from './generateEntries';
import { createNews } from './news';
import type { DemoData } from './types';

export function createInitialData(today: ISODate, nowMinutes = toMinutes(nowHHMM())): DemoData {
  const absences = createAbsences(today);
  const corrections = createCorrections(today);
  return {
    generatedFor: today,
    rangeStart: demoRangeStart(today),
    entries: generateEntries(today, nowMinutes, absences, corrections),
    absences,
    corrections,
    news: createNews(today),
  };
}
