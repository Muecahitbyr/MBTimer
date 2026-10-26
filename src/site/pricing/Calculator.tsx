import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { PRICE_DISCLAIMER, pricing, vatNote } from '../../config/pricing';
import { siteConfig } from '../../config/site';
import { calculateEstimate, type NormalizedInput } from './calculate';
import { ca, caCents, employeesLabel, estimateSummary } from './format';
import BillingToggle from './BillingToggle';
import { useRequestContact } from '../useRequestContact';
import { visuallyHidden } from '../../components/visuallyHidden';

const PLUS_LIMIT = 50;

interface CalculatorProps {
  state: NormalizedInput;
  onChange: (patch: Partial<NormalizedInput>) => void;
  headingLevel?: 'h2' | 'h3';
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <Box component="div" sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.75, ...(strong && { mt: 1, pt: 1.75, borderTop: 1, borderColor: 'divider' }) }}>
      <Typography component="dt" sx={{ color: strong ? 'text.primary' : 'text.secondary', fontWeight: strong ? 600 : 400 }}>{label}</Typography>
      <Typography component="dd" sx={{ m: 0, fontWeight: strong ? 700 : 600, textAlign: 'right', whiteSpace: 'nowrap' }}>{value}</Typography>
    </Box>
  );
}

export default function Calculator({ state, onChange, headingLevel = 'h3' }: CalculatorProps) {
  const { minEmployees, maxEmployees } = pricing.calculator;
  const [text, setText] = useState(String(state.employees));
  const [syncedEmployees, setSyncedEmployees] = useState(state.employees);
  const requestContact = useRequestContact();

  // Änderungen von außen (Regler, geteilte URL nach der Hydration) ins Zahlenfeld übernehmen.
  if (state.employees !== syncedEmployees) {
    setSyncedEmployees(state.employees);
    setText(String(state.employees));
  }
  const estimate = calculateEstimate(state, pricing);
  const vatLabel = state.gross ? `inkl. ${Math.round(pricing.vatRate * 100)} % MwSt.` : vatNote();
  const countLabel = employeesLabel(state.employees, PLUS_LIMIT);

  const setEmployees = (n: number) => {
    setText(String(n));
    onChange({ employees: n });
  };

  const summary =
    estimate.kind === 'priced'
      ? estimateSummary(estimate, vatLabel)
      : `Beispielrechnung: ${countLabel} Mitarbeiter – bitte individuelle Kalkulation.`;
  const liveText =
    estimate.kind === 'priced'
      ? `Tarif ${estimate.tier.name}, ${ca(estimate.perMonth)} pro Monat, ${ca(estimate.perYear)} pro Jahr.`
      : 'Mehr als 50 Mitarbeiter: individuelle Kalkulation.';
  const mailto = `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent('Unverbindliche Anfrage zu MBzeit')}&body=${encodeURIComponent(`${summary}\n\n`)}`;

  return (
    <Box id="rechner" sx={{ scrollMarginTop: 80, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: { xs: 7, md: 9 } }}>
      <Card component="form" aria-labelledby="rechner-titel" onSubmit={(e) => e.preventDefault()}>
        <CardContent sx={{ p: { xs: 3, md: 4 }, display: 'grid', gap: 3.5 }}>
          <Box>
            <Typography id="rechner-titel" variant="h5" component={headingLevel}>Kostenrechner</Typography>
            <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>Grobe Orientierung in wenigen Sekunden.</Typography>
          </Box>

          <Box>
            <Typography id="ma-label" component="label" htmlFor="ma-input" sx={{ fontWeight: 600, display: 'block' }}>
              Anzahl Mitarbeiter
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 1 }}>
              <Slider
                value={state.employees}
                min={minEmployees}
                max={maxEmployees}
                step={1}
                onChange={(_, v) => setEmployees(v as number)}
                aria-labelledby="ma-label"
                getAriaValueText={(v) => (v > PLUS_LIMIT ? 'mehr als 50 Mitarbeiter' : `${v} Mitarbeiter`)}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => employeesLabel(v, PLUS_LIMIT)}
                marks={[
                  { value: 1, label: '1' },
                  { value: 10, label: '10' },
                  { value: 25, label: '25' },
                  { value: 50, label: '50' },
                  { value: 60, label: '50+' },
                ]}
                sx={{ flex: 1, mx: 1 }}
              />
              <TextField
                id="ma-input"
                type="number"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  const n = Number(e.target.value);
                  if (e.target.value !== '' && Number.isInteger(n) && n >= minEmployees && n <= maxEmployees) onChange({ employees: n });
                }}
                onBlur={() => {
                  const n = calculateEstimate({ employees: text }, pricing).input.employees;
                  setEmployees(n);
                }}
                slotProps={{ htmlInput: { min: minEmployees, max: maxEmployees, step: 1, inputMode: 'numeric', 'aria-describedby': 'ma-hint' } }}
                sx={{ width: 96 }}
              />
            </Box>
            <Typography id="ma-hint" variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {state.employees > PLUS_LIMIT ? 'Über 50 Mitarbeiter („50+“): individuelle Kalkulation.' : `Ausgewählt: ${state.employees} Mitarbeiter`}
            </Typography>
          </Box>

          <Box>
            <Typography id="zahlweise-label" sx={{ fontWeight: 600, mb: 1 }}>Zahlweise</Typography>
            <BillingToggle id="zahlweise-label" value={state.billing} onChange={(billing) => onChange({ billing })} />
          </Box>

          <Box>
            <FormControlLabel
              control={<Checkbox checked={state.setup} onChange={(e) => onChange({ setup: e.target.checked })} />}
              label={
                <span>
                  <strong>{pricing.setupService.label}</strong> dazu ({ca(pricing.setupService.price)} einmalig)
                </span>
              }
              aria-describedby="setup-desc"
            />
            <Typography id="setup-desc" variant="body2" sx={{ color: 'text.secondary', ml: 4 }}>
              {pricing.setupService.items.join(', ')}.
            </Typography>
          </Box>

          {pricing.vatMode === 'net' && (
            <FormControlLabel
              control={<Switch checked={state.gross} onChange={(e) => onChange({ gross: e.target.checked })} />}
              label="Beträge brutto anzeigen"
            />
          )}
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: 'var(--mbz-tint)', borderColor: 'transparent' }} aria-labelledby="ergebnis-titel">
        <CardContent sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Typography id="ergebnis-titel" variant="h5" component={headingLevel}>Ihre Beispielrechnung</Typography>
          <Box aria-live="polite" aria-atomic="true" sx={visuallyHidden}>{liveText}</Box>

          {estimate.kind === 'custom' ? (
            <Box sx={{ mt: 2, flex: 1 }}>
              <Typography sx={{ fontSize: '1.15rem' }}>
                Für {countLabel} Mitarbeiter: <strong>Tarif {estimate.tier.name}</strong>.
              </Typography>
              <Typography sx={{ mt: 1.5, color: 'text.secondary' }}>
                Für Ihre Praxisgröße erstellen wir gern eine individuelle Kalkulation.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ mt: 2, flex: 1 }}>
              <Typography>
                Für {estimate.input.employees} Mitarbeiter passt der Tarif <strong>{estimate.tier.name}</strong> (bis {estimate.tier.maxEmployees}).
              </Typography>
              <Box sx={{ my: 2.5 }}>
                <Typography component="p" sx={{ lineHeight: 1.1 }}>
                  <Box component="span" sx={{ fontSize: { xs: '2.4rem', md: '2.8rem' }, fontWeight: 750, color: 'primary.main' }}>
                    {ca(estimate.perMonth)}
                  </Box>{' '}
                  <Box component="span" sx={{ color: 'text.secondary' }}>pro Monat</Box>
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  {estimate.input.billing === 'jahr' ? 'bei jährlicher Zahlung, ' : 'bei monatlicher Zahlung, '}
                  {vatLabel}
                </Typography>
              </Box>
              <Box component="dl" sx={{ m: 0 }}>
                <Row label="pro Jahr" value={ca(estimate.perYear)} />
                <Row label="pro Mitarbeiter und Monat" value={caCents(estimate.perEmployeeMonth)} />
                {estimate.input.setup && <Row label="Einrichtung (einmalig)" value={ca(estimate.setup)} />}
                <Row label="Gesamtkosten im ersten Jahr" value={ca(estimate.firstYearTotal)} strong />
              </Box>
              {estimate.input.billing === 'jahr' ? (
                <Alert severity="success" sx={{ mt: 2 }}>Sie sparen {ca(estimate.yearlySavings)} pro Jahr.</Alert>
              ) : (
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                  Tipp: Bei jährlicher Zahlung sparen Sie {ca(estimate.yearlySavings)} pro Jahr.
                </Typography>
              )}
              {estimate.upgradeHint && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  {estimate.upgradeHint.nextTier.monthlyNet === null
                    ? `Bei Wachstum über ${estimate.upgradeHint.limit} Mitarbeiter erstellen wir gern eine individuelle Kalkulation.`
                    : `Bei Wachstum über ${estimate.upgradeHint.limit} Mitarbeiter wechseln Sie einfach in ${estimate.upgradeHint.nextTier.name}.`}
                </Alert>
              )}
            </Box>
          )}

          <Typography variant="body2" sx={{ mt: 3, p: 1.5, borderRadius: 2, border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
            {PRICE_DISCLAIMER}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mt: 2.5 }}>
            <Button variant="contained" size="large" onClick={() => requestContact(summary)}>
              Unverbindlich anfragen
            </Button>
            <Link href={mailto} variant="body2">oder direkt per E-Mail</Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
