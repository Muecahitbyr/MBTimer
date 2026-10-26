import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useDemo } from '../store/DemoStore';
import { newId } from '../store/reducer';
import { scheduleFor, dailyTargetMinutes } from '../data/schedules';
import { eachDay, formatDuration, formatLong, fromMinutes, toMinutes } from '../lib/date';
import { dayInfo, type DayInfo } from '../lib/time';
import { HOLIDAY_COLOR } from '../lib/absenceStyle';
import DateCalendar, { CalendarLegend, type DayMeta } from './calendar/DateCalendar';
import TimeField from './calendar/TimeField';
import { DayStatusChip } from './StatusChip';
import { useNotify } from './Feedback';

interface Props {
  open: boolean;
  onClose: () => void;
  employeeId: string;
  defaultDate?: string;
}

const PROBLEM_COLOR = '#C0392B';
const PENDING_COLOR = '#B7791F';

export default function CorrectionDialog(props: Props) {
  // Neu mounten bei jedem Öffnen, damit Vorbelegung stimmt.
  return props.open ? <CorrectionForm {...props} /> : null;
}

function bookedTimes(info: DayInfo) {
  const sorted = [...info.entries].sort((a, b) => a.start.localeCompare(b.start));
  return { start: sorted[0]?.start ?? '', end: sorted.at(-1)?.end ?? '' };
}

function CorrectionForm({ onClose, employeeId, defaultDate }: Props) {
  const { state, dispatch, clock } = useDemo();
  const notify = useNotify();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { data } = state;

  const days = eachDay(data.rangeStart, clock.today).map((d) => dayInfo(data, employeeId, d, clock));
  const infoByDate = new Map(days.map((d) => [d.date, d]));
  const problems = days.filter((d) => d.status === 'fehlt' || d.status === 'unvollstaendig');
  const openRequests = new Set(data.corrections.filter((c) => c.employeeId === employeeId && c.status === 'offen').map((c) => c.date));

  const unrequested = problems.filter((p) => !openRequests.has(p.date));
  // Vorschlag: letzter Tag mit fehlender Buchung, für den noch kein Antrag läuft.
  const initialDate = defaultDate ?? unrequested.at(-1)?.date ?? clock.today;
  const [date, setDate] = useState(initialDate);
  const info = infoByDate.get(date) ?? dayInfo(data, employeeId, date, clock);
  const schedule = scheduleFor(employeeId);
  const plannedEnd = fromMinutes(toMinutes(schedule.start) + dailyTargetMinutes(schedule) + 30);
  const [start, setStart] = useState(() => bookedTimes(info).start || schedule.start);
  const [end, setEnd] = useState(() => bookedTimes(info).end || plannedEnd);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const changeDate = (d: string) => {
    setDate(d);
    setError('');
    const times = bookedTimes(infoByDate.get(d) ?? dayInfo(data, employeeId, d, clock));
    setStart(times.start || schedule.start);
    setEnd(times.end || plannedEnd);
  };

  const getMeta = (d: string): DayMeta => {
    const i = infoByDate.get(d);
    if (!i) return {};
    const muted = i.status === 'frei' || i.status === 'feiertag';
    if (openRequests.has(d)) return { holiday: i.holiday, muted, dot: { color: PENDING_COLOR, label: 'Korrektur beantragt' } };
    if (i.status === 'fehlt') return { holiday: i.holiday, muted, dot: { color: PROBLEM_COLOR, label: 'Keine Buchung' } };
    if (i.status === 'unvollstaendig') return { holiday: i.holiday, muted, dot: { color: PROBLEM_COLOR, label: 'Gehen fehlt' } };
    return { holiday: i.holiday, muted };
  };

  const submit = () => {
    if (!start || !end || toMinutes(end) <= toMinutes(start)) return setError('„Gehen“ muss nach „Kommen“ liegen.');
    if (!reason.trim()) return setError('Bitte eine kurze Begründung angeben.');
    if (openRequests.has(date)) return setError('Für diesen Tag gibt es bereits einen offenen Antrag.');
    const booked = bookedTimes(info);
    dispatch({
      type: 'addCorrection',
      correction: {
        id: newId('k'),
        employeeId,
        date,
        original: booked.start ? { start: booked.start, end: booked.end || null } : null,
        requested: { start, end },
        reason: reason.trim(),
        status: 'offen',
        createdAt: clock.today,
      },
    });
    notify('Korrekturantrag gestellt.');
    onClose();
  };

  const net = start && end && toMinutes(end) > toMinutes(start) ? toMinutes(end) - toMinutes(start) : 0;

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen} aria-labelledby="korrektur-titel">
      <DialogTitle id="korrektur-titel">Zeitkorrektur beantragen</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'auto 1fr' }, gap: 3, pt: 1, alignItems: 'start' }}>
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 3, p: { xs: 1, sm: 2 }, overflowX: 'auto' }}>
            <DateCalendar
              mode="single"
              label="Tag für die Korrektur wählen"
              value={{ from: date, to: date }}
              onChange={(r) => r.from && changeDate(r.from)}
              today={clock.today}
              min={data.rangeStart}
              max={clock.today}
              getMeta={getMeta}
            />
            <CalendarLegend
              items={[
                { color: PROBLEM_COLOR, label: 'Buchung fehlt' },
                { color: PENDING_COLOR, label: 'Antrag offen' },
                { color: HOLIDAY_COLOR, label: 'Feiertag' },
              ]}
            />
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 1, color: 'text.secondary' }}>
              {unrequested.length === 0
                ? 'Keine offenen Lücken – alle Buchungen vollständig oder beantragt.'
                : `${unrequested.length} Tag${unrequested.length === 1 ? '' : 'e'} mit fehlender Buchung, noch nicht beantragt`}
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gap: 2 }}>
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'var(--mbt-tint)' }} aria-live="polite">
              <Typography sx={{ fontWeight: 700 }}>{formatLong(date)}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                <DayStatusChip status={info.status} label={info.holiday && info.status === 'feiertag' ? info.holiday : undefined} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Gebucht:{' '}
                  {info.entries.length ? info.entries.map((e) => `${e.start} – ${e.end ?? 'offen'}`).join(', ') : 'keine Buchung'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TimeField label="Kommen" value={start} onChange={setStart} />
              <TimeField label="Gehen" value={end} onChange={setEnd} />
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Schnellauswahl:</Typography>
              <Chip
                size="small"
                variant="outlined"
                label={`Plan ${schedule.start} – ${plannedEnd}`}
                onClick={() => {
                  setStart(schedule.start);
                  setEnd(plannedEnd);
                }}
              />
              {info.entries[0] && (
                <Chip
                  size="small"
                  variant="outlined"
                  label="Gebuchte Zeiten"
                  onClick={() => {
                    const t = bookedTimes(info);
                    setStart(t.start);
                    setEnd(t.end);
                  }}
                />
              )}
              {net > 0 && (
                <Typography variant="body2" sx={{ ml: 'auto', color: 'text.secondary' }}>
                  Anwesenheit {formatDuration(net)}
                </Typography>
              )}
            </Box>
            <TextField label="Begründung" multiline minRows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="z. B. Ausstempeln vergessen" />
            {openRequests.has(date) && <Alert severity="info">Für diesen Tag liegt bereits ein offener Korrekturantrag vor.</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Der Antrag wird von Chef oder Admin geprüft.</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button variant="contained" onClick={submit} disabled={openRequests.has(date)}>Antrag stellen</Button>
      </DialogActions>
    </Dialog>
  );
}
