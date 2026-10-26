import Chip, { type ChipProps } from '@mui/material/Chip';
import type { RequestStatus } from '../data/types';
import type { DayStatus } from '../lib/time';

const DAY: Record<DayStatus, { label: string; color: ChipProps['color'] }> = {
  arbeit: { label: 'Gearbeitet', color: 'default' },
  laeuft: { label: 'Läuft', color: 'primary' },
  unvollstaendig: { label: 'Unvollständig', color: 'warning' },
  fehlt: { label: 'Keine Buchung', color: 'error' },
  heute: { label: 'Heute', color: 'default' },
  urlaub: { label: 'Urlaub', color: 'success' },
  krank: { label: 'Krank', color: 'error' },
  freistellung: { label: 'Freistellung', color: 'secondary' },
  feiertag: { label: 'Feiertag', color: 'default' },
  frei: { label: 'Frei', color: 'default' },
  zukunft: { label: 'Geplant', color: 'default' },
  ausserhalb: { label: '–', color: 'default' },
};

export function DayStatusChip({ status, label }: { status: DayStatus; label?: string }) {
  const meta = DAY[status];
  return <Chip size="small" label={label ?? meta.label} color={meta.color} variant={meta.color === 'default' ? 'outlined' : 'filled'} />;
}

const REQUEST: Record<RequestStatus | 'offen', { label: string; color: ChipProps['color'] }> = {
  beantragt: { label: 'Beantragt', color: 'warning' },
  offen: { label: 'Offen', color: 'warning' },
  genehmigt: { label: 'Genehmigt', color: 'success' },
  abgelehnt: { label: 'Abgelehnt', color: 'error' },
  zurueckgezogen: { label: 'Zurückgezogen', color: 'default' },
};

export function RequestStatusChip({ status }: { status: RequestStatus | 'offen' }) {
  const meta = REQUEST[status];
  return <Chip size="small" label={meta.label} color={meta.color} variant={meta.color === 'default' ? 'outlined' : 'filled'} />;
}
