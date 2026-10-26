import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import {
  addDays,
  addMonths,
  formatMonth,
  fromISO,
  isoWeek,
  startOfMonth,
  startOfWeek,
  WEEKDAY_LABELS,
  type ISODate,
} from '../../lib/date';

/** Zusatzinfos pro Tag (Feiertag, frei, Markierung …). */
export interface DayMeta {
  holiday?: string;
  /** Kein Arbeitstag (Wochenende / laut Arbeitszeitplan frei) – gedämpft dargestellt. */
  muted?: boolean;
  disabled?: boolean;
  /** Kleiner Punkt unter der Zahl, z. B. bestehender Urlaub oder fehlende Buchung. */
  dot?: { color: string; label: string };
}

export interface DateRange {
  from: ISODate | null;
  to: ISODate | null;
}

interface DateCalendarProps {
  mode: 'range' | 'single';
  value: DateRange;
  onChange: (value: DateRange) => void;
  today: ISODate;
  min?: ISODate;
  max?: ISODate;
  getMeta?: (date: ISODate) => DayMeta;
  /** Anzahl Monate nebeneinander ab sm (auf dem Handy immer 1). */
  months?: 1 | 2;
  label: string;
}

const longDate = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const CELL = 40;

function lastOfMonth(month: ISODate): ISODate {
  return addDays(addMonths(month, 1), -1);
}

function weeksOfMonth(month: ISODate): ISODate[][] {
  const weeks: ISODate[][] = [];
  const last = lastOfMonth(month);
  for (let d = startOfWeek(startOfMonth(month)); d <= last; d = addDays(d, 7)) {
    weeks.push(Array.from({ length: 7 }, (_, i) => addDays(d, i)));
  }
  return weeks;
}

/** Gleicher Tag im Nachbarmonat, begrenzt auf dessen letzten Tag (31.01. → 28.02.). */
function shiftMonth(date: ISODate, months: number): ISODate {
  const target = addMonths(date, months);
  const last = lastOfMonth(target);
  const day = Math.min(Number(date.slice(8)), Number(last.slice(8)));
  return `${target.slice(0, 8)}${String(day).padStart(2, '0')}`;
}

/**
 * Kalender zur Auswahl eines Datums oder Zeitraums – deutsch, Woche ab Montag, mit Kalenderwochen,
 * Feiertagen und Markierungen. Tastatur: Pfeiltasten, Bild↑/↓ (Monat), Pos1/Ende (Woche), Enter/Leertaste.
 */
