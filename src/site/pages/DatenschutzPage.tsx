import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { provider } from '../../config/legal';
import { usePageMeta } from '../../components/usePageMeta';
import { pageMeta } from '../seo';
import LegalPage from './LegalPage';

function Heading({ children }: { children: ReactNode }) {
  return (
    <Typography variant="h5" component="h2">
      {children}
    </Typography>
  );
}

function List({ items }: { items: ReactNode[] }) {
  return (
    <Box component="ul" sx={{ mt: 0, mb: 1.5, pl: 3, color: 'text.secondary', '& li': { mb: 0.5 } }}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </Box>
  );
}

const mail = (
  <Link href={`mailto:${provider.email}`} underline="always">
    {provider.email}
  </Link>
);

export default function DatenschutzPage() {
  usePageMeta(pageMeta['/datenschutz']);
  return (
    <LegalPage title="Datenschutzerklärung">
      <Typography>
        Mit dieser Datenschutzerklärung informieren wir Sie über die Verarbeitung personenbezogener Daten beim Besuch
        dieser Website (einschließlich der Demo) und bei einer Kontaktaufnahme.
      </Typography>

      <Heading>1. Verantwortliche Stelle</Heading>
      <Typography>
        {provider.company}, Inhaber: {provider.owner}
        {provider.addressLines.map((line) => (
          <span key={line}>
            <br />
            {line}
          </span>
        ))}
        <br />
        E-Mail: {mail}
      </Typography>

      <Heading>2. Allgemeines zur Datenverarbeitung</Heading>
      <Typography>
        Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie
        zur Bearbeitung Ihrer Anfragen erforderlich ist. Rechtsgrundlagen sind insbesondere Art. 6 Abs. 1 lit. b DSGVO
        (Vertrag bzw. vorvertragliche Maßnahmen), Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung) und Art. 6 Abs. 1
        lit. f DSGVO (berechtigte Interessen). Personenbezogene Daten werden gelöscht, sobald der Zweck der Speicherung
        entfällt und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
      </Typography>

      <Heading>3. Hosting und Server-Logfiles</Heading>
      <Typography>
        Diese Website wird bei Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, USA („Vercel“) gehostet und
        über das weltweite Servernetz von Vercel ausgeliefert. Beim Aufruf der Website verarbeitet Vercel automatisch
        Informationen, die Ihr Browser übermittelt, insbesondere:
      </Typography>
      <List
        items={[
          'IP-Adresse',
          'Datum und Uhrzeit des Zugriffs',
          'aufgerufene Seite bzw. Datei',
          'Referrer-URL (zuvor besuchte Seite)',
          'verwendeter Browser und Betriebssystem',
          'aus der IP-Adresse abgeleitete ungefähre Region (Stadt/Land)',
        ]}
      />
      <Typography>
        Die Verarbeitung erfolgt, um die Website auszuliefern sowie ihre Sicherheit und Stabilität zu gewährleisten.
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt in einer sicheren und
        zuverlässigen Bereitstellung der Website. Eine Zusammenführung dieser Daten mit anderen Datenquellen nehmen wir
        nicht vor.
      </Typography>
      <Typography>
        Vercel verarbeitet die Daten in unserem Auftrag auf Grundlage seines Data Processing Addendum (Vertrag zur
        Auftragsverarbeitung nach Art. 28 DSGVO). Dabei können Daten in die USA übermittelt werden. Vercel ist nach dem
        EU-US Data Privacy Framework zertifiziert (Angemessenheitsbeschluss der EU-Kommission, Art. 45 DSGVO); ergänzend
        werden Standardvertragsklauseln eingesetzt. Weitere Informationen:{' '}
        <Link href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" underline="always">
          Datenschutzerklärung von Vercel
        </Link>
        .
      </Typography>

      <Heading>4. SSL-/TLS-Verschlüsselung</Heading>
      <Typography>
        Diese Website nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung
        erkennen Sie an „https://“ in der Adresszeile Ihres Browsers.
      </Typography>

      <Heading>5. Cookies, lokale Speicherung und Tracking</Heading>
      <Typography>
        Diese Website setzt keine Cookies und verwendet keine Analyse-, Tracking- oder Marketing-Werkzeuge. Lokal in Ihrem
        Browser (localStorage) werden ausschließlich gespeichert:
      </Typography>
      <List
        items={[
          'Ihre Auswahl des Farbschemas (hell/dunkel), damit die Website beim nächsten Besuch so angezeigt wird.',
          'Änderungen, die Sie in der Demo vornehmen (siehe Abschnitt 8).',
        ]}
      />
      <Typography>
        Diese Informationen verbleiben auf Ihrem Gerät und werden nicht an uns übertragen. Die Speicherung ist
        unbedingt erforderlich, um die von Ihnen ausdrücklich gewünschten Funktionen bereitzustellen (§ 25 Abs. 2 Nr. 2
        TDDDG). Sie können die Daten jederzeit über die Einstellungen Ihres Browsers löschen.
      </Typography>

      <Heading>6. Schriftarten und externe Inhalte</Heading>
      <Typography>
        Schriftarten werden lokal von unserem Server ausgeliefert. Es werden keine Inhalte von Drittanbietern (z. B.
        Schrift- oder Content-Delivery-Netzwerke, Karten, Videos oder Social-Media-Plugins) eingebunden.
      </Typography>

      <Heading>7. Kontaktaufnahme per E-Mail</Heading>
      <Typography>
        Das Kontaktformular übermittelt keine Daten an einen Server. Beim Absenden öffnet sich Ihr E-Mail-Programm mit
        einer vorbereiteten Nachricht; erst wenn Sie diese E-Mail selbst versenden, erhalten wir Ihre Angaben (z. B. Name,
        Firma, E-Mail-Adresse, Telefonnummer und Nachricht). Gleiches gilt, wenn Sie uns direkt per E-Mail schreiben.
      </Typography>
      <Typography>
        Wir verarbeiten diese Daten, um Ihre Anfrage zu beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, sofern
        Ihre Anfrage auf einen Vertragsschluss gerichtet ist, im Übrigen Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse
        an der Beantwortung von Anfragen). Die Daten werden gelöscht, sobald die Anfrage abschließend bearbeitet ist,
        sofern keine gesetzlichen Aufbewahrungspflichten (z. B. handels- oder steuerrechtliche) entgegenstehen.
      </Typography>

      <Heading>8. Demo</Heading>
      <Typography>
        Die Demo läuft vollständig in Ihrem Browser und enthält ausschließlich erfundene Daten. Es findet keine
        Anmeldung statt, und Ihre Eingaben werden nicht an uns übertragen. Änderungen werden nur lokal in Ihrem Browser
        gespeichert (localStorage) und mit „Demo zurücksetzen“ bzw. spätestens am Folgetag verworfen.
      </Typography>

      <Heading>9. Ihre Rechte</Heading>
      <Typography>Sie haben im Rahmen der gesetzlichen Vorgaben das Recht auf:</Typography>
      <List
        items={[
          'Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)',
          'Berichtigung unrichtiger Daten (Art. 16 DSGVO)',
          'Löschung (Art. 17 DSGVO)',
          'Einschränkung der Verarbeitung (Art. 18 DSGVO)',
          'Datenübertragbarkeit (Art. 20 DSGVO)',
          'Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)',
        ]}
      />
      <Typography sx={{ fontWeight: 600, color: 'text.primary !important' }}>
        Widerspruchsrecht: Soweit wir Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO verarbeiten, können Sie dieser
        Verarbeitung aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit widersprechen (Art. 21
        DSGVO).
      </Typography>
      <Typography>
        Zur Ausübung Ihrer Rechte genügt eine E-Mail an {mail}. Außerdem haben Sie das Recht, sich bei einer
        Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO), etwa bei der für uns zuständigen Landesbeauftragten
        für Datenschutz und Informationsfreiheit Nordrhein-Westfalen.
      </Typography>

      <Heading>10. Pflicht zur Bereitstellung, automatisierte Entscheidungen</Heading>
      <Typography>
        Sie sind nicht verpflichtet, uns personenbezogene Daten bereitzustellen; ohne Ihre Kontaktdaten können wir eine
        Anfrage jedoch nicht beantworten. Eine automatisierte Entscheidungsfindung einschließlich Profiling (Art. 22
        DSGVO) findet nicht statt.
      </Typography>

      <Heading>11. Datenverarbeitung in MBTimer (Produkt)</Heading>
      <Typography>
        Diese Datenschutzerklärung gilt für die Website. Nutzt ein Unternehmen die Software MBTimer, verarbeiten wir die darin
        erfassten Beschäftigtendaten (z. B. Arbeitszeiten und Abwesenheiten) im Auftrag des Unternehmens. Hierfür wird ein
        Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO geschlossen; verantwortlich für diese Daten ist die
        jeweilige Unternehmen als Arbeitgeber.
      </Typography>

      <Heading>12. Änderungen</Heading>
      <Typography>
        Wir passen diese Datenschutzerklärung an, wenn sich die Website oder die Rechtslage ändert. Es gilt die jeweils
        hier veröffentlichte Fassung. Stand: Oktober 2026.
      </Typography>
    </LegalPage>
  );
}
