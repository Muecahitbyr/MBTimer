import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { featureGroups } from '../../config/site';
import { MONO } from '../../theme/theme';
import Section from '../components/Section';
import { BrowserFrame } from '../components/DeviceFrames';
import Screenshot from '../components/Screenshot';

// Echte Screenshots der Demo (erzeugt mit npm run screenshots).
const zeiterfassung = '/screenshots/zeiterfassung.webp';
const zeiterfassungSmall = '/screenshots/zeiterfassung-small.webp';
const kalender = '/screenshots/urlaubskalender.webp';
const kalenderSmall = '/screenshots/urlaubskalender-small.webp';

const shots = [
  {
    src: zeiterfassung,
    small: zeiterfassungSmall,
    label: 'mbtimer.vercel.app/demo · Zeiterfassung',
    caption: 'Monatsübersicht mit Soll/Ist, Überstundenkonto und aufklappbaren Kalenderwochen.',
    alt: 'Zeiterfassung in der MBTimer-Demo: Monatssumme mit Soll, Ist und Saldo sowie eine aufgeklappte Kalenderwoche mit Stempelzeiten.',
  },
  {
    src: kalender,
    small: kalenderSmall,
    label: 'mbtimer.vercel.app/demo · Urlaubskalender',
    caption: 'Teamkalender mit Urlaub, Krankheit, Freistellungen und Feiertagen.',
    alt: 'Urlaubskalender in der MBTimer-Demo: Zeitleiste mit allen Mitarbeitern und farbigen Balken für Abwesenheiten.',
  },
];

// Durchgehende Nummerierung über alle Gruppen (01, 02, …).
const numberedGroups = featureGroups.map((group, gi) => {
  const offset = featureGroups.slice(0, gi).reduce((n, g) => n + g.items.length, 0);
  return { ...group, items: group.items.map((item, i) => ({ ...item, nr: String(offset + i + 1).padStart(2, '0') })) };
});

export default function FeaturesSection() {
  return (
    <Section
      id="funktionen"
      eyebrow="Funktionen"
      title={'Alles drin.\nNichts zu viel.'}
      subtitle="Von der Stempeluhr am Eingang bis zur Urlaubsplanung – in einer Anwendung, für jede Betriebsgröße."
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, columnGap: 8, rowGap: 7 }}>
        {numberedGroups.map((group) => (
          <Box key={group.title} component="article" aria-labelledby={`fg-${group.title}`}>
            <Box sx={{ pb: 1.5, borderBottom: 1.5, borderColor: 'var(--mbt-ink)' }}>
              <Typography id={`fg-${group.title}`} variant="h5" component="h3">{group.title}</Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: 14, mt: 0.5 }}>{group.description}</Typography>
            </Box>
            <Box component="ol" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {group.items.map((item) => (
                <Box component="li" key={item.title} sx={{ display: 'grid', gridTemplateColumns: '44px 1fr', py: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Box sx={{ fontFamily: MONO, fontSize: 13, color: 'text.secondary', pt: '3px' }}>{item.nr}</Box>
                  <Box>
                    <Typography sx={{ fontSize: '1.08rem', fontWeight: 600, lineHeight: 1.35 }}>{item.title}</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: 15, mt: 0.25, lineHeight: 1.55 }}>{item.text}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mt: { xs: 8, md: 11 } }}>
        {shots.map((s) => (
          <Box component="figure" key={s.label} sx={{ m: 0 }}>
            <BrowserFrame label={s.label}>
              <Screenshot src={s.src} srcSmall={s.small} width={1440} height={900} alt={s.alt} />
            </BrowserFrame>
            <Typography component="figcaption" variant="body2" sx={{ color: 'text.secondary', mt: 1.5 }}>
              {s.caption} <Box component="span" sx={{ fontFamily: MONO, fontSize: 12 }}>Echter Screenshot, erfundene Daten.</Box>
            </Typography>
          </Box>
        ))}
      </Box>
    </Section>
  );
}
