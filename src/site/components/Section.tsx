import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { MONO } from '../../theme/theme';

interface SectionProps {
  id: string;
  title: ReactNode;
  eyebrow?: string;
  subtitle?: ReactNode;
  /** Weißer statt leicht getönter Grund – Abschnitte wechseln sich ab. */
  tinted?: boolean;
  /** Überschriftenebene, z. B. h1 auf Unterseiten. */
  as?: 'h1' | 'h2';
  children: ReactNode;
}

/** Abschnitt im Stil „Präzise“: Haarlinie oben, Überschrift links, Einleitung rechts. */
export default function Section({ id, title, eyebrow, subtitle, tinted, as = 'h2', children }: SectionProps) {
  return (
    <Box
      component="section"
      id={id}
      aria-labelledby={`${id}-titel`}
      sx={{ borderTop: 1, borderColor: 'divider', bgcolor: tinted ? 'background.paper' : 'transparent', scrollMarginTop: 72, '&:focus': { outline: 'none' } }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 3, mb: { xs: 5, md: 7 } }}>
          <Box sx={{ maxWidth: 700 }}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <Typography
              id={`${id}-titel`}
              variant="h2"
              component={as}
              sx={{ fontSize: { xs: '2.1rem', md: '3.3rem' }, lineHeight: 1.02, whiteSpace: 'pre-line' }}
            >
              {title}
            </Typography>
          </Box>
          {subtitle && (
            <Typography sx={{ maxWidth: 400, color: 'text.secondary', fontSize: { md: '1.06rem' }, lineHeight: 1.6 }}>{subtitle}</Typography>
          )}
        </Box>
        {children}
      </Container>
    </Box>
  );
}

/** Kleine Beschriftung in Monospace, Großbuchstaben. */
export function Eyebrow({ children, color = 'text.secondary' }: { children: ReactNode; color?: string }) {
  return (
    <Typography component="p" sx={{ fontFamily: MONO, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase', color, mb: 2.5 }}>
      {children}
    </Typography>
  );
}
