import type { Employee } from './types';

/** Erfundenes Team der fiktiven „Zahnarztpraxis Sonnenschein“. Ähnlichkeiten mit echten Personen sind zufällig. */
export const PRACTICE_NAME = 'Zahnarztpraxis Sonnenschein';

export const employees: Employee[] = [
  { id: 'e1', firstName: 'Jonas', lastName: 'Wendt', position: 'Zahnarzt, Praxisinhaber', role: 'chef', email: 'jonas.wendt@example.com', pin: '1001', color: '#1E3A5F', vacationDays: 30, vacationTakenBefore: 10, overtimeCarryMinutes: 0 },
  { id: 'e2', firstName: 'Sabine', lastName: 'Krüger', position: 'Praxismanagerin', role: 'admin', email: 'sabine.krueger@example.com', pin: '2002', color: '#6A4C93', vacationDays: 30, vacationTakenBefore: 12, overtimeCarryMinutes: 320 },
  { id: 'e3', firstName: 'Melanie', lastName: 'Hoffmann', position: 'Verwaltung (ZMV)', role: 'urlaub', email: 'melanie.hoffmann@example.com', pin: '3003', color: '#A85410', vacationDays: 24, vacationTakenBefore: 8, overtimeCarryMinutes: 95 },
  { id: 'e4', firstName: 'Lea', lastName: 'Schneider', position: 'Zahnmedizinische Fachangestellte', role: 'mitarbeiter', email: 'lea.schneider@example.com', pin: '4004', color: '#0277BD', vacationDays: 30, vacationTakenBefore: 9, overtimeCarryMinutes: 410 },
  { id: 'e5', firstName: 'Katrin', lastName: 'Albers', position: 'Zahnärztin', role: 'mitarbeiter', email: 'katrin.albers@example.com', pin: '5005', color: '#AD1457', vacationDays: 24, vacationTakenBefore: 7, overtimeCarryMinutes: -60 },
  { id: 'e6', firstName: 'Aylin', lastName: 'Demir', position: 'Zahnmedizinische Fachangestellte', role: 'mitarbeiter', email: 'aylin.demir@example.com', pin: '6006', color: '#00737D', vacationDays: 30, vacationTakenBefore: 11, overtimeCarryMinutes: 250 },
  { id: 'e7', firstName: 'Tim', lastName: 'Bauer', position: 'Prophylaxe (ZMP)', role: 'mitarbeiter', email: 'tim.bauer@example.com', pin: '7007', color: '#3F6E22', vacationDays: 30, vacationTakenBefore: 10, overtimeCarryMinutes: 730 },
  { id: 'e8', firstName: 'Julia', lastName: 'Neumann', position: 'Dentalhygienikerin', role: 'mitarbeiter', email: 'julia.neumann@example.com', pin: '8008', color: '#C62828', vacationDays: 18, vacationTakenBefore: 6, overtimeCarryMinutes: 0 },
  { id: 'e9', firstName: 'Sophie', lastName: 'Richter', position: 'Auszubildende ZFA', role: 'mitarbeiter', email: 'sophie.richter@example.com', pin: '9009', color: '#4527A0', vacationDays: 28, vacationTakenBefore: 8, overtimeCarryMinutes: 45 },
  { id: 'e10', firstName: 'Marco', lastName: 'Lehmann', position: 'Zahntechniker (Praxislabor)', role: 'mitarbeiter', email: 'marco.lehmann@example.com', pin: '1010', color: '#5D4037', vacationDays: 30, vacationTakenBefore: 12, overtimeCarryMinutes: 180 },
  { id: 'e11', firstName: 'Nina', lastName: 'Vogel', position: 'Empfang', role: 'mitarbeiter', email: 'nina.vogel@example.com', pin: '1111', color: '#B34700', vacationDays: 30, vacationTakenBefore: 10, overtimeCarryMinutes: 30 },
  { id: 'e12', firstName: 'Hanna', lastName: 'Wolf', position: 'Praxishilfe', role: 'mitarbeiter', email: 'hanna.wolf@example.com', pin: '1212', color: '#37474F', vacationDays: 12, vacationTakenBefore: 4, overtimeCarryMinutes: 0 },
];

/** Personen für die Schnellauswahl im Demo-Login. */
export const DEMO_PERSONAS = [
  { employeeId: 'e1', title: 'Chef', description: 'Sieht alles: Team, Statistiken, Genehmigungen von Urlaub und Zeitkorrekturen.' },
  { employeeId: 'e2', title: 'Admin', description: 'Verwaltet Mitarbeiter, trägt Krankmeldungen ein, genehmigt Anträge.' },
  { employeeId: 'e3', title: 'Urlaubsbeauftragte', description: 'Genehmigt Urlaubsanträge und behält den Urlaubskalender im Blick.' },
  { employeeId: 'e4', title: 'Mitarbeiterin', description: 'Stempelt, sieht eigene Zeiten, stellt Urlaubs- und Korrekturanträge.' },
] as const;

export const PERSONA_IDS: readonly string[] = DEMO_PERSONAS.map((p) => p.employeeId);

export function fullName(e: Pick<Employee, 'firstName' | 'lastName' | 'role' | 'position'>): string {
  const title = e.position.startsWith('Zahnärzt') || e.position.startsWith('Zahnarzt') ? 'Dr. ' : '';
  return `${title}${e.firstName} ${e.lastName}`;
}

export function initials(e: Pick<Employee, 'firstName' | 'lastName'>): string {
  return `${e.firstName[0]}${e.lastName[0]}`;
}
