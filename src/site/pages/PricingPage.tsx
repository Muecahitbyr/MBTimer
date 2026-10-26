import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { faq, getPricingFaq } from '../../config/site';
import { pricing } from '../../config/pricing';
import { usePageMeta } from '../../components/usePageMeta';
import PricingSection from '../pricing/PricingSection';
import ComparisonTable from '../pricing/ComparisonTable';
import { FaqList } from '../sections/FaqSection';
import { pageMeta } from '../seo';

const cancelFaq = faq.find((f) => f.q.startsWith('Wie kann ich kündigen'));
const items = [...getPricingFaq(pricing.setupService.price), ...(cancelFaq ? [cancelFaq] : [])];

export default function PricingPage() {
  usePageMeta(pageMeta['/preise']);
  return (
    <>
      <PricingSection as="h1" />
      <Container maxWidth="lg" sx={{ pb: { xs: 8, md: 11 } }}>
        <ComparisonTable />
        <Box component="section" aria-labelledby="preis-faq" sx={{ mt: { xs: 8, md: 10 } }}>
          <Typography id="preis-faq" variant="h4" component="h2" sx={{ textAlign: 'center', mb: 4, fontSize: { xs: '1.5rem', md: '2rem' } }}>
            Fragen zu den Preisen
          </Typography>
          <FaqList items={items} />
        </Box>
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography sx={{ color: 'text.secondary', mb: 2 }}>Erst ausprobieren? Die Demo zeigt alle Funktionen mit erfundenen Daten.</Typography>
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button component={RouterLink} to="/demo" variant="outlined" size="large">Demo ansehen</Button>
            <Button component={RouterLink} to="/#kontakt" variant="contained" size="large">Unverbindlich anfragen</Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
