import type { ReactNode } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

export default function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 }, '& h2': { mt: 5, mb: 1.5 }, '& p': { mb: 1.5, color: 'text.secondary' } }}>
      <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '2rem', md: '2.6rem' }, mb: 4 }}>
        {title}
      </Typography>
      {children}
    </Container>
  );
}
