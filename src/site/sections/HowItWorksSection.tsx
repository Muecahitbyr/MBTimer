import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { steps } from '../../config/site';
import { MONO } from '../../theme/theme';
import Section from '../components/Section';

export default function HowItWorksSection() {
  return (
    <Section id="ablauf" eyebrow="So funktioniert’s" title={'In vier Schritten\nstartklar.'} subtitle="Keine Installation, keine Hardware außer einem Tablet – wenn Sie möchten." tinted>
      <Box component="ol" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, minmax(0, 1fr))' }, columnGap: 4, rowGap: 5 }}>
        {steps.map((step, i) => (
          <Box component="li" key={step.title} sx={{ pt: 2.5, borderTop: 1.5, borderColor: 'var(--mbt-ink)' }}>
            <Box sx={{ fontFamily: MONO, fontSize: 13, color: 'text.secondary' }}>
              {String(i + 1).padStart(2, '0')} —
            </Box>
            <Typography variant="h6" component="h3" sx={{ mt: 1.5, fontSize: '1.3rem' }}>
              {step.title}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mt: 0.75, lineHeight: 1.6 }}>{step.text}</Typography>
          </Box>
        ))}
      </Box>
    </Section>
  );
}
