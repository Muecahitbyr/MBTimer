import { useState, type FormEvent } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MailOutline from '@mui/icons-material/MailOutlined';
import { contact, siteConfig } from '../../config/site';
import Section from '../components/Section';

interface FormState {
  name: string;
  praxis: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactSection() {
  const location = useLocation();
  const incoming = (location.state as { message?: string } | null)?.message;
  const [form, setForm] = useState<FormState>({ name: '', praxis: '', email: '', phone: '', message: incoming ?? '', consent: false });
  const [seenKey, setSeenKey] = useState(location.key);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  // Vorbelegung aus Preisrechner/Tarifkarten übernehmen (bei jeder neuen Navigation).
  if (location.key !== seenKey) {
    setSeenKey(location.key);
    if (incoming) setForm((f) => ({ ...f, message: incoming }));
  }

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = 'Bitte geben Sie Ihren Namen an.';
    if (!EMAIL_RE.test(form.email.trim())) next.email = 'Bitte geben Sie eine gültige E-Mail-Adresse an.';
    if (!form.message.trim()) next.message = 'Bitte schreiben Sie uns eine Nachricht.';
    if (!form.consent) next.consent = 'Bitte bestätigen Sie den Hinweis zum Datenschutz.';
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.getElementById(`kontakt-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    const subject = `Anfrage zu MBzeit${form.praxis ? ` – ${form.praxis}` : ''}`;
    const body = [
      form.message.trim(),
      '',
      '---',
      `Name: ${form.name}`,
      form.praxis && `Praxis: ${form.praxis}`,
      `E-Mail: ${form.email}`,
      form.phone && `Telefon: ${form.phone}`,
    ]
      .filter((l) => l !== '')
      .join('\n');
    window.location.href = `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <Section id="kontakt" eyebrow="Kontakt" title={contact.title} subtitle={contact.text} tinted>
      <Card sx={{ maxWidth: 760, mx: 'auto' }}>
        <CardContent component="form" noValidate onSubmit={onSubmit} sx={{ p: { xs: 3, md: 4 }, display: 'grid', gap: 2.5 }} aria-label="Kontaktformular">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
            <TextField id="kontakt-name" label="Name" required value={form.name} onChange={(e) => set('name', e.target.value)} error={!!errors.name} helperText={errors.name} autoComplete="name" size="medium" />
            <TextField id="kontakt-praxis" label="Praxis" value={form.praxis} onChange={(e) => set('praxis', e.target.value)} autoComplete="organization" size="medium" />
            <TextField id="kontakt-email" label="E-Mail" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} error={!!errors.email} helperText={errors.email} autoComplete="email" size="medium" />
            <TextField id="kontakt-phone" label="Telefon (optional)" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" size="medium" />
          </Box>
          <TextField id="kontakt-message" label="Nachricht" required multiline minRows={5} value={form.message} onChange={(e) => set('message', e.target.value)} error={!!errors.message} helperText={errors.message} size="medium" />
          <Box>
            <FormControlLabel
              control={<Checkbox id="kontakt-consent" checked={form.consent} onChange={(e) => set('consent', e.target.checked)} />}
              label={
                <span>
                  Ich habe die <Link component={RouterLink} to="/datenschutz" underline="always">Datenschutzhinweise</Link> gelesen.
                </span>
              }
            />
            {errors.consent && (
              <Typography variant="body2" color="error" role="alert" sx={{ ml: 4 }}>
                {errors.consent}
              </Typography>
            )}
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{contact.mailNote}</Typography>
          <Box>
            <Button type="submit" variant="contained" size="large" startIcon={<MailOutline />}>
              Nachricht im E-Mail-Programm öffnen
            </Button>
          </Box>
          {submitted && (
            <Alert severity="success" role="status">
              Ihr E-Mail-Programm sollte sich jetzt öffnen. Falls nicht, schreiben Sie uns direkt an{' '}
              <Link href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</Link>.
            </Alert>
          )}
        </CardContent>
      </Card>
    </Section>
  );
}
