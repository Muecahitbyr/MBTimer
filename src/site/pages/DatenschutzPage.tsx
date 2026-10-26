import Typography from '@mui/material/Typography';
import { usePageMeta } from '../../components/usePageMeta';
import { pageMeta } from '../seo';
import LegalPage from './LegalPage';

export default function DatenschutzPage() {
  usePageMeta(pageMeta['/datenschutz']);
  return (
    <LegalPage title="Datenschutzerklärung">
      <Typography variant="h5" component="h2">1. Verantwortliche Stelle</Typography>
      <Typography>{'{{PLATZHALTER: Name, Anschrift und Kontaktdaten des Verantwortlichen}}'}</Typography>
      <Typography variant="h5" component="h2">2. Hosting</Typography>
      <Typography>{'{{PLATZHALTER: Hosting-Anbieter, Serverstandort, Server-Logfiles, Rechtsgrundlage}}'}</Typography>
      <Typography variant="h5" component="h2">3. Cookies und Tracking</Typography>
      <Typography>
        Diese Webseite setzt keine Cookies und verwendet keine Analyse- oder Tracking-Werkzeuge. Schriftarten werden
        lokal ausgeliefert; es werden keine externen Dienste (z. B. Schrift- oder Content-Delivery-Netzwerke) eingebunden.
        {' '}{'{{PLATZHALTER: Angaben prüfen und ggf. ergänzen}}'}
      </Typography>
      <Typography variant="h5" component="h2">4. Kontaktformular</Typography>
      <Typography>
        Das Kontaktformular übermittelt keine Daten an einen Server. Beim Absenden öffnet sich Ihr E-Mail-Programm mit
        einer vorbereiteten Nachricht; erst wenn Sie diese E-Mail selbst versenden, erhalten wir Ihre Angaben.
        {' '}{'{{PLATZHALTER: Zweck, Rechtsgrundlage und Speicherdauer der Verarbeitung von E-Mail-Anfragen}}'}
      </Typography>
      <Typography variant="h5" component="h2">5. Demo</Typography>
      <Typography>
        Die Demo läuft vollständig in Ihrem Browser und enthält ausschließlich erfundene Daten. Änderungen in der Demo
        werden nur lokal im Speicher Ihres Browsers (localStorage) abgelegt und nicht an uns übertragen. Mit „Demo
        zurücksetzen“ werden sie gelöscht.
      </Typography>
      <Typography variant="h5" component="h2">6. Ihre Rechte</Typography>
      <Typography>{'{{PLATZHALTER: Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Datenübertragbarkeit, Beschwerderecht}}'}</Typography>
      <Typography variant="h5" component="h2">7. Datenverarbeitung in MBzeit (Produkt)</Typography>
      <Typography>{'{{TODO: Hinweise zur Auftragsverarbeitung (AVV) und zu technischen und organisatorischen Maßnahmen}}'}</Typography>
    </LegalPage>
  );
}
