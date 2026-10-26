import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ViewTimelineOutlined from '@mui/icons-material/ViewTimelineOutlined';
import ViewListOutlined from '@mui/icons-material/ViewListOutlined';
import { useDemoUser } from '../store/DemoStore';
import { employees, fullName } from '../data/employees';
import type { Absence, Employee } from '../data/types';
import { addMonths, daysInMonth, formatDate, formatMonth, formatWeekdayShort, startOfMonth, weekday, WEEKDAY_LABELS, type ISODate } from '../lib/date';
import { holidayName } from '../lib/holidays';
import { countWorkdays, isWorkday } from '../lib/time';
import { can } from '../lib/permissions';
import { ABSENCE_STYLE, HOLIDAY_BG, HOLIDAY_COLOR, absenceBackground, type AbsenceKind } from '../lib/absenceStyle';
import PageHeader from '../components/PageHeader';
import MonthNav from '../components/MonthNav';
import EmployeeAvatar from '../components/EmployeeAvatar';
import StatCard from '../components/StatCard';

interface Item {
  absence: Absence;
  employee: Employee;
  kind: AbsenceKind;
  /** im Monat sichtbarer Ausschnitt */
  start: ISODate;
  end: ISODate;
  workdays: number;
}

const NAME_COL = 240;

function range(a: Absence) {
  const from = `${formatWeekdayShort(a.from)}, ${formatDate(a.from)}`;
  return a.to === a.from ? from : `${from} – ${formatWeekdayShort(a.to)}, ${formatDate(a.to)}`;
}

function ItemTooltip({ item, showReasons }: { item: Item; showReasons: boolean }) {
  const { absence: a } = item;
  const decider = employees.find((e) => e.id === a.decidedBy);
  return (
    <Box sx={{ p: 0.5 }}>
      <Box sx={{ fontWeight: 700 }}>{fullName(item.employee)}</Box>
      <Box>{ABSENCE_STYLE[item.kind].label}</Box>
      <Box>{range(a)}</Box>
      <Box>{countWorkdays(a.employeeId, a.from, a.to)} Arbeitstage</Box>
      {showReasons && a.note && <Box>„{a.note}“</Box>}
      {decider && a.status === 'genehmigt' && <Box sx={{ opacity: 0.8 }}>Genehmigt von {fullName(decider)}</Box>}
    </Box>
  );
}

function KindChip({ kind }: { kind: AbsenceKind }) {
  const s = ABSENCE_STYLE[kind];
  return (
    <Box
      component="span"
      sx={{ display: 'inline-flex', alignItems: 'center', px: 1, py: 0.25, borderRadius: 1.5, fontSize: 12, fontWeight: 700, background: absenceBackground(kind), color: s.fg, border: s.border ? `1px dashed ${s.border}` : 0, whiteSpace: 'nowrap' }}
    >
      {s.label}
    </Box>
  );
}

