import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useDemoUser } from '../store/DemoStore';
import { newId } from '../store/reducer';
import { employees, fullName } from '../data/employees';
import type { AbsenceType } from '../data/types';
import { addDays } from '../lib/date';
import { countWorkdays, vacationStats } from '../lib/time';
import { useNotify } from './Feedback';

interface Props {
  open: boolean;
  onClose: () => void;
  /** 'antrag' = eigener Urlaubsantrag; 'eintrag' = Admin trägt Krankmeldung/Freistellung ein. */
  mode: 'antrag' | 'eintrag';
}

export default function AbsenceDialog(props: Props) {
  return props.open ? <AbsenceForm {...props} /> : null;
}

function AbsenceForm({ onClose, mode }: Props) {
  const { user, state, dispatch, clock } = useDemoUser();
  const notify = useNotify();
  const [employeeId, setEmployeeId] = useState(mode === 'antrag' ? user.id : 'e6');
  const [type, setType] = useState<AbsenceType>(mode === 'antrag' ? 'urlaub' : 'krank');
  const [from, setFrom] = useState(mode === 'antrag' ? addDays(clock.today, 14) : clock.today);
  const [to, setTo] = useState(mode === 'antrag' ? addDays(clock.today, 18) : clock.today);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const days = from && to ? countWorkdays(employeeId, from, to) : 0;
  const employee = employees.find((e) => e.id === employeeId)!;
  const stats = vacationStats(state.data, employee, Number(clock.today.slice(0, 4)));

  const submit = () => {
    if (!from || !to || to < from) return setError('Das Enddatum muss nach dem Startdatum liegen.');
    if (days === 0) return setError('Im gewählten Zeitraum liegen keine Arbeitstage.');
    if (mode === 'antrag' && from < clock.today) return setError('Urlaub kann nur für die Zukunft beantragt werden.');
    const overlap = state.data.absences.some(
      (a) => a.employeeId === employeeId && (a.status === 'beantragt' || a.status === 'genehmigt') && a.from <= to && from <= a.to,
    );
    if (overlap) return setError('Im Zeitraum gibt es bereits eine Abwesenheit oder einen offenen Antrag.');
    dispatch({
      type: 'addAbsence',
      absence: {
        id: newId('a'),
        employeeId,
        type,
        from,
        to,
        note: note.trim() || undefined,
        status: mode === 'antrag' ? 'beantragt' : 'genehmigt',
        decidedBy: mode === 'antrag' ? undefined : user.id,
        createdAt: clock.today,
      },
    });
    notify(mode === 'antrag' ? 'Urlaubsantrag gestellt.' : 'Abwesenheit eingetragen.');
    onClose();
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs" aria-labelledby="abwesenheit-titel">
      <DialogTitle id="abwesenheit-titel">{mode === 'antrag' ? 'Urlaub beantragen' : 'Abwesenheit eintragen'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gap: 2, pt: 1 }}>
          {mode === 'eintrag' && (
            <>
              <TextField select label="Mitarbeiter" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
                {employees.map((e) => (
                  <MenuItem key={e.id} value={e.id}>{fullName(e)}</MenuItem>
                ))}
              </TextField>
              <TextField select label="Art" value={type} onChange={(e) => setType(e.target.value as AbsenceType)}>
                <MenuItem value="krank">Krankmeldung</MenuItem>
                <MenuItem value="freistellung">Freistellung (z. B. Sonderurlaub)</MenuItem>
                <MenuItem value="urlaub">Urlaub (direkt genehmigt)</MenuItem>
              </TextField>
            </>
          )}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField label="Von" type="date" value={from} onChange={(e) => setFrom(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
            <TextField label="Bis" type="date" value={to} onChange={(e) => setTo(e.target.value)} slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: from } }} />
          </Box>
          <Typography variant="body2" aria-live="polite">
            <strong>{days}</strong> Arbeitstag{days === 1 ? '' : 'e'} laut Arbeitszeitplan (ohne Wochenenden und Feiertage)
            {type === 'urlaub' && ` · Resturlaub danach: ${stats.remaining - days} Tage`}
          </Typography>
          <TextField label="Bemerkung (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button variant="contained" onClick={submit}>{mode === 'antrag' ? 'Antrag stellen' : 'Eintragen'}</Button>
      </DialogActions>
    </Dialog>
  );
}
