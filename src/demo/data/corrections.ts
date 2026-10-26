import type { ISODate } from '../lib/date';
import type { CorrectionRequest } from './types';
import { rel } from './relative';

type Def = Omit<CorrectionRequest, 'id' | 'date' | 'createdAt'> & { at: [number, number] };

const defs: Def[] = [
  { employeeId: 'e4', at: [-1, 3], original: { start: '07:28', end: null }, requested: { start: '07:28', end: '16:05' }, reason: 'Ausstempeln vergessen.', status: 'offen' },
  { employeeId: 'e6', at: [-2, 2], original: { start: '08:20', end: '16:30' }, requested: { start: '07:45', end: '16:30' }, reason: 'Kiosk-Tablet war morgens nicht erreichbar, Arbeitsbeginn 07:45.', status: 'offen' },
  { employeeId: 'e9', at: [-3, 1], original: null, requested: { start: '07:30', end: '16:00' }, reason: 'Kommen und Gehen vergessen zu stempeln.', status: 'offen' },
  { employeeId: 'e7', at: [-4, 4], original: { start: '08:30', end: '14:00' }, requested: { start: '08:30', end: '17:15' }, reason: 'Notfallpatient – länger geblieben, Gehen versehentlich zu früh gestempelt.', status: 'genehmigt', decidedBy: 'e1' },
  { employeeId: 'e4', at: [-5, 5], original: { start: '09:10', end: '16:00' }, requested: { start: '07:30', end: '16:00' }, reason: 'Stempeln am Morgen vergessen.', status: 'genehmigt', decidedBy: 'e2' },
  { employeeId: 'e10', at: [-6, 2], original: { start: '07:00', end: '15:30' }, requested: { start: '06:15', end: '15:30' }, reason: 'Früher angefangen.', status: 'abgelehnt', decidedBy: 'e1' },
];

export function createCorrections(today: ISODate): CorrectionRequest[] {
  return defs.map(({ at, ...d }, i) => {
    const date = rel(today, at[0], at[1]);
    return { ...d, id: `k${i + 1}`, date, createdAt: rel(today, at[0] + (at[1] === 5 ? 1 : 0), at[1] === 5 ? 1 : at[1] + 1) };
  });
}
