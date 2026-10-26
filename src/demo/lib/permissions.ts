import type { Role } from '../data/types';

export const can = {
  approveVacation: (r: Role) => r === 'chef' || r === 'admin' || r === 'urlaub',
  approveCorrections: (r: Role) => r === 'chef' || r === 'admin',
  manageEmployees: (r: Role) => r === 'chef' || r === 'admin',
  recordAbsences: (r: Role) => r === 'chef' || r === 'admin',
  postNews: (r: Role) => r === 'chef' || r === 'admin',
  viewAllTimes: (r: Role) => r === 'chef' || r === 'admin',
  /** Mitarbeiter sehen im Teamkalender nur „abwesend“ statt des Grundes. */
  seeAbsenceReasons: (r: Role) => r !== 'mitarbeiter',
};
