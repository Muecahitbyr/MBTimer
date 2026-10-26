import { useState, type KeyboardEvent } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined';
import { fromMinutes, parseTime, toMinutes } from '../../lib/date';

interface TimeFieldProps {
  label: string;
  /** „HH:MM“ oder '' */
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

/** Doppelpunkt beim Tippen einfügen: „0730“ → „07:30“, „730“ → „7:30“ (Stunde > 23 ist einstellig gemeint). */
function mask(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  if (Number(digits.slice(0, 2)) > 23) return `${digits[0]}:${digits.slice(1, 3)}`;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

/** Uhrzeit im 24-Stunden-Format (unabhängig von der Browsersprache). Pfeil ↑/↓: ±5 Minuten. */
export default function TimeField({ label, value, onChange, error }: TimeFieldProps) {
  const [text, setText] = useState(value);
  const [synced, setSynced] = useState(value);
  const [blurred, setBlurred] = useState(false);
  // Nur echte Änderungen von außen übernehmen (z. B. Schnellauswahl), nicht das Echo der eigenen Eingabe.
  if (value !== synced) {
    setSynced(value);
    if (value !== (parseTime(text) ?? '')) setText(value);
  }
  const invalid = blurred && text !== '' && parseTime(text) === null;

  const commit = (t: string) => {
    const parsed = parseTime(t);
    setText(parsed ?? t);
    onChange(parsed ?? '');
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    const base = parseTime(text) ?? '08:00';
    const step = e.key === 'ArrowUp' ? 5 : -5;
    const minutes = Math.round((toMinutes(base) + step) / 5) * 5;
    commit(fromMinutes(minutes));
  };

  return (
    <TextField
      label={label}
      value={text}
      placeholder="hh:mm"
      onChange={(e) => {
        const masked = mask(e.target.value);
        setText(masked);
        setBlurred(false);
        // Erst vollständige Uhrzeiten melden; Teil-Eingaben werden beim Verlassen des Felds übernommen.
        const parsed = /^\d{1,2}:\d{2}$/.test(masked) ? parseTime(masked) : null;
        if (parsed) onChange(parsed);
      }}
      onBlur={() => {
        setBlurred(true);
        commit(text);
      }}
      onKeyDown={onKeyDown}
      error={error || invalid}
      helperText={invalid ? 'Bitte Uhrzeit als hh:mm eingeben' : undefined}
      slotProps={{
        htmlInput: { inputMode: 'numeric', maxLength: 5, 'aria-description': 'Format hh:mm, Pfeiltasten ändern um 5 Minuten' },
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <ScheduleOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
