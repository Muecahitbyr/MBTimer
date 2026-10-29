import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MONO } from '../../theme/theme';
import Section from '../components/Section';

/** Gezeichnete Geräte (keine Bilder) – zeigen, dass MBTimer am Handy, Tablet und PC läuft. */
function Stage({ children }: { children: ReactNode }) {
  return (
    <Box aria-hidden="true" sx={{ height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'var(--mbt-tint)', borderRadius: '4px', overflow: 'hidden' }}>
      {children}
    </Box>
  );
}

const line = '1.5px solid var(--mbt-ink)';

function Phone() {
  return (
    <Stage>
      <Box sx={{ width: 168, height: 312, border: line, borderRadius: '28px', p: '18px 14px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', bgcolor: 'background.paper' }}>
        <Box>
          <Box sx={{ fontSize: 11, color: 'text.secondary' }}>Guten Morgen, Lea</Box>
          <Box sx={{ mt: 1.25, fontFamily: MONO, fontSize: 34, letterSpacing: '-0.04em' }}>07:58</Box>
          <Box sx={{ fontSize: 11, color: 'text.secondary' }}>Soll heute 8:00 h</Box>
        </Box>
        <Box sx={{ height: 44, borderRadius: 999, bgcolor: 'primary.main', color: 'primary.contrastText', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>
          Kommen stempeln
        </Box>
      </Box>
    </Stage>
  );
}

function Tablet() {
  const people = [
    ['Lea', true],
    ['Tim', true],
    ['Aylin', false],
    ['Marco', false],
    ['Nina', true],
    ['Sophie', false],
  ] as const;
  return (
    <Stage>
      <Box sx={{ width: 296, maxWidth: '86%', height: 206, border: line, borderRadius: '18px', p: 2, boxSizing: 'border-box', bgcolor: 'background.paper', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 1 }}>
        {people.map(([name, here]) => (
          <Box key={name} sx={{ border: 1, borderColor: 'divider', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.5, fontSize: 11 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: here ? 'primary.main' : 'var(--mbt-line-strong)' }} />
            {name}
          </Box>
        ))}
      </Box>
    </Stage>
  );
}

function Laptop() {
  const rows = [
    ['Mo 19.10.', '07:20–16:03', '+0:13'],
    ['Di 20.10.', '07:30–16:02', '+0:02'],
    ['Mi 21.10.', 'Urlaub', '±0:00'],
    ['Do 22.10.', '07:35–17:32', '+1:12'],
  ];
  return (
    <Stage>
      <Box sx={{ width: 316, maxWidth: '86%' }}>
        <Box sx={{ height: 196, border: line, borderRadius: '10px 10px 0 0', p: 1.75, boxSizing: 'border-box', bgcolor: 'background.paper', fontFamily: MONO, fontSize: 10.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75, borderBottom: line, fontFamily: 'inherit', fontWeight: 600, fontSize: 12 }}>
            <span>KW 43</span>
            <span>40:08 / 40:00</span>
          </Box>
          {rows.map((r, i) => (
            <Box key={r[0]} sx={{ display: 'flex', justifyContent: 'space-between', py: '7px', borderBottom: i < rows.length - 1 ? 1 : 0, borderColor: 'divider' }}>
              <span>{r[0]}</span>
              <span>{r[1]}</span>
              <Box component="span" sx={{ color: i === 3 ? 'primary.main' : 'inherit' }}>{r[2]}</Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ height: 14, border: line, borderTop: 0, borderRadius: '0 0 6px 6px', bgcolor: 'var(--mbt-tint)', mx: '-18px' }} />
      </Box>
    </Stage>
  );
}

const devices = [
  { nr: '01', label: 'Handy', title: 'Unterwegs, im Außendienst, im Homeoffice', text: 'Stempeln, Urlaub beantragen und die eigenen Stunden prüfen – direkt im Browser des Handys.', visual: <Phone /> },
  { nr: '02', label: 'Tablet', title: 'Die Stempeluhr am Eingang', text: 'Name antippen, persönliche PIN eingeben, fertig. Fehlt das Internet, zeigt der Kiosk es deutlich an.', visual: <Tablet /> },
  { nr: '03', label: 'PC', title: 'Für Leitung und Verwaltung', text: 'Monatsübersicht, Anträge genehmigen, Urlaubskalender und Statistiken für das ganze Team.', visual: <Laptop /> },
];

export default function DevicesSection() {
  return (
    <Section
      id="geraete"
      eyebrow="Handy · Tablet · PC"
      title={'Ein Konto.\nDrei Wege zu stempeln.'}
      subtitle="Läuft im Browser. Keine App aus dem Store, keine Installation – einfach anmelden. Am Tablet lässt sich MBTimer als Vollbild-App einrichten."
      tinted
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 4 }}>
        {devices.map((d) => (
          <Box component="article" key={d.nr} aria-labelledby={`geraet-${d.nr}`} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {d.visual}
            <Box>
              <Box sx={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.04em', color: 'text.secondary' }}>
                {d.nr} — {d.label.toUpperCase()}
              </Box>
              <Typography id={`geraet-${d.nr}`} variant="h6" component="h3" sx={{ mt: 1, fontSize: '1.35rem', lineHeight: 1.2 }}>
                {d.title}
              </Typography>
              <Typography sx={{ mt: 0.75, color: 'text.secondary', lineHeight: 1.6 }}>{d.text}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Section>
  );
}
