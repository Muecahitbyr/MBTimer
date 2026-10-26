import { toMinutes, type ISODate } from '../lib/date';
import { requiredBreak } from '../data/generateEntries';
import type { Absence, CorrectionRequest, DemoData, NewsItem, RequestStatus, TimeEntry } from '../data/types';

export interface DemoState {
  data: DemoData;
  currentUserId: string | null;
}

export type DemoAction =
  | { type: 'login'; employeeId: string }
  | { type: 'logout' }
  | { type: 'clockIn'; employeeId: string; date: ISODate; time: string; source: TimeEntry['source'] }
  | { type: 'clockOut'; employeeId: string; date: ISODate; time: string }
  | { type: 'addAbsence'; absence: Absence }
  | { type: 'setAbsenceStatus'; id: string; status: RequestStatus; decidedBy?: string }
  | { type: 'addCorrection'; correction: CorrectionRequest }
  | { type: 'decideCorrection'; id: string; approve: boolean; decidedBy: string }
  | { type: 'addNews'; news: NewsItem }
  | { type: 'replace'; state: DemoState };

let counter = 0;
export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${(counter++).toString(36)}`;

function updateData(state: DemoState, patch: Partial<DemoData>): DemoState {
  return { ...state, data: { ...state.data, ...patch } };
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  const { data } = state;
  switch (action.type) {
    case 'login':
      return { ...state, currentUserId: action.employeeId };
    case 'logout':
      return { ...state, currentUserId: null };
    case 'clockIn': {
      if (data.entries.some((e) => e.employeeId === action.employeeId && e.date === action.date && e.end === null)) return state;
      const entry: TimeEntry = { id: newId('t'), employeeId: action.employeeId, date: action.date, start: action.time, end: null, breakMinutes: 0, source: action.source };
      return updateData(state, { entries: [...data.entries, entry] });
    }
    case 'clockOut':
      return updateData(state, {
        entries: data.entries.map((e) => {
          if (e.employeeId !== action.employeeId || e.date !== action.date || e.end !== null) return e;
          const gross = Math.max(0, toMinutes(action.time) - toMinutes(e.start));
          return { ...e, end: action.time, breakMinutes: requiredBreak(gross) };
        }),
      });
    case 'addAbsence':
      return updateData(state, { absences: [...data.absences, action.absence] });
    case 'setAbsenceStatus':
      return updateData(state, {
        absences: data.absences.map((a) => (a.id === action.id ? { ...a, status: action.status, decidedBy: action.decidedBy ?? a.decidedBy } : a)),
      });
    case 'addCorrection':
      return updateData(state, { corrections: [action.correction, ...data.corrections] });
    case 'decideCorrection': {
      const c = data.corrections.find((x) => x.id === action.id);
      if (!c) return state;
      const corrections = data.corrections.map((x) =>
        x.id === action.id ? { ...x, status: action.approve ? ('genehmigt' as const) : ('abgelehnt' as const), decidedBy: action.decidedBy } : x,
      );
      if (!action.approve) return updateData(state, { corrections });
      const gross = toMinutes(c.requested.end) - toMinutes(c.requested.start);
      const corrected: TimeEntry = {
        id: newId('t'),
        employeeId: c.employeeId,
        date: c.date,
        start: c.requested.start,
        end: c.requested.end,
        breakMinutes: requiredBreak(gross),
        source: 'korrektur',
      };
      const entries = [...data.entries.filter((e) => !(e.employeeId === c.employeeId && e.date === c.date)), corrected];
      return updateData(state, { corrections, entries });
    }
    case 'addNews':
      return updateData(state, { news: [action.news, ...data.news] });
    case 'replace':
      return action.state;
  }
}
