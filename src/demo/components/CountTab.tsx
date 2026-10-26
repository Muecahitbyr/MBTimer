import Box from '@mui/material/Box';
import Tab, { type TabProps } from '@mui/material/Tab';

/** Reiter mit Zähler rechts neben dem Text (nicht abgeschnitten wie ein Badge über dem Reiter). */
export default function CountTab({ label, count, ...props }: TabProps & { label: string; count: number }) {
  return (
    <Tab
      {...props}
      label={
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
          {label}
          {count > 0 && (
            <Box
              component="span"
              aria-label={`${count} offen`}
              sx={{ minWidth: 22, height: 22, px: 0.75, borderRadius: 11, bgcolor: 'error.main', color: 'error.contrastText', fontSize: 12, fontWeight: 700, display: 'inline-grid', placeItems: 'center', lineHeight: 1 }}
            >
              {count}
            </Box>
          )}
        </Box>
      }
    />
  );
}
