/** Farben für Abwesenheiten – gemeinsam für Kalender-Auswahl und Urlaubskalender (Text darauf ≥ 4,5:1). */
export type AbsenceKind = 'urlaub' | 'beantragt' | 'krank' | 'freistellung' | 'abwesend';

export const ABSENCE_STYLE: Record<AbsenceKind, { label: string; bg: string; fg: string; border?: string }> = {
  urlaub: { label: 'Urlaub', bg: '#1E8449', fg: '#FFFFFF' },
  beantragt: { label: 'Urlaub beantragt', bg: '#DCF2E3', fg: '#14532D', border: '#1E8449' },
  krank: { label: 'Krank', bg: '#C0392B', fg: '#FFFFFF' },
  freistellung: { label: 'Freistellung', bg: '#7B4BC4', fg: '#FFFFFF' },
  abwesend: { label: 'Abwesend', bg: '#5F6B7A', fg: '#FFFFFF' },
};

export const HOLIDAY_COLOR = '#B7791F';
/** Hintergrund für Feiertage, abhängig von hell/dunkel (siehe Root.tsx). */
export const HOLIDAY_BG = 'var(--mbt-holiday)';

/** Hintergrund für Balken/Punkte; beantragte Anträge gestreift. */
export function absenceBackground(kind: AbsenceKind): string {
  const s = ABSENCE_STYLE[kind];
  return kind === 'beantragt' ? `repeating-linear-gradient(135deg, ${s.bg} 0 6px, #C3E8CF 6px 12px)` : s.bg;
}
