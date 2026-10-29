import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import { MONO } from '../../theme/theme';

/** Schlichter Browserrahmen: Haarlinie, Adresszeile in Monospace, kein Schatten. */
export function BrowserFrame({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <Box sx={{ borderRadius: '8px', overflow: 'hidden', border: 1, borderColor: 'var(--mbt-line-strong)', bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1, borderBottom: 1, borderColor: 'var(--mbt-line-strong)' }}>
        <Box sx={{ display: 'flex', gap: 0.75 }} aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <Box key={i} sx={{ width: 9, height: 9, borderRadius: '50%', border: 1, borderColor: 'var(--mbt-line-strong)' }} />
          ))}
        </Box>
        {label && (
          <Box sx={{ fontFamily: MONO, fontSize: 11.5, color: 'text.secondary', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{label}</Box>
        )}
      </Box>
      <Box sx={{ lineHeight: 0 }}>{children}</Box>
    </Box>
  );
}
