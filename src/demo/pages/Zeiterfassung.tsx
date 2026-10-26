import { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditCalendarOutlined from '@mui/icons-material/EditCalendarOutlined';
import { useDemoUser } from '../store/DemoStore';
import { employees, fullName } from '../data/employees';
import { formatDuration, formatShort, formatWeekdayShort, isoWeek, startOfMonth } from '../lib/date';
import { monthSummary, overtimeBalance, summarize, type DayInfo } from '../lib/time';
import { can } from '../lib/permissions';
import PageHeader from '../components/PageHeader';
import MonthNav from '../components/MonthNav';
import StampCard from '../components/StampCard';
import StatCard from '../components/StatCard';
import CorrectionDialog from '../components/CorrectionDialog';
import { DayStatusChip } from '../components/StatusChip';

const COLS = { xs: '1fr auto', md: '120px 130px 1fr 70px 80px 80px 90px 44px' };

function DiffText({ min }: { min: number }) {
  if (min === 0) return <Box component="span" sx={{ color: 'text.secondary' }}>±0:00 h</Box>;
  return <Box component="span" sx={{ color: min > 0 ? 'success.main' : 'error.main', fontWeight: 600 }}>{formatDuration(min, true)}</Box>;
}

function DayRow({ day, canCorrect, onCorrect }: { day: DayInfo; canCorrect: boolean; onCorrect: (date: string) => void }) {
  const times = day.entries.length ? day.entries.map((e) => `${e.start} – ${e.end ?? '…'}`).join(', ') : '–';
  const isAbsence = day.status === 'urlaub' || day.status === 'krank' || day.status === 'freistellung';
  const muted = day.status === 'frei' || day.status === 'feiertag' || day.status === 'zukunft' || day.status === 'ausserhalb';
  const correctable = canCorrect && ['arbeit', 'unvollstaendig', 'fehlt', 'laeuft'].includes(day.status);
  return (
    <Box
      role="row"
      sx={{ display: 'grid', gridTemplateColumns: COLS, gap: { xs: 0.5, md: 1 }, alignItems: 'center', px: { xs: 1.5, md: 2 }, py: 1.25, borderTop: 1, borderColor: 'divider', opacity: muted ? 0.65 : 1, fontVariantNumeric: 'tabular-nums' }}
    >
      <Box role="cell" sx={{ fontWeight: 600 }}>
        {formatWeekdayShort(day.date)}, {formatShort(day.date)}
      </Box>
      <Box role="cell" sx={{ justifySelf: { xs: 'end', md: 'start' } }}>
        <DayStatusChip status={day.status} label={day.holiday && day.status === 'feiertag' ? day.holiday : undefined} />
      </Box>
      <Box role="cell" sx={{ color: 'text.secondary', gridColumn: { xs: '1 / -1', md: 'auto' } }}>
        <Box component="span" sx={{ display: { md: 'none' } }}>Zeiten: </Box>
        {isAbsence ? 'ganztägig' : times}
      </Box>
      <Box role="cell" sx={{ display: { xs: 'none', md: 'block' } }}>{day.pause ? `${day.pause} min` : '–'}</Box>
      <Box role="cell" sx={{ display: { xs: 'none', md: 'block' } }}>{day.ist || day.entries.length ? formatDuration(day.ist) : '–'}</Box>
      <Box role="cell" sx={{ display: { xs: 'none', md: 'block' }, color: 'text.secondary' }}>{day.soll ? formatDuration(day.soll) : '–'}</Box>
      <Box role="cell" sx={{ gridColumn: { xs: '1 / -1', md: 'auto' }, display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
        <Box component="span" sx={{ display: { md: 'none' }, color: 'text.secondary', fontSize: 14 }}>
          Ist {formatDuration(day.ist)} / Soll {formatDuration(day.soll)}
          {day.pause ? ` · Pause ${day.pause} min` : ''}
        </Box>
        <DiffText min={day.diff} />
      </Box>
      <Box role="cell" sx={{ display: { xs: 'none', md: 'block' } }}>
        {correctable && (
          <Tooltip title="Korrektur beantragen">
            <IconButton size="small" onClick={() => onCorrect(day.date)} aria-label={`Korrektur für ${formatShort(day.date)} beantragen`}>
              <EditCalendarOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}

export default function Zeiterfassung() {
  const { user, state, clock } = useDemoUser();
  const { data } = state;
  const [month, setMonth] = useState(startOfMonth(clock.today));
  const [employeeId, setEmployeeId] = useState(user.id);
  const [correctionDate, setCorrectionDate] = useState<string | null>(null);
  const employee = employees.find((e) => e.id === employeeId) ?? user;
  const own = employee.id === user.id;

  const summary = monthSummary(data, employee.id, month, clock);
  const balance = overtimeBalance(data, employee, clock);
  const weeks = new Map<number, DayInfo[]>();
  for (const d of summary.days) {
    const kw = isoWeek(d.date);
    weeks.set(kw, [...(weeks.get(kw) ?? []), d]);
  }
  const currentWeek = isoWeek(clock.today);
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set([currentWeek]));
  const toggle = (kw: number) => setExpanded((s) => { const n = new Set(s); if (n.has(kw)) n.delete(kw); else n.add(kw); return n; });
  const progress = summary.sollBisHeute ? Math.min(100, (summary.ist / summary.sollBisHeute) * 100) : 0;

  return (
    <>
      <PageHeader
        title="Zeiterfassung"
        subtitle={own ? 'Ihre Arbeitszeiten im Überblick' : `Arbeitszeiten von ${fullName(employee)}`}
        actions={
          <>
            {can.viewAllTimes(user.role) && (
              <TextField select label="Mitarbeiter" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} sx={{ minWidth: 220 }}>
                {employees.map((e) => (
                  <MenuItem key={e.id} value={e.id}>{fullName(e)}</MenuItem>
                ))}
              </TextField>
            )}
            <MonthNav month={month} onChange={setMonth} min={data.rangeStart} max={clock.today} />
          </>
        }
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: own ? '1.3fr 1fr 1fr 1fr' : 'repeat(3, 1fr)' }, gap: 2, mb: 3 }}>
        {own && (
          <Box sx={{ gridColumn: { sm: 'span 2', lg: 'auto' } }}>
            <StampCard employeeId={user.id} />
          </Box>
        )}
        <StatCard label="Ist / Soll (Monat)" value={formatDuration(summary.ist)} hint={`Soll gesamt ${formatDuration(summary.soll)}`} />
        <StatCard label="Saldo (Monat)" value={formatDuration(summary.diff, true)} hint={`gegenüber Soll bis heute ${formatDuration(summary.sollBisHeute)}`} tone={summary.diff >= 0 ? 'positive' : 'negative'} />
        <StatCard label="Überstundenkonto" value={formatDuration(balance, true)} hint={`Übertrag ${formatDuration(employee.overtimeCarryMinutes, true)}`} tone={balance >= 0 ? 'positive' : 'negative'} />
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} id="fortschritt">Fortschritt Monat (Ist zu Soll bis heute)</Typography>
            <Typography variant="body2">{Math.round(progress)} %</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} aria-labelledby="fortschritt" />
        </CardContent>
      </Card>

      <Box>
        {[...weeks.entries()].map(([kw, days]) => {
          const ws = summarize(days, clock);
          const isOpen = expanded.has(kw);
          return (
            <Accordion key={kw} expanded={isOpen} onChange={() => toggle(kw)} disableGutters elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: '12px !important', mb: 1.5, overflow: 'hidden', '&::before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`kw-${kw}`} id={`kw-${kw}-kopf`}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: { xs: 1, sm: 3 }, width: '100%', pr: 1 }}>
                  <Typography sx={{ fontWeight: 700, minWidth: 64 }}>KW {kw}</Typography>
                  <Typography sx={{ color: 'text.secondary', minWidth: 120 }}>
                    {formatShort(days[0].date)} – {formatShort(days[days.length - 1].date)}
                  </Typography>
                  <Box sx={{ flex: 1 }} />
                  <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                    {formatDuration(ws.ist)} / {formatDuration(ws.soll)}
                  </Typography>
                  <Box sx={{ minWidth: 84, textAlign: 'right' }}><DiffText min={ws.diff} /></Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails id={`kw-${kw}`} sx={{ p: 0 }}>
                <Box role="table" aria-label={`Tage der Kalenderwoche ${kw}`}>
                  <Box role="row" sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: COLS.md, gap: 1, px: 2, py: 1, bgcolor: 'var(--mbt-tint)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'text.secondary' }}>
                    {['Tag', 'Status', 'Kommen – Gehen', 'Pause', 'Ist', 'Soll', 'Saldo', ''].map((h, i) => (
                      <Box role="columnheader" key={i}>{h || <span aria-label="Aktion" />}</Box>
                    ))}
                  </Box>
                  {days.map((d) => (
                    <DayRow key={d.date} day={d} canCorrect={own} onCorrect={setCorrectionDate} />
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
      <CorrectionDialog open={correctionDate !== null} onClose={() => setCorrectionDate(null)} employeeId={user.id} defaultDate={correctionDate ?? undefined} />
    </>
  );
}
