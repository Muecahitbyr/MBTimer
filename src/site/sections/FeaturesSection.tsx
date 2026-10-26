import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { featureGroups } from '../../config/site';
import Section from '../components/Section';
import { featureIcons } from '../components/featureIcons';
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
    label: 'Zeiterfassung',
    caption: 'Monatsübersicht mit Soll/Ist, Überstundenkonto und aufklappbaren Kalenderwochen.',
    alt: 'Zeiterfassung in der MBTimer-Demo: Monatssumme mit Soll, Ist und Saldo sowie eine aufgeklappte Kalenderwoche mit Stempelzeiten.',
  },
  {
    src: kalender,
    small: kalenderSmall,
    label: 'Urlaubskalender',
    caption: 'Teamkalender mit Urlaub, Krankheit, Freistellungen und Feiertagen.',
    alt: 'Urlaubskalender in der MBTimer-Demo: Monatsraster mit allen Mitarbeitern und farbig markierten Abwesenheiten.',
  },
];

export default function FeaturesSection() {
  return (
    <Section
      id="funktionen"
      eyebrow="Funktionen"
      title="Alles, was Ihr Betrieb für die Zeiterfassung braucht"
      subtitle="Von der Stempeluhr am Eingang bis zur Urlaubsplanung – übersichtlich in einer Anwendung."
      tinted
    >
      <Box sx={{ display: 'grid', gap: { xs: 6, md: 8 } }}>
        {featureGroups.map((group) => (
          <Box key={group.title} component="article" aria-labelledby={`fg-${group.title}`}>
            <Box sx={{ mb: 2.5 }}>
              <Typography id={`fg-${group.title}`} variant="h5" component="h3">
                {group.title}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>{group.description}</Typography>
            </Box>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
              {group.items.map((item) => {
                const Icon = featureIcons[item.icon];
                return (
                  <Box component="li" key={item.title} sx={{ p: 2.5, borderRadius: 4, bgcolor: 'background.paper', border: 1, borderColor: 'divider', height: '100%' }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: 3, display: 'grid', placeItems: 'center', bgcolor: 'var(--mbt-tint)', color: 'primary.main', mb: 1.5 }}>
                      <Icon aria-hidden="true" />
                    </Box>
                    <Typography variant="subtitle1" component="h4" sx={{ lineHeight: 1.3 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                      {item.text}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        ))}

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          {shots.map((s) => (
            <Box component="figure" key={s.label} sx={{ m: 0 }}>
              <BrowserFrame label={`MBTimer – ${s.label} (Demo)`}>
                <Screenshot src={s.src} srcSmall={s.small} width={1440} height={900} alt={s.alt} />
              </BrowserFrame>
              <Typography component="figcaption" variant="body2" sx={{ color: 'text.secondary', mt: 1.5, textAlign: 'center' }}>
                {s.caption} <em>Screenshot aus der Demo mit erfundenen Daten.</em>
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Section>
  );
}
