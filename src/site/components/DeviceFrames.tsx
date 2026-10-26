import type { ReactNode } from 'react';
import Box from '@mui/material/Box';

export function BrowserFrame({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <Box
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '0 24px 60px -24px rgba(16, 36, 66, 0.35)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 1.5, py: 1, borderBottom: 1, borderColor: 'divider', bgcolor: 'var(--mbz-tint)' }}>
        {['#E57373', '#FFB74D', '#81C784'].map((c) => (
          <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c }} />
        ))}
        {label && (
          <Box sx={{ ml: 1.5, px: 1.5, py: 0.25, borderRadius: 1, fontSize: 12, color: 'text.secondary', bgcolor: 'background.paper', flex: 1, maxWidth: 280, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {label}
          </Box>
        )}
      </Box>
      <Box sx={{ lineHeight: 0 }}>{children}</Box>
    </Box>
  );
}

export function TabletFrame({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        p: { xs: 1.25, sm: 2 },
        borderRadius: { xs: 4, sm: 6 },
        bgcolor: '#1F2329',
        boxShadow: '0 30px 70px -30px rgba(16, 36, 66, 0.55), inset 0 0 0 2px #3B414A',
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'absolute', top: '50%', left: { xs: 4, sm: 7 }, width: 5, height: 5, borderRadius: '50%', bgcolor: '#4B525C', transform: 'translateY(-50%)' }} />
      <Box sx={{ borderRadius: { xs: 1.5, sm: 2 }, overflow: 'hidden', lineHeight: 0 }}>{children}</Box>
    </Box>
  );
}