export default function DateCalendar({ mode, value, onChange, today, min, max, getMeta, months = 1, label }: DateCalendarProps) {
  const theme = useTheme();
  const wide = useMediaQuery(theme.breakpoints.up('sm'));
  const visibleMonths = wide ? months : 1;
  const [month, setMonth] = useState(() => startOfMonth(value.from ?? today));
  const [focused, setFocused] = useState<ISODate>(value.from ?? today);
  const [hover, setHover] = useState<ISODate | null>(null);
  const keyboardNav = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  const lastVisible = addMonths(month, visibleMonths - 1);
  const canPrev = !min || addMonths(month, -1) >= startOfMonth(min);
  const canNext = !max || addMonths(month, 1) <= startOfMonth(max);

  const meta = (d: ISODate): DayMeta => {
    const m = getMeta?.(d) ?? {};
    const outOfBounds = (min && d < min) || (max && d > max);
    return outOfBounds ? { ...m, disabled: true } : m;
  };

  // Nach Tastatur-Navigation den neuen Tag fokussieren (Monat ggf. mitwandern lassen).
  useEffect(() => {
    if (!keyboardNav.current) return;
    keyboardNav.current = false;
    gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${focused}"]`)?.focus();
  }, [focused, month]);

  const moveFocus = (d: ISODate) => {
    if ((min && d < min) || (max && d > max)) return;
    keyboardNav.current = true;
    setFocused(d);
    if (d < month) setMonth(startOfMonth(d));
    else if (d.slice(0, 7) > lastVisible.slice(0, 7)) setMonth(addMonths(startOfMonth(d), -(visibleMonths - 1)));
  };

  const select = (d: ISODate) => {
    if (meta(d).disabled) return;
    setFocused(d);
    if (mode === 'single') return onChange({ from: d, to: d });
    if (!value.from || value.to) return onChange({ from: d, to: null });
    if (d < value.from) return onChange({ from: d, to: value.from });
    onChange({ from: value.from, to: d });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const steps: Record<string, () => ISODate> = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      Home: () => startOfWeek(focused),
      End: () => addDays(startOfWeek(focused), 6),
      PageUp: () => shiftMonth(focused, -1),
      PageDown: () => shiftMonth(focused, 1),
    };
    if (steps[e.key]) {
      e.preventDefault();
      moveFocus(steps[e.key]());
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      select(focused);
    }
  };

  // Anzeige-Bereich (inkl. Vorschau beim Überfahren, solange nur der Start gewählt ist).
  const rangeEnd = value.to ?? (mode === 'range' && value.from && hover ? hover : null);
  const lo = value.from && rangeEnd && rangeEnd < value.from ? rangeEnd : value.from;
  const hi = value.from && rangeEnd && rangeEnd < value.from ? value.from : rangeEnd ?? value.from;
  const preview = !value.to && !!hover;

  return (
    <Box ref={gridRef} onKeyDown={onKeyDown} onMouseLeave={() => setHover(null)}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <IconButton size="small" onClick={() => setMonth(addMonths(month, -1))} disabled={!canPrev} aria-label="Vorheriger Monat">
          <ChevronLeft />
        </IconButton>
        <Box sx={{ flex: 1, display: 'grid', gridTemplateColumns: `repeat(${visibleMonths}, 1fr)`, textAlign: 'center' }}>
          {Array.from({ length: visibleMonths }, (_, i) => (
            <Typography key={i} id={`${baseId}-m${i}`} sx={{ fontWeight: 700 }} aria-live={i === 0 ? 'polite' : undefined}>
              {formatMonth(addMonths(month, i))}
            </Typography>
          ))}
        </Box>
        <IconButton size="small" onClick={() => setMonth(addMonths(month, 1))} disabled={!canNext} aria-label="Nächster Monat">
          <ChevronRight />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
        {Array.from({ length: visibleMonths }, (_, mi) => {
          const m = addMonths(month, mi);
          return (
            <Box key={m} role="grid" aria-label={`${label}, ${formatMonth(m)}`} sx={{ userSelect: 'none' }}>
              <Box role="row" sx={{ display: 'grid', gridTemplateColumns: `28px repeat(7, ${CELL}px)`, mb: 0.5 }}>
                <Box role="columnheader" sx={{ fontSize: 11, color: 'text.secondary', textAlign: 'center', alignSelf: 'center' }} aria-label="Kalenderwoche">
                  KW
                </Box>
                {WEEKDAY_LABELS.map((w, i) => (
                  <Box role="columnheader" key={w} sx={{ fontSize: 12, fontWeight: 700, textAlign: 'center', color: i > 4 ? 'text.secondary' : 'text.primary', py: 0.5 }}>
                    {w}
                  </Box>
                ))}
              </Box>
              {weeksOfMonth(m).map((week) => (
                <Box role="row" key={week[0]} sx={{ display: 'grid', gridTemplateColumns: `28px repeat(7, ${CELL}px)` }}>
                  <Box role="rowheader" sx={{ fontSize: 11, color: 'text.secondary', display: 'grid', placeItems: 'center' }}>
                    {isoWeek(week[0])}
                  </Box>
                  {week.map((d) => {
                    if (d.slice(0, 7) !== m.slice(0, 7)) return <Box role="gridcell" key={d} />;
                    const info = meta(d);
                    const inRange = !!(lo && hi && d >= lo && d <= hi);
                    const isStart = d === lo;
                    const isEnd = d === hi;
                    const endpoint = (isStart || isEnd) && !!lo;
                    const isToday = d === today;
                    const tooltip = [info.holiday, info.dot?.label, info.disabled ? 'nicht wählbar' : undefined].filter(Boolean).join(' · ');
                    const aria = [longDate.format(fromISO(d)), isToday && 'heute', info.holiday && `Feiertag: ${info.holiday}`, info.dot?.label, info.muted && 'kein Arbeitstag']
                      .filter(Boolean)
                      .join(', ');
                    const button = (
                      <ButtonBase
                        data-date={d}
                        tabIndex={d === focused ? 0 : -1}
                        disabled={info.disabled}
                        onClick={() => select(d)}
                        onMouseEnter={() => setHover(d)}
                        onFocus={() => setFocused(d)}
                        aria-label={aria}
                        aria-current={isToday ? 'date' : undefined}
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          position: 'relative',
                          zIndex: 1,
                          fontSize: 14,
                          fontWeight: endpoint || isToday ? 700 : 500,
                          color: endpoint ? 'primary.contrastText' : info.muted ? 'text.secondary' : 'text.primary',
                          bgcolor: endpoint ? (preview && isEnd && !isStart ? 'primary.light' : 'primary.main') : 'transparent',
                          border: isToday && !endpoint ? 2 : 0,
                          borderColor: 'primary.main',
                          opacity: info.disabled ? 0.35 : 1,
                          transition: 'background-color 0.1s',
                          '&:hover': { bgcolor: endpoint ? 'primary.dark' : 'action.hover' },
                          '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 },
                        }}
                      >
                        {Number(d.slice(8))}
                        {(info.holiday || info.dot) && (
                          <Box
                            component="span"
                            aria-hidden="true"
                            sx={{
                              position: 'absolute',
                              bottom: 3,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: 5,
                              height: 5,
                              borderRadius: '50%',
                              bgcolor: endpoint ? 'primary.contrastText' : (info.dot?.color ?? '#B7791F'),
                            }}
                          />
                        )}
                      </ButtonBase>
                    );
                    return (
                      <Box
                        role="gridcell"
                        key={d}
                        aria-selected={inRange}
                        sx={{ height: CELL, display: 'grid', placeItems: 'center', position: 'relative' }}
                      >
                        {inRange && lo !== hi && (
                          // Band zwischen Start und Ende; an den Enden nur zur Hälfte.
                          <Box
                            aria-hidden="true"
                            sx={{
                              position: 'absolute',
                              top: 2,
                              bottom: 2,
                              left: isStart ? '50%' : 0,
                              right: isEnd ? '50%' : 0,
                              bgcolor: preview ? 'action.hover' : 'action.selected',
                            }}
                          />
                        )}
                        {tooltip ? (
                          <Tooltip title={tooltip} disableInteractive enterDelay={300}>
                            <span>{button}</span>
                          </Tooltip>
                        ) : (
                          button
                        )}
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export function CalendarLegend({ items }: { items: { color: string; label: string; ring?: boolean }[] }) {
  return (
    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', fontSize: 13, color: 'text.secondary' }}>
      {items.map((i) => (
        <Box component="li" key={i.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box
            sx={
              i.ring
                ? { width: 12, height: 12, borderRadius: '50%', border: 2, borderColor: i.color }
                : { width: 8, height: 8, borderRadius: '50%', bgcolor: i.color }
            }
          />
          {i.label}
        </Box>
      ))}
    </Box>
  );
}
