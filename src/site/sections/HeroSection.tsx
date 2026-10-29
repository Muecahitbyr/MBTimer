import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { hero } from '../../config/site';
import { MONO } from '../../theme/theme';
import { Eyebrow } from '../components/Section';


export default function HeroSection() {
  return (
    <Box component="section" aria-labelledby="hero-titel">
      <Container maxWidth="lg" sx={{ pt: { xs: 7, md: 12 }, pb: { xs: 8, md: 10 } }}>
        <Eyebrow>{hero.eyebrow}</Eyebrow>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 4, md: 9 }, alignItems: 'flex-end' }}>
          <Typography
            id="hero-titel"
            variant="h1"
            sx={{ flex: '999 1 520px', fontSize: { xs: '3rem', sm: '4.5rem', md: '6.5rem' }, lineHeight: 0.95, whiteSpace: 'pre-line' }}
          >
            {hero.title}
          </Typography>
          <Box sx={{ flex: '1 1 300px', maxWidth: 400 }}>
            <Typography sx={{ fontSize: { xs: '1.06rem', md: '1.19rem' }, lineHeight: 1.55, color: 'text.secondary' }}>{hero.text}</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 3.5 }}>
              <Button component={RouterLink} to="/demo" variant="contained" size="large">{hero.primaryCta}</Button>
              <Button component={RouterLink} to="/#kontakt" variant="outlined" size="large">{hero.secondaryCta}</Button>
            </Box>
          </Box>
        </Box>

        <Box
          component="dl"
          aria-label="Beispiel eines Arbeitstags"
          sx={{ m: 0, mt: { xs: 7, md: 10 }, borderTop: 1.5, borderColor: 'var(--mbt-ink)', display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' } }}
        >
          {hero.clock.map((c) => (
            <Box key={c.label} sx={{ pt: 3, pr: 3 }}>
              <Box component="dt" sx={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'text.secondary' }}>{c.label}</Box>
              <Box component="dd" sx={{ m: 0, mt: 1, fontFamily: MONO, fontSize: { xs: 36, md: 56 }, letterSpacing: '-0.04em', lineHeight: 1.1, color: c.accent ? 'primary.main' : 'text.primary' }}>
                {c.value}
              </Box>
            </Box>
          ))}
        </Box>

      </Container>
    </Box>
  );
}
