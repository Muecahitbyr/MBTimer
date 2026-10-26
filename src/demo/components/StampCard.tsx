import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import LoginRounded from '@mui/icons-material/LoginRounded';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import { useDemo } from '../store/DemoStore';
import { dayInfo } from '../lib/time';
import { formatDuration, formatLong } from '../lib/date';
import { useStamp } from './useStamp';
import { ABSENCE_LABELS } from '../data/types';

export default function StampCard({ employeeId }: { employeeId: string }) {
  const { state, clock } = useDemo();
  const { open, toggle } = useStamp(employeeId);
  const today = dayInfo(state.data, employeeId, clock.today, clock);
  const done = today.entries.filter((e) => e.end);

  let status = 'Noch nicht eingestempelt';
  if (open) status = `Eingestempelt seit ${open.start} Uhr`;
  else if (today.absence) status = `Heute: ${ABSENCE_LABELS[today.absence.type]}`;
  else if (done.length) status = `Ausgestempelt um ${done.at(-1)?.end} Uhr`;

  return (
    <Card sx={{ height: '100%', borderColor: open ? 'primary.main' : undefined, borderWidth: open ? 2 : 1 }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
        <Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>{formatLong(clock.today)}</Typography>
          <Typography variant="h6" component="p" sx={{ mt: 0.5 }} aria-live="polite">{status}</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Heute gearbeitet: <strong>{formatDuration(today.status === 'urlaub' || today.status === 'krank' || today.status === 'freistellung' ? 0 : today.ist)}</strong>
            {today.soll > 0 && ` von ${formatDuration(today.soll)}`}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Button
          variant="contained"
          size="large"
          color={open ? 'secondary' : 'primary'}
          startIcon={open ? <LogoutRounded /> : <LoginRounded />}
          onClick={() => toggle('web')}
          sx={{ py: 1.5, fontSize: '1.05rem' }}
        >
          {open ? 'Gehen stempeln' : 'Kommen stempeln'}
        </Button>
      </CardContent>
    </Card>
  );
}
