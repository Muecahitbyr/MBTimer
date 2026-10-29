import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MONO } from '../../theme/theme';
import Section from '../components/Section';
import Screenshot from '../components/Screenshot';

// Echte Screenshots der Demo (erzeugt mit npm run screenshots).
const SHOTS = {
  handy: { src: '/screenshots/handy.webp', small: '/screenshots/handy-small.webp', width: 780, height: 1688 },
  kiosk: { src: '/screenshots/kiosk.webp', small: '/screenshots/kiosk-small.webp', width: 1180, height: 820 },
  desktop: { src: '/screenshots/dashboard.webp', small: '/screenshots/dashboard-small.webp', width: 1440, height: 900 },
};

function Stage({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ height: { xs: 'auto', md: 520 }, py: { xs: 4, md: 0 }, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'var(--mbt-tint)', borderRadius: '4px' }}>
      {children}
    </Box>
  );
}

function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ width: { xs: 200, md: 215 }, p: '7px', bgcolor: '#111111', borderRadius: '38px', boxSizing: 'border-box' }}>
      <Box sx={{ borderRadius: '31px', overflow: 'hidden', lineHeight: 0 }}>{children}</Box>
    </Box>
  );
}

function TabletFrame({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ width: '100%', maxWidth: 360, p: '10px', bgcolor: '#111111', borderRadius: '22px', boxSizing: 'border-box' }}>
      <Box sx={{ borderRadius: '12px', overflow: 'hidden', lineHeight: 0 }}>{children}</Box>
    </Box>
  );
}

/** Laptop mit Bildschirmrahmen und Unterteil (ohne Markenlogo). */
function LaptopFrame({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ width: '100%', maxWidth: 360 }}>
      <Box sx={{ p: '9px 9px 12px', bgcolor: '#111111', borderRadius: '14px 14px 2px 2px' }}>
        <Box sx={{ borderRadius: '3px', overflow: 'hidden', lineHeight: 0 }}>{children}</Box>
      </Box>
      <Box sx={{ height: 12, mx: '-7%', bgcolor: '#CFCCC6', borderRadius: '0 0 14px 14px', display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '16%', height: 5, bgcolor: '#B3B0A9', borderRadius: '0 0 6px 6px' }} />
      </Box>
    </Box>
  );
}

const devices = [
  {
    nr: '01',
    label: 'Handy',
    title: 'Unterwegs',
    text: 'Stempeln und Urlaub beantragen – auch im Außendienst.',
    visual: (
      <PhoneFrame>
        <Screenshot
          {...SHOTS.handy}
          srcSmall={SHOTS.handy.small}
          sizes="215px"
          alt="MBTimer-Demo auf dem Handy: Begrüßung, Button „Kommen stempeln“, Monatssaldo und Überstundenkonto."
        />
      </PhoneFrame>
    ),
  },
  {
    nr: '02',
    label: 'Tablet',
    title: 'Am Eingang',
    text: 'Die Stempeluhr: Name antippen, PIN eingeben, fertig.',
    visual: (
      <TabletFrame>
        <Screenshot
          {...SHOTS.kiosk}
          srcSmall={SHOTS.kiosk.small}
          sizes="340px"
          alt="Kiosk-Stempeluhr der MBTimer-Demo auf dem Tablet: Namenskacheln des Teams mit Anwesenheitsstatus."
        />
      </TabletFrame>
    ),
  },
  {
    nr: '03',
    label: 'PC',
    title: 'Im Büro',
    text: 'Übersicht, Genehmigungen und Statistiken für die Leitung.',
    visual: (
      <LaptopFrame>
        <Screenshot
          {...SHOTS.desktop}
          srcSmall={SHOTS.desktop.small}
          sizes="340px"
          alt="MBTimer-Demo am Laptop: Dashboard mit Stempel-Status, Saldo, offenen Anträgen und Team-Übersicht."
        />
      </LaptopFrame>
    ),
  },
];

export default function DevicesSection() {
  return (
    <Section
      id="geraete"
      eyebrow="Handy · Tablet · PC"
      title={'Ein Konto.\nDrei Wege zu stempeln.'}
      subtitle="Läuft im Browser – keine App, keine Installation."
      tinted
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 4 }}>
        {devices.map((d) => (
          <Box component="figure" key={d.nr} sx={{ m: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Stage>{d.visual}</Stage>
            <Box component="figcaption">
              <Box sx={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.04em', color: 'text.secondary' }}>
                {d.nr} — {d.label.toUpperCase()}
              </Box>
              <Typography component="h3" variant="h6" sx={{ mt: 1, fontSize: '1.35rem', lineHeight: 1.2 }}>
                {d.title}
              </Typography>
              <Typography sx={{ mt: 0.5, color: 'text.secondary', lineHeight: 1.6 }}>{d.text}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
      <Typography sx={{ mt: 3, fontFamily: MONO, fontSize: 12, color: 'text.secondary' }}>Echte Screenshots aus der Demo – alle Daten erfunden.</Typography>
    </Section>
  );
}
