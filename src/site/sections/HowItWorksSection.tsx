import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { steps } from '../../config/site';
import Section from '../components/Section';
import { visuallyHidden } from '../../components/visuallyHidden';

export default function HowItWorksSection() {
  return (
    <Section id="ablauf" eyebrow="So funktioniert’s" title="In vier Schritten startklar" subtitle="Keine Installation, keine Hardware außer einem Tablet – wenn Sie möchten.">
      <Box component="ol" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, counterReset: 'step' }}>
        {steps.map((step, i) => (
          <Box component="li" key={step.title} sx={{ position: 'relative' }}>
            <Box
              aria-hidden="true"
              sx={{ width: 48, height: 48, borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: 750, fontSize: 20, bgcolor: 'primary.main', color: 'primary.contrastText', mb: 2 }}
            >
              {i + 1}
            </Box>
            <Typography variant="h6" component="h3">
              <Box component="span" sx={visuallyHidden}>
                Schritt {i + 1}:{' '}
              </Box>
              {step.title}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>{step.text}</Typography>
          </Box>
        ))}
      </Box>
    </Section>
  );
}
