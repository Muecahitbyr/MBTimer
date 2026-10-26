import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutlined';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import { hero } from '../../config/site';
import { BrowserFrame } from '../components/DeviceFrames';
import Screenshot from '../components/Screenshot';

// Echte Screenshots der Demo (erzeugt mit npm run screenshots).
const dashboard = '/screenshots/dashboard.webp';
const dashboardSmall = '/screenshots/dashboard-small.webp';

export default function HeroSection() {
  return (
    <Box
      component="section"
      aria-labelledby="hero-titel"
      sx={{
        pt: { xs: 6, md: 10 },
        pb: { xs: 7, md: 11 },
        background: 'linear-gradient(180deg, var(--mbz-tint) 0%, transparent 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '5fr 6fr' }, gap: { xs: 6, md: 8 }, alignItems: 'center' }}>
          <Box>
            <Typography variant="overline" component="p" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.1em', lineHeight: 1.4 }}>
              {hero.eyebrow}
            </Typography>
            <Typography id="hero-titel" variant="h1" sx={{ fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.3rem' }, lineHeight: 1.1, mt: 1.5 }}>
              {hero.title}
            </Typography>
            <Typography sx={{ mt: 3, fontSize: { xs: '1.05rem', md: '1.2rem' }, color: 'text.secondary', maxWidth: 560 }}>
              {hero.text}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 4 }}>
              <Button component={RouterLink} to="/demo" variant="contained" size="large" startIcon={<PlayArrowRounded />}>
                {hero.primaryCta}
              </Button>
              <Button component={RouterLink} to="/#kontakt" variant="outlined" size="large">
                {hero.secondaryCta}
              </Button>
            </Box>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 4, display: 'grid', gap: 1 }}>
              {hero.points.map((p) => (
                <Box component="li" key={p} sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                  <CheckCircleOutline fontSize="small" sx={{ color: 'primary.main' }} aria-hidden="true" />
                  {p}
                </Box>
              ))}
            </Box>
          </Box>
          <BrowserFrame label="MBzeit – Dashboard (Demo)">
            <Screenshot
              src={dashboard}
              srcSmall={dashboardSmall}
              width={1440}
              height={900}
              priority
              alt="Dashboard der MBzeit-Demo: Begrüßung, Stempel-Status, Monatssaldo, offene Anträge und wer heute anwesend ist."
            />
          </BrowserFrame>
        </Box>
      </Container>
    </Box>
  );
}
