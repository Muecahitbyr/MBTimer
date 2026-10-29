import Box from '@mui/material/Box';
import { MONO } from '../theme/theme';

/** Wortmarke „MBTimer“, optional mit Zusatz in Monospace (Designrichtung „Präzise“). */
export function Logo({ size = 32, tagline }: { size?: number; tagline?: string }) {
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'baseline', gap: 1.25, color: 'text.primary' }}>
      <Box component="span" sx={{ fontWeight: 700, fontSize: size * 0.62, letterSpacing: '-0.025em', lineHeight: 1 }}>MBTimer</Box>
      {tagline && (
        <Box component="span" sx={{ fontFamily: MONO, fontSize: 12, color: 'text.secondary' }}>{tagline}</Box>
      )}
    </Box>
  );
}
