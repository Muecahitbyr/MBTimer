import type { ISODate } from '../lib/date';
import type { Absence, AbsenceType, RequestStatus } from './types';
import { rel } from './relative';

interface Def {
  employeeId: string;
  type: AbsenceType;
  /** [Woche, Wochentag] von/bis */
  from: [number, number];
  to: [number, number];
  status: RequestStatus;
  note?: string;
  decidedBy?: string;
}

const defs: Def[] = [
  { employeeId: 'e1', type: 'urlaub', from: [-8, 1], to: [-8, 5], status: 'genehmigt', note: 'Sommerurlaub', decidedBy: 'e1' },
  { employeeId: 'e2', type: 'urlaub', from: [-11, 1], to: [-11, 5], status: 'genehmigt', decidedBy: 'e1' },
  { employeeId: 'e2', type: 'urlaub', from: [3, 1], to: [3, 5], status: 'genehmigt', note: 'Herbstferien', decidedBy: 'e1' },
  { employeeId: 'e3', type: 'urlaub', from: [-6, 1], to: [-6, 4], status: 'genehmigt', decidedBy: 'e1' },
  { employeeId: 'e3', type: 'urlaub', from: [7, 1], to: [7, 4], status: 'beantragt', note: 'Brückentage' },
  { employeeId: 'e4', type: 'urlaub', from: [-7, 1], to: [-7, 5], status: 'genehmigt', note: 'Familienurlaub', decidedBy: 'e3' },
  { employeeId: 'e4', type: 'urlaub', from: [5, 1], to: [5, 3], status: 'beantragt', note: 'Umzug' },
  { employeeId: 'e5', type: 'urlaub', from: [-9, 1], to: [-9, 5], status: 'genehmigt', decidedBy: 'e3' },
  { employeeId: 'e5', type: 'freistellung', from: [-4, 5], to: [-4, 5], status: 'genehmigt', note: 'Fortbildung (Freistellung)', decidedBy: 'e1' },
  { employeeId: 'e6', type: 'urlaub', from: [-3, 1], to: [-3, 5], status: 'genehmigt', decidedBy: 'e3' },
  { employeeId: 'e6', type: 'krank', from: [-5, 2], to: [-5, 3], status: 'genehmigt', decidedBy: 'e2' },
  { employeeId: 'e6', type: 'urlaub', from: [4, 1], to: [4, 5], status: 'beantragt' },
  { employeeId: 'e7', type: 'krank', from: [-1, 4], to: [-1, 5], status: 'genehmigt', decidedBy: 'e2' },
  { employeeId: 'e7', type: 'urlaub', from: [2, 1], to: [2, 5], status: 'beantragt', note: 'Skiurlaub' },
  { employeeId: 'e8', type: 'urlaub', from: [-2, 3], to: [-2, 5], status: 'genehmigt', decidedBy: 'e3' },
  { employeeId: 'e9', type: 'krank', from: [0, 1], to: [0, 2], status: 'genehmigt', decidedBy: 'e2' },
  { employeeId: 'e9', type: 'urlaub', from: [1, 1], to: [1, 5], status: 'abgelehnt', note: 'Prüfungsvorbereitung', decidedBy: 'e3' },
  { employeeId: 'e10', type: 'urlaub', from: [0, 1], to: [0, 5], status: 'genehmigt', decidedBy: 'e3' },
  { employeeId: 'e11', type: 'freistellung', from: [-2, 1], to: [-2, 1], status: 'genehmigt', note: 'Sonderurlaub (Umzug)', decidedBy: 'e2' },
  { employeeId: 'e11', type: 'krank', from: [-6, 3], to: [-6, 5], status: 'genehmigt', decidedBy: 'e2' },
  { employeeId: 'e12', type: 'urlaub', from: [1, 2], to: [1, 4], status: 'beantragt' },
  { employeeId: 'e12', type: 'krank', from: [-2, 4], to: [-2, 4], status: 'genehmigt', decidedBy: 'e2' },
  { employeeId: 'e2', type: 'krank', from: [-3, 1], to: [-3, 2], status: 'genehmigt', decidedBy: 'e1' },
  { employeeId: 'e5', type: 'urlaub', from: [-1, 1], to: [-1, 2], status: 'genehmigt', decidedBy: 'e3' },
  { employeeId: 'e1', type: 'urlaub', from: [-2, 4], to: [-2, 5], status: 'genehmigt', note: 'Kongress', decidedBy: 'e1' },
  { employeeId: 'e8', type: 'urlaub', from: [2, 1], to: [2, 5], status: 'genehmigt', decidedBy: 'e3' },
  { employeeId: 'e11', type: 'urlaub', from: [1, 1], to: [1, 5], status: 'genehmigt', decidedBy: 'e3' },
];

export function createAbsences(today: ISODate): Absence[] {
  return defs.map((d, i) => {
    const from = rel(today, d.from[0], d.from[1]);
    return {
      id: `a${i + 1}`,
      employeeId: d.employeeId,
      type: d.type,
      from,
      to: rel(today, d.to[0], d.to[1]),
      status: d.status,
      note: d.note,
      decidedBy: d.decidedBy,
      createdAt: rel(today, Math.min(d.from[0] - 3, -1), 2),
    };
  });
}
