import { useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar as MuiDateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickerDay, type PickerDayProps } from '@mui/x-date-pickers/PickerDay';
import { deDE } from '@mui/x-date-pickers/locales';
import type { ISODate } from '../../lib/date';
import { HOLIDAY_COLOR } from '../../lib/absenceStyle';

/** Zusatzinfos pro Tag (Feiertag, frei, Markierung …). */
export interface DayMeta {
  holiday?: string;
  /** Kein Arbeitstag (Wochenende / laut Arbeitszeitplan frei) – gedämpft dargestellt. */
  muted?: boolean;
  disabled?: boolean;
  /** Punkt am Tag, z. B. bestehender Urlaub oder fehlende Buchung. */
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
  label: string;
}

const iso = (d: Dayjs) => d.format('YYYY-MM-DD');
const localeText = {
  ...deDE.components.MuiLocalizationProvider.defaultProps.localeText,
  calendarWeekNumberHeaderText: 'KW',
  calendarWeekNumberHeaderLabel: 'Kalenderwoche',
  calendarWeekNumberAriaLabelText: (week: number) => `Kalenderwoche ${week}`,
};

interface DayExtraProps {
  rangeLo: ISODate | null;
  rangeHi: ISODate | null;
  preview: boolean;
  getMeta: (date: ISODate) => DayMeta;
  onHoverDay: (date: ISODate) => void;
}

/** Tag mit Zeitraum-Band, gedämpften freien Tagen und Punkt-Markierung (Badge). */
function CalendarDay(props: PickerDayProps & DayExtraProps) {
  const { rangeLo, rangeHi, preview, getMeta, onHoverDay, day, outsideCurrentMonth, ...other } = props;
  const date = iso(day as Dayjs);
  const meta = outsideCurrentMonth ? {} : getMeta(date);
  const inRange = !!(rangeLo && rangeHi && date >= rangeLo && date <= rangeHi) && !outsideCurrentMonth;
  const isStart = inRange && date === rangeLo;
  const isEnd = inRange && date === rangeHi;
  const endpoint = isStart || isEnd;
  const band = inRange && rangeLo !== rangeHi;
  const dotColor = meta.dot?.color ?? (meta.holiday ? HOLIDAY_COLOR : undefined);
  const tooltip = [meta.holiday, meta.dot?.label].filter(Boolean).join(' · ');

  const pickerDay = (
    <PickerDay
      {...other}
      day={day}
      outsideCurrentMonth={outsideCurrentMonth}
      selected={endpoint}
      onMouseEnter={(_, d) => onHoverDay(iso(d as Dayjs))}
      aria-label={[
        (day as Dayjs).locale('de').format('dddd, D. MMMM YYYY'),
        meta.holiday && `Feiertag: ${meta.holiday}`,
        meta.dot?.label,
        meta.muted && 'kein Arbeitstag',
      ]
        .filter(Boolean)
        .join(', ')}
      sx={{
        ...(meta.muted && !endpoint && { color: 'text.secondary' }),
        ...(band && {
          borderRadius: 0,
          mx: 0,
          width: 40,
          bgcolor: preview ? 'action.hover' : 'action.selected',
          '&:hover, &:focus': { bgcolor: preview ? 'action.selected' : 'action.focus' },
          ...(isStart && { borderTopLeftRadius: '50%', borderBottomLeftRadius: '50%' }),
          ...(isEnd && { borderTopRightRadius: '50%', borderBottomRightRadius: '50%' }),
        }),
        ...(endpoint && {
          bgcolor: preview && isEnd && !isStart ? 'primary.light' : 'primary.main',
          color: 'primary.contrastText',
          '&:hover, &:focus': { bgcolor: 'primary.dark' },
        }),
      }}
    />
  );

  const withDot = dotColor ? (
    <Badge
      key={date}
      overlap="circular"
      variant="dot"
      sx={{ '& .MuiBadge-badge': { bgcolor: dotColor, width: 8, height: 8, minWidth: 8, border: 1.5, borderColor: 'background.paper', top: 6, right: 6 } }}
    >
      {pickerDay}
    </Badge>
  ) : (
    pickerDay
  );

  return tooltip ? (
    <Tooltip title={tooltip} disableInteractive enterDelay={250}>
      <span>{withDot}</span>
    </Tooltip>
  ) : (
    withDot
  );
}

/**
 * Kalender auf Basis des MUI X DateCalendar (deutsch, Woche ab Montag, Kalenderwochen).
 * Zeitraum-Auswahl: erster Klick = Start, zweiter Klick = Ende (Band dazwischen, Vorschau beim Überfahren).
 */
export default function DateCalendar({ mode, value, onChange, today, min, max, getMeta, label }: DateCalendarProps) {
  const [hover, setHover] = useState<ISODate | null>(null);
  const [focusDate, setFocusDate] = useState<ISODate>(value.from ?? today);
  const meta = (d: ISODate) => getMeta?.(d) ?? {};

  const rangeEnd = value.to ?? (mode === 'range' && value.from && hover ? hover : null);
  const swapped = !!(value.from && rangeEnd && rangeEnd < value.from);
  const rangeLo = swapped ? rangeEnd : value.from;
  const rangeHi = swapped ? value.from : (rangeEnd ?? value.from);

  const select = (d: ISODate) => {
    setFocusDate(d);
    if (mode === 'single') return onChange({ from: d, to: d });
    if (!value.from || value.to) return onChange({ from: d, to: null });
    if (d < value.from) return onChange({ from: d, to: value.from });
    onChange({ from: value.from, to: d });
  };

  const dayProps: DayExtraProps = {
    rangeLo,
    rangeHi,
    preview: !value.to && !!hover,
    getMeta: meta,
    onHoverDay: setHover,
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de" localeText={localeText}>
      <Box onMouseLeave={() => setHover(null)} aria-label={label} role="group">
        <MuiDateCalendar
          value={dayjs(focusDate)}
          referenceDate={dayjs(value.from ?? today)}
          onChange={(d: Dayjs | null) => d && select(iso(d))}
          minDate={min ? dayjs(min) : undefined}
          maxDate={max ? dayjs(max) : undefined}
          shouldDisableDate={(d: Dayjs) => !!meta(iso(d)).disabled}
          displayWeekNumber
          dayOfWeekFormatter={(d: Dayjs) => d.locale('de').format('dd')}
          views={['day']}
          slots={{ day: CalendarDay as never }}
          slotProps={{ day: dayProps as never }}
          sx={{
            width: 'auto',
            maxWidth: 360,
            m: 0,
            '& .MuiPickersCalendarHeader-root': { pl: 2, pr: 1 },
            '& .MuiPickersCalendarHeader-label': { fontWeight: 700, textTransform: 'capitalize' },
            '& .MuiDayCalendar-weekDayLabel': { fontWeight: 700, color: 'text.primary' },
            '& .MuiDayCalendar-weekNumberLabel, & .MuiDayCalendar-weekNumber': { color: 'text.secondary', fontSize: 11 },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}

export function CalendarLegend({ items }: { items: { color: string; label: string; ring?: boolean }[] }) {
  return (
    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexWrap: 'wrap', gap: 1.5, fontSize: 13, color: 'text.secondary' }}>
      {items.map((i) => (
        <Box component="li" key={i.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box
            sx={
              i.ring
                ? { width: 12, height: 12, borderRadius: '50%', border: 1.5, borderColor: i.color }
                : { width: 8, height: 8, borderRadius: '50%', bgcolor: i.color }
            }
          />
          {i.label}
        </Box>
      ))}
    </Box>
  );
}
