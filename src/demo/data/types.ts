import type { ISODate } from '../lib/date';

export type Role = 'chef' | 'admin' | 'urlaub' | 'mitarbeiter';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  role: Role;
  email: string;
  /** Demo-PIN für den Kiosk (wird in der Demo angezeigt). */
  pin: string;
  color: string;
  /** Urlaubsanspruch pro Jahr in Arbeitstagen. */
  vacationDays: number;
  /** Bereits vor dem Demo-Zeitraum genommene Urlaubstage im laufenden Jahr. */
  vacationTakenBefore: number;
  /** Überstundensaldo zu Beginn des Demo-Zeitraums (Minuten). */
  overtimeCarryMinutes: number;
}

export interface WorkSchedule {
  employeeId: string;
  weeklyMinutes: number;
  /** Arbeitstage 1 = Montag … 5 = Freitag */
  days: number[];
  /** Üblicher Arbeitsbeginn */
  start: string;
}

export interface TimeEntry {
  id: string;
  employeeId: string;
  date: ISODate;
  start: string;
  end: string | null;
  breakMinutes: number;
  source: 'web' | 'kiosk' | 'korrektur';
}

export type AbsenceType = 'urlaub' | 'krank' | 'freistellung';
export type RequestStatus = 'beantragt' | 'genehmigt' | 'abgelehnt' | 'zurueckgezogen';

export interface Absence {
  id: string;
  employeeId: string;
  type: AbsenceType;
  from: ISODate;
  to: ISODate;
  status: RequestStatus;
  note?: string;
  createdAt: ISODate;
  decidedBy?: string;
}

export interface CorrectionRequest {
  id: string;
  employeeId: string;
  date: ISODate;
  original: { start: string; end: string | null } | null;
  requested: { start: string; end: string };
  reason: string;
  status: 'offen' | 'genehmigt' | 'abgelehnt';
  createdAt: ISODate;
  decidedBy?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  body: string;
  authorId: string;
  date: ISODate;
  pinned?: boolean;
}

export interface DemoData {
  /** Tag, an dem die Daten erzeugt wurden (Daten sind relativ zu „heute“). */
  generatedFor: ISODate;
  rangeStart: ISODate;
  entries: TimeEntry[];
  absences: Absence[];
  corrections: CorrectionRequest[];
  news: NewsItem[];
}

export const ROLE_LABELS: Record<Role, string> = {
  chef: 'Chef',
  admin: 'Admin',
  urlaub: 'Urlaubsbeauftragte',
  mitarbeiter: 'Mitarbeiter',
};

export const ABSENCE_LABELS: Record<AbsenceType, string> = {
  urlaub: 'Urlaub',
  krank: 'Krankmeldung',
  freistellung: 'Freistellung',
};
