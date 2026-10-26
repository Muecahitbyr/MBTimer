import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { addMonths, formatMonth, startOfMonth, type ISODate } from '../lib/date';

interface Props {
  month: ISODate;
  onChange: (m: ISODate) => void;
  min: ISODate;
  max: ISODate;
}

export default function MonthNav({ month, onChange, min, max }: Props) {
  const prev = addMonths(month, -1);
  const next = addMonths(month, 1);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, border: 1, borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }}>
      <IconButton onClick={() => onChange(prev)} disabled={prev < startOfMonth(min)} aria-label="Vorheriger Monat">
        <ChevronLeft />
      </IconButton>
      <Typography sx={{ minWidth: 140, textAlign: 'center', fontWeight: 600 }} aria-live="polite">
        {formatMonth(month)}
      </Typography>
      <IconButton onClick={() => onChange(next)} disabled={next > startOfMonth(max)} aria-label="Nächster Monat">
        <ChevronRight />
      </IconButton>
    </Box>
  );
}
