import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { legalNote } from '../../config/site';
import { Eyebrow } from '../components/Section';

export default function LegalNoteSection() {
  return (
    <Box component="section" aria-labelledby="pflicht-titel" sx={{ borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 }, display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 9 } }}>
        <Box sx={{ flex: '1 1 260px' }}>
          <Eyebrow>Rechtlicher Rahmen</Eyebrow>
          <Typography id="pflicht-titel" variant="h5" component="h2" sx={{ fontSize: { md: '1.6rem' }, lineHeight: 1.15 }}>
            {legalNote.title}
          </Typography>
        </Box>
        <Box sx={{ flex: '2 1 480px' }}>
          <Typography sx={{ color: 'text.secondary', lineHeight: 1.65 }}>{legalNote.text}</Typography>
          <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary', fontStyle: 'italic' }}>{legalNote.disclaimer}</Typography>
        </Box>
      </Container>
    </Box>
  );
}
