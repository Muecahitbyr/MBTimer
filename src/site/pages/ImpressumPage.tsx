import Typography from '@mui/material/Typography';
import { usePageMeta } from '../../components/usePageMeta';
import { pageMeta } from '../seo';
import LegalPage from './LegalPage';

export default function ImpressumPage() {
  usePageMeta(pageMeta['/impressum']);
  return (
    <LegalPage title="Impressum">
      <Typography variant="h5" component="h2">Angaben gemäß § 5 DDG</Typography>
      <Typography>
        {'{{FIRMENNAME}}'}<br />
        {'{{STRASSE UND HAUSNUMMER}}'}<br />
        {'{{PLZ ORT}}'}
      </Typography>
      <Typography variant="h5" component="h2">Vertreten durch</Typography>
      <Typography>{'{{NAME DER VERTRETUNGSBERECHTIGTEN PERSON}}'}</Typography>
      <Typography variant="h5" component="h2">Kontakt</Typography>
      <Typography>
        Telefon: {'{{TELEFON}}'}<br />
        E-Mail: {'{{E-MAIL}}'}
      </Typography>
      <Typography variant="h5" component="h2">Registereintrag</Typography>
      <Typography>{'{{REGISTERGERICHT UND REGISTERNUMMER – falls vorhanden}}'}</Typography>
      <Typography variant="h5" component="h2">Umsatzsteuer-ID</Typography>
      <Typography>{'{{UMSATZSTEUER-IDENTIFIKATIONSNUMMER – falls vorhanden}}'}</Typography>
      <Typography variant="h5" component="h2">Verantwortlich für den Inhalt</Typography>
      <Typography>{'{{NAME UND ANSCHRIFT}}'}</Typography>
      <Typography variant="h5" component="h2">Verbraucherstreitbeilegung</Typography>
      <Typography>{'{{PLATZHALTER: Hinweis zur Teilnahme an Streitbeilegungsverfahren}}'}</Typography>
    </LegalPage>
  );
}
