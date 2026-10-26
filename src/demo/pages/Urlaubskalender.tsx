import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useDemoUser } from '../store/DemoStore';
import { employees, fullName } from '../data/employees';
import type { Absence } from '../data/types';
import { addMonths, daysInMonth, formatDate, startOfMonth, weekday, WEEKDAY_LABELS } from '../lib/date';
import { holidayName } from '../lib/holidays';
import { isWorkday } from '../lib/time';
import { can } from '../lib/permissions';
import PageHeader from '../components/PageHeader';
import MonthNav from '../components/MonthNav';
import { visuallyHidden } from '../../components/visuallyHidden';

type CellKind = 'urlaub' | 'beantragt' | 'krank' | 'freistellung' | 'abwesend' | 'feiertag' | 'wochenende' | 'frei' | null;

const STYLE: Record<Exclude<CellKind, null>, { bg: string; label: string; pattern?: boolean }> = {
  urlaub: { bg: '#43A047', label: 'Urlaub' },
  beantragt: { bg: '#43A047', label: 'Urlaub beantragt', pattern: true },
  krank: { bg: '#E57373', label: 'Krank' },
  freistellung: { bg: '#4FA3D9', label: 'Freistellung' },
  abwesend: { bg: '#8C9A97', label: 'Abwesend' },
  feiertag: { bg: '#E3C567', label: 'Feiertag' },
  wochenende: { bg: 'transparent', label: 'Wochenende' },
  frei: { bg: 'var(--mui-palette-action-selected)', label: 'Kein Arbeitstag', pattern: true },
};

function cellBackground(kind: CellKind) {
  if (!kind) return 'transparent';
  const s = STYLE[kind];
  return s.pattern ? `repeating-linear-gradient(135deg, ${s.bg} 0 4px, transparent 4px 8px)` : s.bg;
}

export default function Urlaubskalender() {
  const { user, state, clock } = useDemoUser();
  const [month, setMonth] = useState(startOfMonth(clock.today));
  const days = daysInMonth(month);
  const showReasons = can.seeAbsenceReasons(user.role);
  const relevant = state.data.absences.filter((a) => a.status === 'genehmigt' || a.status === 'beantragt');

  const cellKind = (employeeId: string, date: string): { kind: CellKind; absence?: Absence } => {
    const absence = relevant.find((a) => a.employeeId === employeeId && a.from <= date && date <= a.to && (a.status === 'genehmigt' || a.type === 'urlaub'));
    const wd = weekday(date);
    if (wd > 5) return { kind: 'wochenende' };
    if (holidayName(date)) return { kind: 'feiertag' };
    if (absence && isWorkday(employeeId, date)) {
      if (absence.status === 'beantragt') return { kind: 'beantragt', absence };
      if (absence.type === 'urlaub') return { kind: 'urlaub', absence };
      return { kind: showReasons ? absence.type : 'abwesend', absence };
    }
    if (!isWorkday(employeeId, date)) return { kind: 'frei' };
    return { kind: null };
  };

  const legend: Exclude<CellKind, null>[] = showReasons
    ? ['urlaub', 'beantragt', 'krank', 'freistellung', 'feiertag', 'frei']
    : ['urlaub', 'beantragt', 'abwesend', 'feiertag', 'frei'];

  return (
    <>
      <PageHeader
        title="Urlaubskalender"
        subtitle={showReasons ? 'Abwesenheiten des ganzen Teams' : 'Wer ist wann da? (Krankheitsgründe werden nicht angezeigt)'}
        actions={<MonthNav month={month} onChange={setMonth} min={addMonths(clock.today, -3)} max={addMonths(clock.today, 4)} />}
      />
      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }} aria-label="Legende">
        {legend.map((k) => (
          <Box component="li" key={k} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: 14 }}>
            <Box sx={{ width: 16, height: 16, borderRadius: 0.75, background: cellBackground(k), border: 1, borderColor: 'divider' }} />
            {STYLE[k].label}
          </Box>
        ))}
      </Box>
      <Card>
        <Box sx={{ overflowX: 'auto' }}>
          <Box component="table" sx={{ borderCollapse: 'separate', borderSpacing: 0, width: '100%', fontSize: 13 }}>
            <caption style={visuallyHidden}>Urlaubskalender Team</caption>
            <thead>
              <tr>
                <Box component="th" scope="col" sx={{ position: 'sticky', left: 0, zIndex: 2, bgcolor: 'background.paper', textAlign: 'left', p: 1, minWidth: 150, borderBottom: 1, borderColor: 'divider' }}>
                  Mitarbeiter
                </Box>
                {days.map((d) => (
                  <Box
                    component="th"
                    scope="col"
                    key={d}
                    sx={{ p: 0.5, minWidth: 30, fontWeight: 600, borderBottom: 1, borderColor: 'divider', color: weekday(d) > 5 ? 'text.secondary' : 'text.primary', bgcolor: d === clock.today ? 'var(--mbt-tint)' : weekday(d) > 5 ? 'action.hover' : undefined }}
                  >
                    <Box sx={{ fontSize: 11, color: 'text.secondary' }}>{WEEKDAY_LABELS[weekday(d) - 1]}</Box>
                    {Number(d.slice(8))}
                  </Box>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id}>
                  <Box component="th" scope="row" sx={{ position: 'sticky', left: 0, zIndex: 1, bgcolor: 'background.paper', textAlign: 'left', p: 1, fontWeight: e.id === user.id ? 700 : 500, whiteSpace: 'nowrap', borderBottom: 1, borderColor: 'divider' }}>
                    {fullName(e)}
                  </Box>
                  {days.map((d) => {
                    const { kind, absence } = cellKind(e.id, d);
                    const label = kind ? `${STYLE[kind].label}${absence?.note && showReasons ? ` (${absence.note})` : ''}${kind === 'feiertag' ? `: ${holidayName(d)}` : ''}` : 'anwesend';
                    return (
                      <Box component="td" key={d} title={`${fullName(e)}, ${formatDate(d)}: ${label}`} sx={{ p: '3px', borderBottom: 1, borderColor: 'divider', bgcolor: d === clock.today ? 'var(--mbt-tint)' : weekday(d) > 5 ? 'action.hover' : undefined }}>
                        <Box sx={{ height: 22, borderRadius: 0.75, background: cellBackground(kind) }} />
                        {kind && kind !== 'wochenende' && kind !== 'frei' && (
                          <Box component="span" sx={visuallyHidden}>{label}</Box>
                        )}
                      </Box>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Box>
        </Box>
      </Card>
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.5 }}>Feiertage: Nordrhein-Westfalen (Demo).</Typography>
    </>
  );
}
