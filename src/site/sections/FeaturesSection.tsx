import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { featureGroups } from '../../config/site';
import { MONO } from '../../theme/theme';
import Section from '../components/Section';
import { BrowserFrame } from '../components/DeviceFrames';
import Screenshot from '../components/Screenshot';

// Echte Screenshots der Demo (erzeugt mit npm run screenshots).
const shots = [
  {
    src: '/screenshots/zeiterfassung.webp',
    small: '/screenshots/zeiterfassung-small.webp',
    label: 'Zeiterfassung',
    alt: 'Zeiterfassung in der MBTimer-Demo: Monatssumme mit Soll, Ist und Saldo sowie eine aufgeklappte Kalenderwoche mit Stempelzeiten.',
  },
  {
    src: '/screenshots/urlaubskalender.webp',
    small: '/screenshots/urlaubskalender-small.webp',
    label: 'Urlaubskalender',
    alt: 'Urlaubskalender in der MBTimer-Demo: Zeitleiste mit allen Mitarbeitern und farbigen Balken für Abwesenheiten.',
  },
];

// Durchgehende Nummerierung über alle Gruppen (01, 02, …).
const numberedGroups = featureGroups.map((group, gi) => {
  const offset = featureGroups.slice(0, gi).reduce((n, g) => n + g.items.length, 0);
  return { ...group, items: group.items.map((item, i) => ({ ...item, nr: String(offset + i + 1).padStart(2, '0') })) };
});

/** Funktionen als Stichworte zum Überfliegen – Details zeigt die Demo. */
export default function FeaturesSection() {
  return (
    <Section id="funktionen" eyebrow="Funktionen" title="Alles drin." tinted>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' }, columnGap: 4, rowGap: 5 }}>
        {numberedGroups.map((group) => (
          <Box key={group.title} component="article" aria-labelledby={`fg-${group.title}`}>
            <Typography id={`fg-${group.title}`} variant="h6" component="h3" sx={{ pb: 1.25, borderBottom: 1.5, borderColor: 'var(--mbt-ink)' }}>
              {group.title}
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {group.items.map((item) => (
                <Box component="li" key={item.title} sx={{ display: 'flex', gap: 1.5, py: 1.1, borderBottom: 1, borderColor: 'divider', fontSize: 15 }}>
                  <Box component="span" sx={{ fontFamily: MONO, fontSize: 12, color: 'text.secondary', pt: '2px' }}>{item.nr}</Box>
                  {item.title}
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mt: { xs: 7, md: 9 } }}>
        {shots.map((s) => (
          <BrowserFrame key={s.label} label={`mbtimer.vercel.app/demo · ${s.label}`}>
            <Screenshot src={s.src} srcSmall={s.small} width={1440} height={900} alt={s.alt} />
          </BrowserFrame>
        ))}
      </Box>
      <Typography sx={{ mt: 1.5, fontFamily: MONO, fontSize: 12, color: 'text.secondary' }}>Echte Screenshots aus der Demo – alle Daten erfunden.</Typography>
    </Section>
  );
}
