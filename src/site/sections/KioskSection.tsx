import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutlined';
import { kiosk } from '../../config/site';
import Section from '../components/Section';
import { TabletFrame } from '../components/DeviceFrames';
import Screenshot from '../components/Screenshot';

// Echte Screenshots der Demo (erzeugt mit npm run screenshots).
const kioskShot = '/screenshots/kiosk.webp';
const kioskShotSmall = '/screenshots/kiosk-small.webp';

export default function KioskSection() {
  return (
    <Section id="kiosk" eyebrow="Kiosk-Tablet" title={kiosk.title} tinted>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' }, gap: { xs: 5, md: 8 }, alignItems: 'center' }}>
        <TabletFrame>
          <Screenshot
            src={kioskShot}
            srcSmall={kioskShotSmall}
            width={1180}
            height={820}
            sizes="(min-width: 900px) 58vw, 100vw"
            alt="Kiosk-Ansicht der MBzeit-Demo auf einem Tablet: Namenskacheln des Teams mit Anwesenheitsstatus und Uhrzeit."
          />
        </TabletFrame>
        <Box>
          <Typography sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>{kiosk.text}</Typography>
          <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 3, display: 'grid', gap: 1.25 }}>
            {kiosk.points.map((p) => (
              <Box component="li" key={p} sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
                <CheckCircleOutline sx={{ color: 'primary.main' }} aria-hidden="true" />
                {p}
              </Box>
            ))}
          </Box>
          <Button component={RouterLink} to="/demo/kiosk" variant="contained" size="large" sx={{ mt: 4 }}>
            Kiosk in der Demo ausprobieren
          </Button>
        </Box>
      </Box>
    </Section>
  );
}
