import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { provider } from '../../config/legal';
import { usePageMeta } from '../../components/usePageMeta';
import { pageMeta } from '../seo';
import LegalPage from './LegalPage';

export default function ImpressumPage() {
  usePageMeta(pageMeta['/impressum']);
  return (
    <LegalPage title="Impressum">
      <Typography variant="h5" component="h2">Angaben gemäß § 5 DDG</Typography>
      <Typography>
        {provider.company}
        <br />
        Inhaber: {provider.owner}
        {provider.addressLines.map((line) => (
          <span key={line}>
            <br />
            {line}
          </span>
        ))}
      </Typography>

      <Typography variant="h5" component="h2">Kontakt</Typography>
      <Typography>
        E-Mail:{' '}
        <Link href={`mailto:${provider.email}`} underline="always">
          {provider.email}
        </Link>
      </Typography>

      <Typography variant="h5" component="h2">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</Typography>
      <Typography>
        {provider.owner}
        {provider.addressLines.slice(0, 3).map((line) => (
          <span key={line}>
            <br />
            {line}
          </span>
        ))}
      </Typography>

      <Typography variant="h5" component="h2">Verbraucherstreitbeilegung</Typography>
      <Typography>
        Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
        teilzunehmen (§ 36 VSBG).
      </Typography>

      <Typography variant="h5" component="h2">Haftung für Inhalte</Typography>
      <Typography>
        Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und
        Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Als Diensteanbieter sind wir gemäß § 7 Abs. 1
        DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Verpflichtungen zur
        Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
        Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
        möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
      </Typography>

      <Typography variant="h5" component="h2">Haftung für Links</Typography>
      <Typography>
        Diese Website enthält ggf. Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
        Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten
        ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum
        Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft; rechtswidrige Inhalte waren zu diesem Zeitpunkt
        nicht erkennbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
      </Typography>

      <Typography variant="h5" component="h2">Urheberrecht</Typography>
      <Typography>
        Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
        Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen
        des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Soweit die Inhalte
        auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet.
      </Typography>
    </LegalPage>
  );
}
