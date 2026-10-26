import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { usePageMeta } from '../../components/usePageMeta';

export default function NotFoundPage() {
  usePageMeta({ title: 'Seite nicht gefunden' });
  return (
    <Container maxWidth="sm" sx={{ py: 12, textAlign: 'center' }}>
      <Typography variant="h3" component="h1">Seite nicht gefunden</Typography>
      <Typography sx={{ mt: 2, color: 'text.secondary' }}>Die aufgerufene Seite existiert nicht.</Typography>
      <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 4 }}>Zur Startseite</Button>
    </Container>
  );
}