export default function Urlaubskalender() {
  const { user, state, clock } = useDemoUser();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('md'));
  const [month, setMonth] = useState(startOfMonth(clock.today));
  const [view, setView] = useState<'zeitleiste' | 'liste' | null>(null);
  const activeView = view ?? (desktop ? 'zeitleiste' : 'liste');
  const showReasons = can.seeAbsenceReasons(user.role);

  const days = daysInMonth(month);
  const monthStart = days[0];
  const monthEnd = days[days.length - 1];

  const items: Item[] = state.data.absences
    .filter((a) => (a.status === 'genehmigt' || a.status === 'beantragt') && a.from <= monthEnd && a.to >= monthStart)
    .map((a) => {
      const employee = employees.find((e) => e.id === a.employeeId)!;
      const kind: AbsenceKind = a.status === 'beantragt' ? 'beantragt' : a.type === 'urlaub' ? 'urlaub' : showReasons ? a.type : 'abwesend';
      const start = a.from < monthStart ? monthStart : a.from;
      const end = a.to > monthEnd ? monthEnd : a.to;
      return { absence: a, employee, kind, start, end, workdays: countWorkdays(a.employeeId, start, end) };
    })
    .sort((x, y) => x.start.localeCompare(y.start));

  const sum = (kind: AbsenceKind) => items.filter((i) => i.kind === kind).reduce((s, i) => s + i.workdays, 0);
  // Unabhängig vom angezeigten Monat: wer ist heute (genehmigt) abwesend?
  const awayToday = new Set(
    state.data.absences.filter((a) => a.status === 'genehmigt' && a.from <= clock.today && clock.today <= a.to).map((a) => a.employeeId),
  );
  const legend: AbsenceKind[] = showReasons ? ['urlaub', 'beantragt', 'krank', 'freistellung'] : ['urlaub', 'beantragt', 'abwesend'];

  return (
    <>
      <PageHeader
        title="Urlaubskalender"
        subtitle={showReasons ? 'Abwesenheiten des ganzen Teams' : 'Wer ist wann da? (Gründe für Abwesenheiten werden nicht angezeigt)'}
        actions={
          <>
            <ToggleButtonGroup value={activeView} exclusive size="small" onChange={(_, v) => v && setView(v)} aria-label="Ansicht">
              <ToggleButton value="zeitleiste" aria-label="Zeitleiste">
                <ViewTimelineOutlined fontSize="small" sx={{ mr: { sm: 0.75 } }} />
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Zeitleiste</Box>
              </ToggleButton>
              <ToggleButton value="liste" aria-label="Liste">
                <ViewListOutlined fontSize="small" sx={{ mr: { sm: 0.75 } }} />
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Liste</Box>
              </ToggleButton>
            </ToggleButtonGroup>
            {month !== startOfMonth(clock.today) && (
              <Button variant="outlined" size="small" onClick={() => setMonth(startOfMonth(clock.today))}>Heute</Button>
            )}
            <MonthNav month={month} onChange={setMonth} min={addMonths(clock.today, -3)} max={addMonths(clock.today, 6)} />
          </>
        }
      />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <StatCard label="Urlaubstage" value={sum('urlaub')} hint={`genehmigt im ${formatMonth(month)}`} />
        <StatCard label="Beantragt" value={sum('beantragt')} hint="Tage, noch offen" />
        {showReasons ? (
          <StatCard label="Krankheitstage" value={sum('krank')} hint="im Monat" />
        ) : (
          <StatCard label="Abwesenheitstage" value={sum('abwesend')} hint="sonstige, im Monat" />
        )}
        <StatCard label="Heute abwesend" value={awayToday.size} hint={`von ${employees.length} Mitarbeitern`} />
      </Box>

      <Box component="ul" aria-label="Legende" sx={{ listStyle: 'none', p: 0, m: 0, mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1.25, alignItems: 'center' }}>
        {legend.map((k) => (
          <li key={k}><KindChip kind={k} /></li>
        ))}
        <Box component="li" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: 13, color: 'text.secondary', ml: 1 }}>
          <Box sx={{ width: 14, height: 14, borderRadius: 0.75, bgcolor: HOLIDAY_BG, border: `1px solid ${HOLIDAY_COLOR}` }} /> Feiertag
        </Box>
        <Box component="li" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: 13, color: 'text.secondary' }}>
          <Box sx={{ width: 14, height: 14, borderRadius: 0.75, background: 'repeating-linear-gradient(135deg, var(--mui-palette-action-selected) 0 2px, transparent 2px 5px)', border: 1, borderColor: 'divider' }} /> Kein Arbeitstag
        </Box>
      </Box>

      {activeView === 'zeitleiste' ? (
        <Timeline days={days} items={items} today={clock.today} userId={user.id} showReasons={showReasons} />
      ) : (
        <AbsenceList items={items} today={clock.today} showReasons={showReasons} month={month} />
      )}
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.5 }}>Feiertage: Nordrhein-Westfalen (Demo).</Typography>
    </>
  );
}

