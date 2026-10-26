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
import ArrowForward from '@mui/icons-material/ArrowForward';
import { useDemoUser } from '../store/DemoStore';
import { employees, fullName } from '../data/employees';
import type { CorrectionRequest } from '../data/types';
import { formatDate } from '../lib/date';
import { can } from '../lib/permissions';
import PageHeader from '../components/PageHeader';
import CountTab from '../components/CountTab';
import EmployeeAvatar from '../components/EmployeeAvatar';
import CorrectionDialog from '../components/CorrectionDialog';
import { RequestStatusChip } from '../components/StatusChip';
import { useNotify } from '../components/Feedback';

function CorrectionItem({ c, showEmployee, actions }: { c: CorrectionRequest; showEmployee?: boolean; actions?: ReactNode }) {
  const emp = employees.find((e) => e.id === c.employeeId)!;
  const decider = employees.find((e) => e.id === c.decidedBy);
  const original = c.original ? `${c.original.start} – ${c.original.end ?? 'offen'}` : 'keine Buchung';
  return (
    <Box component="li" sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, py: 2, borderTop: 1, borderColor: 'divider', '&:first-of-type': { borderTop: 0 } }}>
      {showEmployee && <EmployeeAvatar employee={emp} />}
      <Box sx={{ flex: 1, minWidth: 220 }}>
        <Typography sx={{ fontWeight: 600 }}>
          {showEmployee ? `${fullName(emp)} · ` : ''}
          {formatDate(c.date)}
        </Typography>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', fontVariantNumeric: 'tabular-nums' }}>
          <Box component="span" sx={{ color: 'text.secondary', textDecoration: 'line-through' }}>{original}</Box>
          <ArrowForward sx={{ fontSize: 16 }} aria-label="geändert zu" />
          <strong>{c.requested.start} – {c.requested.end}</strong>
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>„{c.reason}“</Typography>
        {decider && <Typography variant="caption" sx={{ color: 'text.secondary' }}>Bearbeitet von {fullName(decider)}</Typography>}
      </Box>
      <RequestStatusChip status={c.status} />
      {actions && <Box sx={{ display: 'flex', gap: 1 }}>{actions}</Box>}
    </Box>
  );
}

export default function Korrekturen() {
  const { user, state, dispatch } = useDemoUser();
  const notify = useNotify();
  const [params, setParams] = useSearchParams();
  const approver = can.approveCorrections(user.role);
  const tab = approver && params.get('tab') === 'team' ? 'team' : 'meine';
  const [open, setOpen] = useState(false);
  const { corrections } = state.data;

  const own = corrections.filter((c) => c.employeeId === user.id).sort((a, b) => b.date.localeCompare(a.date));
  const pending = corrections.filter((c) => c.status === 'offen').sort((a, b) => a.date.localeCompare(b.date));
  const decided = corrections.filter((c) => c.status !== 'offen').sort((a, b) => b.date.localeCompare(a.date));

  const decide = (c: CorrectionRequest, approve: boolean) => {
    dispatch({ type: 'decideCorrection', id: c.id, approve, decidedBy: user.id });
    notify(approve ? 'Korrektur genehmigt – Zeiten wurden übernommen.' : 'Korrektur abgelehnt.', approve ? 'success' : 'info');
  };

  return (
    <>
      <PageHeader
        title="Zeitkorrekturen"
        subtitle="Vergessene oder falsche Stempelzeiten korrigieren lassen"
        actions={<Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Korrektur beantragen</Button>}
      />
      {approver && (
        <Tabs value={tab} onChange={(_, v) => setParams(v === 'team' ? { tab: 'team' } : {}, { replace: true })} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Tab value="meine" label="Meine Anträge" />
          <CountTab value="team" label="Zu genehmigen" count={pending.length} />
        </Tabs>
      )}
      {tab === 'meine' ? (
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2">Meine Korrekturanträge</Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 1 }}>
              {own.map((c) => <CorrectionItem key={c.id} c={c} />)}
              {own.length === 0 && <Typography sx={{ color: 'text.secondary', py: 2 }}>Noch keine Korrekturanträge.</Typography>}
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2">Offene Anträge ({pending.length})</Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 1 }}>
                {pending.map((c) => (
                  <CorrectionItem
                    key={c.id}
                    c={c}
                    showEmployee
                    actions={
                      <>
                        <Button size="small" variant="contained" color="success" onClick={() => decide(c, true)}>Genehmigen</Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => decide(c, false)}>Ablehnen</Button>
                      </>
                    }
                  />
                ))}
                {pending.length === 0 && <Typography sx={{ color: 'text.secondary', py: 2 }}>Keine offenen Anträge.</Typography>}
              </Box>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2">Bearbeitet</Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 1 }}>
                {decided.map((c) => <CorrectionItem key={c.id} c={c} showEmployee />)}
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
      <CorrectionDialog open={open} onClose={() => setOpen(false)} employeeId={user.id} />
    </>
  );
}
