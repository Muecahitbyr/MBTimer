import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Check from '@mui/icons-material/Check';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { PRICE_DISCLAIMER, pricing, trialNote } from '../../config/pricing';
import Section from '../components/Section';
import BillingToggle from './BillingToggle';
import Calculator from './Calculator';
import TierCards from './TierCards';
import { usePricingState } from './usePricingState';

/**
 * Tarifkarten (+ Kostenrechner). Startseite: kompakt, nur Karten mit Link zu /preise;
 * /preise: vollständig mit „In allen Tarifen enthalten“ und Rechner.
 */
export default function PricingSection({ as = 'h2', compact = false }: { as?: 'h1' | 'h2'; compact?: boolean }) {
  const [state, update] = usePricingState();
  const sub = as === 'h1' ? 'h2' : 'h3';

  return (
    <Section
      id="preise"
      as={as}
      eyebrow="Preise"
      title={compact ? 'Einfache Tarife.' : 'Einfache Tarife – alle Funktionen inklusive'}
      subtitle={compact ? 'Jeder Tarif enthält alle Funktionen.' : 'Der Tarif richtet sich nur nach der Größe Ihres Teams. Jeder Tarif enthält den vollen Funktionsumfang.'}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5, flexWrap: 'wrap' }}>
        <Typography id="tarif-zahlweise" component="span" sx={{ fontWeight: 600 }}>
          Zahlweise:
        </Typography>
        <BillingToggle id="tarif-zahlweise" value={state.billing} onChange={(billing) => update({ billing })} />
      </Box>

      <TierCards state={state} headingLevel={sub} />

      <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 3 }}>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: '1.1rem' }}>{trialNote()}</Typography>
          <Typography variant="body2" role="note" sx={{ mt: 2, maxWidth: 720, p: 1.5, borderRadius: '6px', border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
            {PRICE_DISCLAIMER}
          </Typography>
        </Box>
        {compact && (
          <Button component={RouterLink} to="/preise#rechner" variant="outlined" size="large" endIcon={<ArrowForward />}>
            Kosten berechnen
          </Button>
        )}
      </Box>

      {!compact && (
        <>
          <Box sx={{ mt: 5, p: { xs: 3, md: 4 }, borderRadius: '6px', bgcolor: 'var(--mbt-tint)' }}>
            <Typography variant="h6" component={sub} sx={{ mb: 2 }}>
              In allen Tarifen enthalten
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' }, gap: 1.25 }}>
              {pricing.includedFeatures.map((f) => (
                <Box component="li" key={f} sx={{ display: 'flex', gap: 1 }}>
                  <Check fontSize="small" sx={{ color: 'primary.main', mt: 0.25 }} aria-hidden="true" />
                  {f}
                </Box>
              ))}
            </Box>
          </Box>

          <Calculator state={state} onChange={update} headingLevel={sub} />
        </>
      )}
    </Section>
  );
}
