import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { pricing } from '../../config/pricing';
import type { Billing } from './calculate';

export default function BillingToggle({ value, onChange, id }: { value: Billing; onChange: (b: Billing) => void; id: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, v: Billing | null) => v && onChange(v)}
        aria-labelledby={id}
        size="small"
        color="primary"
      >
        <ToggleButton value="monat" sx={{ px: 2.5 }}>Monatlich</ToggleButton>
        <ToggleButton value="jahr" sx={{ px: 2.5 }}>Jährlich</ToggleButton>
      </ToggleButtonGroup>
      <Chip
        size="small"
        label={`${pricing.yearlyFreeMonths} Monate gratis`}
        color="success"
        variant={value === 'jahr' ? 'filled' : 'outlined'}
      />
    </Box>
  );
}