function Timeline({ days, items, today, userId, showReasons }: { days: ISODate[]; items: Item[]; today: ISODate; userId: string; showReasons: boolean }) {
  const cols = `${NAME_COL}px repeat(${days.length}, minmax(32px, 1fr))`;
  const minWidth = NAME_COL + days.length * 32;
  const dayBg = (d: ISODate) => {
    if (d === today) return 'var(--mbt-tint)';
    if (holidayName(d)) return HOLIDAY_BG;
    if (weekday(d) > 5) return 'action.hover';
    return undefined;
  };

  return (
    <Card sx={{ overflow: 'hidden' }}>
      <Box sx={{ overflowX: 'auto' }}>
        <Box role="table" aria-label="Abwesenheiten im Monat" sx={{ minWidth }}>
          {/* Kopfzeile */}
          <Box role="row" sx={{ display: 'grid', gridTemplateColumns: cols, borderBottom: 1, borderColor: 'divider', position: 'sticky', top: 0, zIndex: 3, bgcolor: 'background.paper' }}>
            <Box role="columnheader" sx={{ position: 'sticky', left: 0, zIndex: 2, bgcolor: 'background.paper', px: 2, py: 1.25, fontWeight: 700, fontSize: 14, borderRight: 1, borderColor: 'divider' }}>
              Team ({employees.length})
            </Box>
            {days.map((d) => {
              const holiday = holidayName(d);
              const isToday = d === today;
              const head = (
                <Box role="columnheader" aria-label={`${formatWeekdayShort(d)}, ${formatDate(d)}${holiday ? `, ${holiday}` : ''}`} sx={{ textAlign: 'center', py: 0.75, bgcolor: dayBg(d), color: weekday(d) > 5 ? 'text.secondary' : 'text.primary' }}>
                  <Box sx={{ fontSize: 11, color: 'text.secondary' }}>{WEEKDAY_LABELS[weekday(d) - 1]}</Box>
                  <Box sx={{ mx: 'auto', mt: 0.25, width: 24, height: 24, display: 'grid', placeItems: 'center', borderRadius: '50%', fontSize: 13, fontWeight: isToday ? 700 : 600, bgcolor: isToday ? 'primary.main' : 'transparent', color: isToday ? 'primary.contrastText' : 'inherit' }}>
                    {Number(d.slice(8))}
                  </Box>
                  {holiday && <Box sx={{ mx: 'auto', mt: 0.25, width: 5, height: 5, borderRadius: '50%', bgcolor: HOLIDAY_COLOR }} />}
                </Box>
              );
              return holiday ? <Tooltip key={d} title={holiday}>{head}</Tooltip> : <Box key={d} sx={{ display: 'contents' }}>{head}</Box>;
            })}
          </Box>

          {/* Zeilen je Mitarbeiter */}
          {employees.map((e) => {
            const own = items.filter((i) => i.employee.id === e.id);
            return (
              <Box role="row" key={e.id} sx={{ display: 'grid', gridTemplateColumns: cols, gridTemplateRows: '52px', borderBottom: 1, borderColor: 'divider', '&:last-of-type': { borderBottom: 0 }, '&:hover .mbt-name': { bgcolor: 'action.hover' } }}>
                <Box role="rowheader" className="mbt-name" sx={{ gridColumn: 1, gridRow: 1, position: 'sticky', left: 0, zIndex: 2, bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 1.25, px: 2, borderRight: 1, borderColor: 'divider', minWidth: 0 }}>
                  <EmployeeAvatar employee={e} size={28} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography component="div" sx={{ fontSize: 14, fontWeight: e.id === userId ? 700 : 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {fullName(e)}
                      {e.id === userId && <Chip label="Sie" size="small" sx={{ ml: 0.75, height: 18, fontSize: 10 }} />}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.position}</Typography>
                  </Box>
                </Box>
                {days.map((d, i) => (
                  <Box
                    key={d}
                    aria-hidden="true"
                    sx={{
                      gridColumn: i + 2,
                      gridRow: 1,
                      bgcolor: dayBg(d),
                      borderLeft: 1,
                      borderColor: 'divider',
                      ...(weekday(d) <= 5 && !holidayName(d) && !isWorkday(e.id, d) && {
                        background: 'repeating-linear-gradient(135deg, var(--mui-palette-action-selected) 0 2px, transparent 2px 6px)',
                      }),
                    }}
                  />
                ))}
                {own.map((item) => {
                  const startIdx = days.indexOf(item.start);
                  const endIdx = days.indexOf(item.end);
                  const span = endIdx - startIdx + 1;
                  const s = ABSENCE_STYLE[item.kind];
                  const continuesBefore = item.absence.from < item.start;
                  const continuesAfter = item.absence.to > item.end;
                  return (
                    <Tooltip key={item.absence.id} title={<ItemTooltip item={item} showReasons={showReasons} />} placement="top" arrow>
                      <Box
                        role="cell"
                        tabIndex={0}
                        aria-label={`${fullName(e)}: ${s.label}, ${range(item.absence)}`}
                        sx={{
                          gridColumn: `${startIdx + 2} / ${endIdx + 3}`,
                          gridRow: 1,
                          alignSelf: 'center',
                          zIndex: 1,
                          mx: '3px',
                          height: 30,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          px: 1,
                          overflow: 'hidden',
                          background: absenceBackground(item.kind),
                          color: s.fg,
                          border: s.border ? `1.5px dashed ${s.border}` : 0,
                          borderRadius: '8px',
                          ...(continuesBefore && { borderTopLeftRadius: 0, borderBottomLeftRadius: 0, ml: 0 }),
                          ...(continuesAfter && { borderTopRightRadius: 0, borderBottomRightRadius: 0, mr: 0 }),
                          fontSize: 12,
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                          cursor: 'default',
                          boxShadow: '0 1px 2px rgba(16, 36, 66, 0.15)',
                          '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
                        }}
                      >
                        {span >= 2 && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</span>}
                        {span >= 4 && <span style={{ opacity: 0.85, fontWeight: 500 }}>· {item.workdays} T</span>}
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Card>
  );
}

function AbsenceList({ items, today, showReasons, month }: { items: Item[]; today: ISODate; showReasons: boolean; month: ISODate }) {
  if (items.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>Im {formatMonth(month)} sind keine Abwesenheiten eingetragen.</CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
        {items.map((item) => {
          const a = item.absence;
          const running = a.from <= today && today <= a.to;
          return (
            <Box component="li" key={a.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.75, borderBottom: 1, borderColor: 'divider', '&:last-of-type': { borderBottom: 0 } }}>
              <Box sx={{ width: 4, alignSelf: 'stretch', borderRadius: 2, background: absenceBackground(item.kind) }} />
              <EmployeeAvatar employee={item.employee} size={36} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontWeight: 700 }}>{fullName(item.employee)}</Typography>
                  <KindChip kind={item.kind} />
                  {running && item.kind !== 'beantragt' && <Chip size="small" color="primary" label="heute" sx={{ height: 20 }} />}
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {range(a)} · {countWorkdays(a.employeeId, a.from, a.to)} Arbeitstage
                  {showReasons && a.note ? ` · „${a.note}“` : ''}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Card>
  );
}
