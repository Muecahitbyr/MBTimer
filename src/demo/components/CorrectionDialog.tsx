import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useDemo } from '../store/DemoStore';
import { newId } from '../store/reducer';
import { formatDate, toMinutes } from '../lib/date';
import { useNotify } from './Feedback';

interface Props {
  open: boolean;
  onClose: () => void;
  employeeId: string;
  defaultDate?: string;
}

export default function CorrectionDialog(props: Props) {
  // Neu mounten bei jedem Öffnen, damit Vorbelegung stimmt.
  return props.open ? <CorrectionForm {...props} /> : null;
}

function CorrectionForm({ onClose, employeeId, defaultDate }: Props) {
  const { state, dispatch, clock } = useDemo();
  const notify = useNotify();
  const [date, setDate] = useState(defaultDate ?? clock.today);
  const recorded = state.data.entries.filter((e) => e.employeeId === employeeId && e.date === date).sort((a, b) => a.start.localeCompare(b.start));
  const [start, setStart] = useState(recorded[0]?.start ?? '');
  const [end, setEnd] = useState(recorded.at(-1)?.end ?? '');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const changeDate = (d: string) => {
    setDate(d);
    const rec = state.data.entries.filter((e) => e.employeeId === employeeId && e.date === d).sort((a, b) => a.start.localeCompare(b.start));
    setStart(rec[0]?.start ?? '');
    setEnd(rec.at(-1)?.end ?? '');
  };

  const submit = () => {
    if (!date || date < state.data.rangeStart || date > clock.today) return setError('Bitte ein Datum im Demo-Zeitraum bis heute wählen.');
    if (!start || !end || toMinutes(end) <= toMinutes(start)) return setError('„Gehen“ muss nach „Kommen“ liegen.');
    if (!reason.trim()) return setError('Bitte eine kurze Begründung angeben.');
    if (state.data.corrections.some((c) => c.employeeId === employeeId && c.date === date && c.status === 'offen'))
      return setError('Für diesen Tag gibt es bereits einen offenen Antrag.');
    dispatch({
      type: 'addCorrection',
      correction: {
        id: newId('k'),
        employeeId,
        date,
        original: recorded[0] ? { start: recorded[0].start, end: recorded.at(-1)?.end ?? null } : null,
        requested: { start, end },
        reason: reason.trim(),
        status: 'offen',
        createdAt: clock.today,
      },
    });
    notify('Korrekturantrag gestellt.');
    onClose();
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs" aria-labelledby="korrektur-titel">
      <DialogTitle id="korrektur-titel">Zeitkorrektur beantragen</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
          <TextField label="Datum" type="date" value={date} onChange={(e) => changeDate(e.target.value)} slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: state.data.rangeStart, max: clock.today } }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Gebucht am {date ? formatDate(date) : '–'}:{' '}
            {recorded.length ? recorded.map((r) => `${r.start} – ${r.end ?? 'offen'}`).join(', ') : 'keine Buchung'}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField label="Kommen" type="time" value={start} onChange={(e) => setStart(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
            <TextField label="Gehen" type="time" value={end} onChange={(e) => setEnd(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
          </Box>
          <TextField label="Begründung" multiline minRows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
          {error && <Alert severity="error">{error}</Alert>}
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Der Antrag wird von Chef oder Praxis-Admin geprüft.</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button variant="contained" onClick={submit}>Antrag stellen</Button>
      </DialogActions>
    </Dialog>
  );
}
