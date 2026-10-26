import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import GavelOutlined from '@mui/icons-material/GavelOutlined';
import { legalNote } from '../../config/site';

export default function LegalNoteSection() {
  return (
    <Box component="section" aria-labelledby="pflicht-titel" sx={{ py: { xs: 2, md: 3 } }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', gap: 2.5, p: { xs: 3, md: 4 }, borderRadius: 4, border: 1, borderColor: 'divider', bgcolor: 'background.paper', flexDirection: { xs: 'column', sm: 'row' } }}>
          <Box sx={{ width: 48, height: 48, borderRadius: 3, display: 'grid', placeItems: 'center', bgcolor: 'var(--mbz-tint)', color: 'primary.main', flexShrink: 0 }}>
            <GavelOutlined aria-hidden="true" />
          </Box>
          <Box>
            <Typography id="pflicht-titel" variant="h6" component="h2">
              {legalNote.title}
            </Typography>
            <Typography sx={{ mt: 1, color: 'text.secondary' }}>{legalNote.text}</Typography>
            <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary', fontStyle: 'italic' }}>
              {legalNote.disclaimer}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
