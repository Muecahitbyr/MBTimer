import { describe, expect, it } from 'vitest';
import { createInitialData } from '../data/initialState';
import { demoReducer, type DemoState } from './reducer';

const today = '2026-10-26';
const initial: DemoState = { data: createInitialData(today, 600), currentUserId: 'e4' };

describe('Demo-Reducer', () => {
  it('Kommen und Gehen mit automatischer Pause', () => {
    let s = demoReducer(initial, { type: 'clockIn', employeeId: 'e4', date: today, time: '07:30', source: 'web' });
    s = demoReducer(s, { type: 'clockIn', employeeId: 'e4', date: today, time: '07:31', source: 'web' });
    expect(s.data.entries.filter((e) => e.employeeId === 'e4' && e.date === today)).toHaveLength(1);
    s = demoReducer(s, { type: 'clockOut', employeeId: 'e4', date: today, time: '16:00' });
    const e = s.data.entries.find((x) => x.employeeId === 'e4' && x.date === today)!;
    expect(e.end).toBe('16:00');
    expect(e.breakMinutes).toBe(30);
  });

  it('genehmigte Korrektur ersetzt die Stempelzeiten', () => {
    const k = initial.data.corrections.find((c) => c.employeeId === 'e4' && c.status === 'offen')!;
    const s = demoReducer(initial, { type: 'decideCorrection', id: k.id, approve: true, decidedBy: 'e1' });
    const entries = s.data.entries.filter((e) => e.employeeId === 'e4' && e.date === k.date);
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ start: k.requested.start, end: k.requested.end, source: 'korrektur' });
    expect(s.data.corrections.find((c) => c.id === k.id)?.status).toBe('genehmigt');
  });

  it('abgelehnte Korrektur lässt Zeiten unverändert', () => {
    const k = initial.data.corrections.find((c) => c.status === 'offen')!;
    const s = demoReducer(initial, { type: 'decideCorrection', id: k.id, approve: false, decidedBy: 'e1' });
    expect(s.data.entries).toBe(initial.data.entries);
  });
});
