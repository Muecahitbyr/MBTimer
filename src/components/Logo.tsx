import Box from '@mui/material/Box';

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <Box component="svg" viewBox="0 0 64 64" aria-hidden="true" sx={{ width: size, height: size, flexShrink: 0 }}>
      <rect width="64" height="64" rx="14" fill="var(--mui-palette-primary-main)" />
      <circle cx="32" cy="34" r="17" fill="none" stroke="var(--mui-palette-primary-contrastText)" strokeWidth="5" />
      <path d="M32 24v11l7 5" fill="none" stroke="var(--mui-palette-primary-contrastText)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="26" y="8" width="12" height="6" rx="3" fill="var(--mui-palette-primary-contrastText)" />
    </Box>
  );
}

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, fontWeight: 750, fontSize: size * 0.62, letterSpacing: '-0.02em', color: 'text.primary' }}>
      <LogoMark size={size} />
      <span>
        MB<Box component="span" sx={{ color: 'primary.main' }}>zeit</Box>
      </span>
    </Box>
  );
}
