import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

interface SectionProps {
  id: string;
  title: string;
  eyebrow?: string;
  subtitle?: ReactNode;
  tinted?: boolean;
  /** Überschriftenebene, z. B. h1 auf Unterseiten. */
  as?: 'h1' | 'h2';
  children: ReactNode;
}

export default function Section({ id, title, eyebrow, subtitle, tinted, as = 'h2', children }: SectionProps) {
  return (
    <Box
      component="section"
      id={id}
      aria-labelledby={`${id}-titel`}
      sx={{
        py: { xs: 7, md: 11 },
        scrollMarginTop: 72,
        bgcolor: tinted ? 'var(--mbt-tint)' : 'transparent',
        '&:focus': { outline: 'none' },
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 720, mx: 'auto', textAlign: 'center', mb: { xs: 5, md: 7 } }}>
          {eyebrow && (
            <Typography variant="overline" component="p" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.1em' }}>
              {eyebrow}
            </Typography>
          )}
          <Typography id={`${id}-titel`} variant="h3" component={as} sx={{ fontSize: { xs: '1.75rem', md: '2.4rem' } }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ mt: 2, color: 'text.secondary', fontSize: { md: '1.1rem' } }}>{subtitle}</Typography>
          )}
        </Box>
        {children}
      </Container>
    </Box>
  );
}
