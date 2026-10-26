import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useDemoUser } from '../store/DemoStore';
import { employees, fullName } from '../data/employees';
import { scheduleFor } from '../data/schedules';
import { ROLE_LABELS } from '../data/types';
import { formatDuration, WEEKDAY_LABELS } from '../lib/date';
import { overtimeBalance, presence, vacationStats, type Presence } from '../lib/time';
import PageHeader from '../components/PageHeader';
import EmployeeAvatar from '../components/EmployeeAvatar';
import { ABSENCE_LABELS } from '../data/types';

function PresenceChip({ p }: { p: Presence }) {
  switch (p.kind) {
    case 'anwesend':
      return <Chip size="small" color="success" label={`Anwesend seit ${p.since}`} />;
    case 'gegangen':
      return <Chip size="small" variant="outlined" label={`Gegangen ${p.at}`} />;
    case 'abwesend':
      return <Chip size="small" color={p.type === 'krank' ? 'error' : 'default'} variant="outlined" label={ABSENCE_LABELS[p.type]} />;
    case 'frei':
      return <Chip size="small" variant="outlined" label="Kein Arbeitstag" />;
    default:
      return <Chip size="small" variant="outlined" label="Nicht eingestempelt" />;
  }
}

export default function Mitarbeiter() {
  const { state, clock } = useDemoUser();
  const year = Number(clock.today.slice(0, 4));
  const rows = employees.map((e) => {
    const s = scheduleFor(e.id);
    return {
      e,
      s,
      days: s.days.map((d) => WEEKDAY_LABELS[d - 1]).join(', '),
      p: presence(state.data, e.id, clock),
      balance: overtimeBalance(state.data, e, clock),
      vacation: vacationStats(state.data, e, year),
    };
  });

  return (
    <>
      <PageHeader title="Mitarbeiter" subtitle={`${employees.length} Mitarbeiter · Arbeitszeitpläne, Urlaubsanspruch und Status`} />
      <Card sx={{ display: { xs: 'none', md: 'block' } }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Rolle</TableCell>
                <TableCell>Arbeitszeitplan</TableCell>
                <TableCell align="right">Urlaub (Rest)</TableCell>
                <TableCell align="right">Überstunden</TableCell>
                <TableCell>Heute</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(({ e, s, days, p, balance, vacation }) => (
                <TableRow key={e.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 0.5 }}>
                      <EmployeeAvatar employee={e} size={32} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{fullName(e)}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{e.position} · {e.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell><Chip size="small" variant="outlined" label={ROLE_LABELS[e.role]} /></TableCell>
                  <TableCell>
                    {formatDuration(s.weeklyMinutes)}/Woche
                    <Typography variant="caption" component="div" sx={{ color: 'text.secondary' }}>{days} · ab {s.start}</Typography>
                  </TableCell>
                  <TableCell align="right">{vacation.remaining} / {vacation.entitlement}</TableCell>
                  <TableCell align="right" sx={{ color: balance >= 0 ? 'success.main' : 'error.main', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{formatDuration(balance, true)}</TableCell>
                  <TableCell><PresenceChip p={p} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: { xs: 'grid', md: 'none' }, gap: 1.5 }}>
        {rows.map(({ e, s, days, p, balance, vacation }) => (
          <Card component="li" key={e.id} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <EmployeeAvatar employee={e} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600 }}>{fullName(e)}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{e.position}</Typography>
              </Box>
              <Chip size="small" variant="outlined" label={ROLE_LABELS[e.role]} />
            </Box>
            <Typography variant="body2" sx={{ mt: 1.5 }}>
              {formatDuration(s.weeklyMinutes)}/Woche · {days}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Resturlaub {vacation.remaining}/{vacation.entitlement} · Überstunden {formatDuration(balance, true)}
            </Typography>
            <Box sx={{ mt: 1 }}><PresenceChip p={p} /></Box>
          </Card>
        ))}
      </Box>
    </>
  );
}
