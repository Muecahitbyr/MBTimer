import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import BalanceOutlined from '@mui/icons-material/BalanceOutlined';
import MoreTimeOutlined from '@mui/icons-material/MoreTimeOutlined';
import BeachAccessOutlined from '@mui/icons-material/BeachAccessOutlined';
import PendingActionsOutlined from '@mui/icons-material/PendingActionsOutlined';
import { useDemoUser } from '../store/DemoStore';
import { employees, fullName } from '../data/employees';
import { formatDate, formatDuration, startOfMonth } from '../lib/date';
import { absenceDays, monthSummary, overtimeBalance, presence, vacationStats } from '../lib/time';
import { can } from '../lib/permissions';
import StampCard from '../components/StampCard';
import StatCard from '../components/StatCard';
import EmployeeAvatar from '../components/EmployeeAvatar';
import PageHeader from '../components/PageHeader';
import { ABSENCE_LABELS } from '../data/types';

function greeting(minutes: number) {
  if (minutes < 11 * 60) return 'Guten Morgen';
  if (minutes < 18 * 60) return 'Guten Tag';
  return 'Guten Abend';
}

export default function Dashboard() {
  const { user, state, clock } = useDemoUser();
  const { data } = state;
  const month = monthSummary(data, user.id, startOfMonth(clock.today), clock);
  const balance = overtimeBalance(data, user, clock);
  const vacation = vacationStats(data, user, Number(clock.today.slice(0, 4)));
  const ownOpen =
    data.absences.filter((a) => a.employeeId === user.id && a.status === 'beantragt').length +
    data.corrections.filter((c) => c.employeeId === user.id && c.status === 'offen').length;

  const pendingVacation = data.absences.filter((a) => a.status === 'beantragt');
  const pendingCorrections = data.corrections.filter((c) => c.status === 'offen');
  const team = employees.map((e) => ({ e, p: presence(data, e.id, clock) }));
  const present = team.filter((t) => t.p.kind === 'anwesend');
  const absent = team.filter((t) => t.p.kind === 'abwesend');

  const monthStart = startOfMonth(clock.today);
  const monthAbsences = data.absences.filter((a) => a.status === 'genehmigt' && a.to >= monthStart && a.from <= `${monthStart.slice(0, 7)}-31`);
  const sickDays = monthAbsences.filter((a) => a.type === 'krank').reduce((s, a) => s + absenceDays(a), 0);
  const vacationDays = monthAbsences.filter((a) => a.type === 'urlaub').reduce((s, a) => s + absenceDays(a), 0);
  const overtime = employees.map((e) => ({ e, m: overtimeBalance(data, e, clock) })).sort((a, b) => b.m - a.m);
  const maxOvertime = Math.max(...overtime.map((o) => Math.abs(o.m)), 1);
  const latestNews = [...data.news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2);

  return (
    <>
      <PageHeader title={`${greeting(clock.nowMinutes)}, ${user.firstName}!`} subtitle={`Ihr Überblick für heute – angemeldet als ${user.position}.`} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1.3fr 1fr 1fr' }, gap: 2 }}>
        <Box sx={{ gridRow: { lg: 'span 2' }, gridColumn: { sm: 'span 2', lg: 'auto' } }}>
          <StampCard employeeId={user.id} />
        </Box>
        <StatCard label="Saldo diesen Monat" value={formatDuration(month.diff, true)} hint={`Ist ${formatDuration(month.ist)} · Soll bis heute ${formatDuration(month.sollBisHeute)}`} icon={<BalanceOutlined />} tone={month.diff >= 0 ? 'positive' : 'negative'} />
        <StatCard label="Überstundenkonto" value={formatDuration(balance, true)} hint="inkl. Übertrag" icon={<MoreTimeOutlined />} tone={balance >= 0 ? 'positive' : 'negative'} />
        <StatCard label="Resturlaub" value={`${vacation.remaining} Tage`} hint={`von ${vacation.entitlement} · ${vacation.pending} Tage beantragt`} icon={<BeachAccessOutlined />} />
        <StatCard label="Meine offenen Anträge" value={ownOpen} hint="Urlaub & Zeitkorrekturen" icon={<PendingActionsOutlined />} />
      </Box>

      {(can.approveVacation(user.role) || can.approveCorrections(user.role)) && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" component="h2">Zu erledigen</Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1.5, flexWrap: 'wrap' }}>
              {can.approveVacation(user.role) && (
                <Button component={RouterLink} to="/demo/urlaub?tab=team" variant="outlined" endIcon={<Chip size="small" color={pendingVacation.length ? 'warning' : 'default'} label={pendingVacation.length} />}>
                  Urlaubsanträge prüfen
                </Button>
              )}
              {can.approveCorrections(user.role) && (
                <Button component={RouterLink} to="/demo/korrekturen?tab=team" variant="outlined" endIcon={<Chip size="small" color={pendingCorrections.length ? 'warning' : 'default'} label={pendingCorrections.length} />}>
                  Zeitkorrekturen prüfen
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: can.viewAllTimes(user.role) ? '1fr 1fr' : '1fr' }, gap: 2, mt: 2 }}>
        {can.viewAllTimes(user.role) && (
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2">Heute im Team</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {present.length} anwesend · {absent.length} abwesend
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 2, display: 'grid', gap: 1.25 }}>
                {[...present, ...absent].map(({ e, p }) => (
                  <Box component="li" key={e.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <EmployeeAvatar employee={e} size={30} />
                    <Typography sx={{ flex: 1 }}>{fullName(e)}</Typography>
                    {p.kind === 'anwesend' ? (
                      <Chip size="small" color="success" label={`seit ${p.since}`} />
                    ) : p.kind === 'abwesend' ? (
                      <Chip size="small" variant="outlined" label={ABSENCE_LABELS[p.type]} />
                    ) : null}
                  </Box>
                ))}
                {present.length + absent.length === 0 && <Typography sx={{ color: 'text.secondary' }}>Noch niemand eingestempelt.</Typography>}
              </Box>
            </CardContent>
          </Card>
        )}
        {user.role === 'chef' || user.role === 'admin' ? (
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2">Statistik</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, mt: 1.5, textAlign: 'center' }}>
                {[
                  { label: 'Krankheitstage (Monat)', value: sickDays },
                  { label: 'Urlaubstage (Monat)', value: vacationDays },
                  { label: 'Offene Anträge', value: pendingVacation.length + pendingCorrections.length },
                ].map((s) => (
                  <Box key={s.label} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'var(--mbz-tint)' }}>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 750 }}>{s.value}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{s.label}</Typography>
                  </Box>
                ))}
              </Box>
              <Typography variant="subtitle2" component="h3" sx={{ mt: 2.5, mb: 1 }}>Überstundenkonten</Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gap: 0.75 }}>
                {overtime.slice(0, 6).map(({ e, m }) => (
                  <Box component="li" key={e.id} sx={{ display: 'grid', gridTemplateColumns: '120px 1fr 72px', alignItems: 'center', gap: 1, fontSize: 14 }}>
                    <span>{e.firstName} {e.lastName[0]}.</span>
                    <Box sx={{ height: 8, borderRadius: 4, bgcolor: 'var(--mbz-tint)', overflow: 'hidden' }}>
                      <Box sx={{ height: '100%', width: `${(Math.abs(m) / maxOvertime) * 100}%`, bgcolor: m >= 0 ? 'primary.main' : 'error.main' }} />
                    </Box>
                    <Box component="span" sx={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{formatDuration(m, true)}</Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        ) : null}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" component="h2">Neuigkeiten</Typography>
              <Button component={RouterLink} to="/demo/neuigkeiten" size="small">Alle anzeigen</Button>
            </Box>
            {latestNews.map((n, i) => (
              <Box key={n.id}>
                {i > 0 && <Divider sx={{ my: 1.5 }} />}
                <Typography variant="subtitle1" component="h3" sx={{ mt: i === 0 ? 1 : 0 }}>{n.title}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>{formatDate(n.date)}</Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>{n.body}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
