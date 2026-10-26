import { useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { useDemoUser } from '../store/DemoStore';
import { employees, fullName } from '../data/employees';
import type { Absence } from '../data/types';
import { formatDate } from '../lib/date';
import { absenceDays, vacationStats } from '../lib/time';
import { can } from '../lib/permissions';
import PageHeader from '../components/PageHeader';
import CountTab from '../components/CountTab';
import StatCard from '../components/StatCard';
import EmployeeAvatar from '../components/EmployeeAvatar';
import AbsenceDialog from '../components/AbsenceDialog';
import { RequestStatusChip } from '../components/StatusChip';
import { ABSENCE_LABELS } from '../data/types';
import { useNotify } from '../components/Feedback';

function AbsenceItem({ a, showEmployee, actions }: { a: Absence; showEmployee?: boolean; actions?: ReactNode }) {
  const emp = employees.find((e) => e.id === a.employeeId)!;
  const decider = employees.find((e) => e.id === a.decidedBy);
  return (
    <Box component="li" sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, py: 2, borderTop: 1, borderColor: 'divider', '&:first-of-type': { borderTop: 0 } }}>
      {showEmployee && <EmployeeAvatar employee={emp} />}
      <Box sx={{ flex: 1, minWidth: 200 }}>
        <Typography sx={{ fontWeight: 600 }}>
          {showEmployee ? `${fullName(emp)} · ` : ''}
          {ABSENCE_LABELS[a.type]}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {formatDate(a.from)}{a.to !== a.from && ` – ${formatDate(a.to)}`} · {absenceDays(a)} Arbeitstag{absenceDays(a) === 1 ? '' : 'e'}
          {a.note && ` · „${a.note}“`}
        </Typography>
        {decider && a.status !== 'beantragt' && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Bearbeitet von {fullName(decider)}</Typography>
        )}
      </Box>
      <RequestStatusChip status={a.status} />
      {actions && <Box sx={{ display: 'flex', gap: 1 }}>{actions}</Box>}
    </Box>
  );
}

export default function Urlaub() {
  const { user, state, dispatch, clock } = useDemoUser();
  const notify = useNotify();
  const [params, setParams] = useSearchParams();
  const approver = can.approveVacation(user.role);
  const tab = approver && params.get('tab') === 'team' ? 'team' : 'meine';
  const [dialog, setDialog] = useState<'antrag' | 'eintrag' | null>(null);
  const { data } = state;
  const stats = vacationStats(data, user, Number(clock.today.slice(0, 4)));

  const own = data.absences.filter((a) => a.employeeId === user.id).sort((a, b) => b.from.localeCompare(a.from));
  const pending = data.absences.filter((a) => a.status === 'beantragt').sort((a, b) => a.from.localeCompare(b.from));
  const decided = data.absences
    .filter((a) => a.status !== 'beantragt' && a.employeeId !== user.id && (can.seeAbsenceReasons(user.role) || a.type === 'urlaub'))
    .sort((a, b) => b.from.localeCompare(a.from))
    .slice(0, 12);

  const decide = (a: Absence, status: 'genehmigt' | 'abgelehnt') => {
    dispatch({ type: 'setAbsenceStatus', id: a.id, status, decidedBy: user.id });
    const emp = employees.find((e) => e.id === a.employeeId)!;
    notify(`Antrag von ${emp.firstName} ${status === 'genehmigt' ? 'genehmigt' : 'abgelehnt'}.`, status === 'genehmigt' ? 'success' : 'info');
  };

  return (
    <>
      <PageHeader
        title="Urlaub & Abwesenheit"
        subtitle="Anträge stellen, zurückziehen und genehmigen"
        actions={
          <>
            {can.recordAbsences(user.role) && (
              <Button variant="outlined" onClick={() => setDialog('eintrag')}>Krankmeldung / Freistellung eintragen</Button>
            )}
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialog('antrag')}>Urlaub beantragen</Button>
          </>
        }
      />

      {approver && (
        <Tabs value={tab} onChange={(_, v) => setParams(v === 'team' ? { tab: 'team' } : {}, { replace: true })} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Tab value="meine" label="Meine Anträge" />
          <CountTab value="team" label="Anträge des Teams" count={pending.length} />
        </Tabs>
      )}

      {tab === 'meine' ? (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
            <StatCard label="Anspruch" value={`${stats.entitlement} Tage`} hint="individuell pro Jahr" />
            <StatCard label="Genommen / geplant" value={`${stats.approved} Tage`} />
            <StatCard label="Beantragt" value={`${stats.pending} Tage`} />
            <StatCard label="Resturlaub" value={`${stats.remaining} Tage`} tone={stats.remaining >= 0 ? 'positive' : 'negative'} />
          </Box>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2">Meine Anträge und Abwesenheiten</Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 1 }}>
                {own.map((a) => (
                  <AbsenceItem
                    key={a.id}
                    a={a}
                    actions={
                      a.status === 'beantragt' ? (
                        <Button
                          size="small"
                          color="inherit"
                          variant="outlined"
                          onClick={() => {
                            dispatch({ type: 'setAbsenceStatus', id: a.id, status: 'zurueckgezogen' });
                            notify('Antrag zurückgezogen.', 'info');
                          }}
                        >
                          Zurückziehen
                        </Button>
                      ) : undefined
                    }
                  />
                ))}
                {own.length === 0 && <Typography sx={{ color: 'text.secondary', py: 2 }}>Noch keine Anträge.</Typography>}
              </Box>
            </CardContent>
          </Card>
        </>
      ) : (
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2">Offene Anträge ({pending.length})</Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 1 }}>
                {pending.map((a) => (
                  <AbsenceItem
                    key={a.id}
                    a={a}
                    showEmployee
                    actions={
                      <>
                        <Button size="small" variant="contained" color="success" onClick={() => decide(a, 'genehmigt')}>Genehmigen</Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => decide(a, 'abgelehnt')}>Ablehnen</Button>
                      </>
                    }
                  />
                ))}
                {pending.length === 0 && <Typography sx={{ color: 'text.secondary', py: 2 }}>Keine offenen Anträge – alles erledigt.</Typography>}
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2">Zuletzt bearbeitet</Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 1 }}>
                {decided.map((a) => <AbsenceItem key={a.id} a={a} showEmployee />)}
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      <AbsenceDialog open={dialog !== null} mode={dialog ?? 'antrag'} onClose={() => setDialog(null)} />
    </>
  );
}
