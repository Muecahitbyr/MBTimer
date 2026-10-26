import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import EventOutlined from '@mui/icons-material/EventOutlined';
import { useDemoUser } from '../store/DemoStore';
import { newId } from '../store/reducer';
import { employees, fullName } from '../data/employees';
import { ABSENCE_LABELS, type AbsenceType } from '../data/types';
import { formatDate, formatWeekdayShort } from '../lib/date';
import { holidayName } from '../lib/holidays';
import { countWorkdays, isWorkday, vacationStats } from '../lib/time';
import { ABSENCE_STYLE, HOLIDAY_COLOR } from '../lib/absenceStyle';
import DateCalendar, { CalendarLegend, type DateRange, type DayMeta } from './calendar/DateCalendar';
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

const day = (d: string) => `${formatWeekdayShort(d)}, ${formatDate(d)}`;

function AbsenceForm({ onClose, mode }: Props) {
  const { user, state, dispatch, clock } = useDemoUser();
  const notify = useNotify();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [employeeId, setEmployeeId] = useState(mode === 'antrag' ? user.id : 'e6');
  const [type, setType] = useState<AbsenceType>(mode === 'antrag' ? 'urlaub' : 'krank');
  const [range, setRange] = useState<DateRange>({ from: null, to: null });
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const employee = employees.find((e) => e.id === employeeId)!;
  const stats = vacationStats(state.data, employee, Number(clock.today.slice(0, 4)));
  const from = range.from;
  const to = range.to ?? range.from;
  const days = from && to ? countWorkdays(employeeId, from, to) : 0;
  const existing = state.data.absences.filter(
    (a) => a.employeeId === employeeId && (a.status === 'beantragt' || a.status === 'genehmigt'),
  );

  const getMeta = (d: string): DayMeta => {
    const absence = existing.find((a) => a.from <= d && d <= a.to);
    const kind = absence ? (absence.status === 'beantragt' ? 'beantragt' : absence.type) : null;
    return {
      holiday: holidayName(d),
      muted: !isWorkday(employeeId, d),
      dot: kind ? { color: kind === 'beantragt' ? ABSENCE_STYLE.urlaub.bg : ABSENCE_STYLE[kind].bg, label: ABSENCE_STYLE[kind].label } : undefined,
    };
  };

  const submit = () => {
    if (!from || !to) return setError('Bitte wählen Sie im Kalender den ersten und letzten Tag.');
    if (days === 0) return setError('Im gewählten Zeitraum liegen keine Arbeitstage.');
    if (mode === 'antrag' && type === 'urlaub' && days > stats.remaining)
      return setError(`Der Zeitraum umfasst ${days} Arbeitstage, Ihr Resturlaub beträgt nur ${stats.remaining} Tage.`);
    if (existing.some((a) => a.from <= to && from <= a.to))
      return setError('Im Zeitraum gibt es bereits eine Abwesenheit oder einen offenen Antrag.');
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
    notify(mode === 'antrag' ? 'Urlaubsantrag gestellt.' : `${ABSENCE_LABELS[type]} eingetragen.`);
    onClose();
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md" fullScreen={fullScreen} aria-labelledby="abwesenheit-titel">
      <DialogTitle id="abwesenheit-titel">{mode === 'antrag' ? 'Urlaub beantragen' : 'Abwesenheit eintragen'}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gap: 2.5, pt: 1 }}>
          {mode === 'eintrag' && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr auto' }, gap: 2, alignItems: 'center' }}>
              <TextField select label="Mitarbeiter" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
                {employees.map((e) => (
                  <MenuItem key={e.id} value={e.id}>{fullName(e)}</MenuItem>
                ))}
              </TextField>
              <ToggleButtonGroup value={type} exclusive onChange={(_, v: AbsenceType | null) => v && setType(v)} size="small" color="primary" aria-label="Art der Abwesenheit">
                <ToggleButton value="krank">Krankmeldung</ToggleButton>
                <ToggleButton value="freistellung">Freistellung</ToggleButton>
                <ToggleButton value="urlaub">Urlaub</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'auto 1fr' }, gap: 3, alignItems: 'start' }}>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 3, py: 1, display: 'flex', justifyContent: 'center' }}>
              <DateCalendar
                mode="range"
                label={mode === 'antrag' ? 'Urlaubszeitraum wählen' : 'Zeitraum wählen'}
                value={range}
                onChange={(r) => {
                  setRange(r);
                  setError('');
                }}
                today={clock.today}
                min={mode === 'antrag' ? clock.today : state.data.rangeStart}
                getMeta={getMeta}
              />
            </Box>

            <Box sx={{ display: 'grid', gap: 2 }}>
              <Box aria-live="polite" sx={{ p: 2.5, borderRadius: 3, bgcolor: 'var(--mbt-tint)' }}>
                {from ? (
                  <>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                      {[
                        { label: 'Erster Tag', value: from },
                        { label: 'Letzter Tag', value: range.to },
                      ].map((f) => (
                        <Box key={f.label} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'background.paper', border: 1, borderColor: f.value ? 'primary.main' : 'divider' }}>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>{f.label}</Typography>
                          <Typography sx={{ fontWeight: 700 }}>{f.value ? day(f.value) : '–'}</Typography>
                        </Box>
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, mt: 2 }}>
                      <Chip color="primary" label={`${days} Arbeitstag${days === 1 ? '' : 'e'}`} />
                      {type === 'urlaub' && (
                        <Typography variant="body2" sx={{ color: stats.remaining - days < 0 ? 'error.main' : 'text.secondary' }}>
                          {stats.remaining - days < 0 ? (
                            <>Übersteigt Ihren Resturlaub um <strong>{days - stats.remaining} Tage</strong></>
                          ) : (
                            <>Resturlaub danach: <strong>{stats.remaining - days} Tage</strong> (von {stats.entitlement})</>
                          )}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {range.to ? 'Wochenenden und Feiertage sind nicht mitgezählt.' : 'Für mehrere Tage jetzt den letzten Tag wählen.'}
                      </Typography>
                      <Button size="small" onClick={() => setRange({ from: null, to: null })}>Auswahl löschen</Button>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <EventOutlined color="primary" aria-hidden="true" />
                    <Typography sx={{ color: 'text.secondary' }}>
                      Wählen Sie im Kalender den <strong>ersten</strong> und den <strong>letzten</strong> Tag. Wochenenden und Feiertage werden nicht mitgezählt.
                    </Typography>
                  </Box>
                )}
              </Box>
              <CalendarLegend
                items={[
                  { color: 'var(--mui-palette-text-secondary)', label: 'Heute', ring: true },
                  { color: HOLIDAY_COLOR, label: 'Feiertag' },
                  { color: ABSENCE_STYLE.urlaub.bg, label: 'Urlaub (geplant/beantragt)' },
                  { color: ABSENCE_STYLE.krank.bg, label: 'Krank' },
                  { color: ABSENCE_STYLE.freistellung.bg, label: 'Freistellung' },
                ]}
              />
              <TextField label="Bemerkung (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
              {error && <Alert severity="error">{error}</Alert>}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button variant="contained" onClick={submit} disabled={!from}>
          {mode === 'antrag' ? 'Antrag stellen' : 'Eintragen'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
