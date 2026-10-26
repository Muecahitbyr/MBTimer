import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Check from '@mui/icons-material/Check';
import { PRICE_DISCLAIMER, pricing, trialNote } from '../../config/pricing';
import Section from '../components/Section';
import BillingToggle from './BillingToggle';
import Calculator from './Calculator';
import TierCards from './TierCards';
import { usePricingState } from './usePricingState';

/** Tarifkarten + Kostenrechner, auf Startseite (#preise) und unter /preise. */
export default function PricingSection({ as = 'h2' }: { as?: 'h1' | 'h2' }) {
  const [state, update] = usePricingState();
  const sub = as === 'h1' ? 'h2' : 'h3';

  return (
    <Section
      id="preise"
      as={as}
      eyebrow="Preise"
      title="Einfache Tarife – alle Funktionen inklusive"
      subtitle="Der Tarif richtet sich nur nach der Größe Ihres Teams. Jeder Tarif enthält den vollen Funktionsumfang."
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 5, flexWrap: 'wrap' }}>
        <Typography id="tarif-zahlweise" component="span" sx={{ fontWeight: 600 }}>
          Zahlweise:
        </Typography>
        <BillingToggle id="tarif-zahlweise" value={state.billing} onChange={(billing) => update({ billing })} />
      </Box>

      <TierCards state={state} headingLevel={sub} />

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography sx={{ fontWeight: 600, fontSize: '1.1rem' }}>{trialNote()}</Typography>
        <Typography variant="body2" role="note" sx={{ mt: 2, maxWidth: 720, mx: 'auto', p: 1.5, borderRadius: 2, border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          {PRICE_DISCLAIMER}
        </Typography>
      </Box>

      <Box sx={{ mt: 5, p: { xs: 3, md: 4 }, borderRadius: 4, bgcolor: 'var(--mbz-tint)' }}>
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
    </Section>
  );
}
