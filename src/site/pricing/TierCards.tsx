import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Check from '@mui/icons-material/Check';
import { pricing, vatNote, type PricingTier } from '../../config/pricing';
import { calculateEstimate, type NormalizedInput } from './calculate';
import { ca } from './format';
import { useRequestContact } from '../useRequestContact';
import { MONO } from '../../theme/theme';
import { visuallyHidden } from '../../components/visuallyHidden';

function tierLimit(tier: PricingTier): string {
  return tier.maxEmployees === null ? 'über 50 Mitarbeiter' : `bis ${tier.maxEmployees} Mitarbeiter`;
}

export default function TierCards({ state, headingLevel = 'h3' }: { state: NormalizedInput; headingLevel?: 'h2' | 'h3' }) {
  const requestContact = useRequestContact();
  const vatLabel = state.gross ? `inkl. ${Math.round(pricing.vatRate * 100)} % MwSt.` : vatNote();

  return (
    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 2.5, alignItems: 'stretch' }}>
      {pricing.tiers.map((tier) => {
        const estimate = tier.maxEmployees !== null ? calculateEstimate({ employees: tier.maxEmployees, billing: state.billing, gross: state.gross }, pricing) : null;
        const highlighted = Boolean(tier.badge);
        const isCustom = !estimate || estimate.kind === 'custom';
        const features = [tierLimit(tier), 'Alle Funktionen inklusive', 'Kiosk-Tablet als Stempeluhr', 'Urlaub, Krankmeldungen & Korrekturen', ...tier.extras];
        return (
          <Box component="li" key={tier.id} sx={{ display: 'flex' }}>
            <Card
              aria-labelledby={`tarif-${tier.id}`}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                position: 'relative',
                overflow: 'visible',
                ...(highlighted && { borderColor: 'var(--mbt-ink)', borderWidth: 1.5 }),
              }}
            >
              {tier.badge && (
                <Chip label={tier.badge.toUpperCase()} size="small" sx={{ position: 'absolute', top: -12, left: 24, bgcolor: 'var(--mbt-ink)', color: 'background.default', fontFamily: MONO, fontSize: 11, letterSpacing: '0.06em' }} />
              )}
              <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Typography id={`tarif-${tier.id}`} variant="h5" component={headingLevel}>
                  {tier.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', minHeight: 40, mt: 0.5 }}>
                  {tier.tagline}
                </Typography>
                <Box sx={{ my: 2.5, minHeight: 84 }}>
                  {isCustom ? (
                    <>
                      <Typography sx={{ fontSize: '2.2rem', fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1.2 }}>auf Anfrage</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>individuelle Kalkulation</Typography>
                    </>
                  ) : (
                    <>
                      <Typography sx={{ lineHeight: 1.2 }}>
                        <Box component="span" sx={{ fontSize: '2.2rem', fontWeight: 600, letterSpacing: '-0.04em' }}>
                          {ca(state.billing === 'jahr' ? estimate.perYear : estimate.perMonth)}
                        </Box>
                        <Box component="span" sx={{ color: 'text.secondary' }}>
                          {state.billing === 'jahr' ? '/Jahr' : '/Monat'}
                        </Box>
                      </Typography>
                      {state.billing === 'jahr' && (
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          entspricht {ca(estimate.perMonth)}/Monat
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{vatLabel}</Typography>
                    </>
                  )}
                </Box>
                <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mb: 3, display: 'grid', gap: 1, flex: 1, alignContent: 'start' }}>
                  {features.map((f) => (
                    <Box component="li" key={f} sx={{ display: 'flex', gap: 1, fontSize: '0.95rem' }}>
                      <Check fontSize="small" sx={{ color: 'primary.main', mt: 0.25 }} aria-hidden="true" />
                      {f}
                    </Box>
                  ))}
                </Box>
                <Button
                  variant={highlighted ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() =>
                    requestContact(
                      isCustom
                        ? 'Ich interessiere mich für eine individuelle Kalkulation (über 50 Mitarbeiter oder mehrere Betriebe).'
                        : `Ich möchte MBTimer ${pricing.trialDays} Tage kostenlos testen (Tarif ${tier.name}).`,
                    )
                  }
                >
                  {isCustom ? 'Unverbindlich anfragen' : 'Kostenlos testen'}
                  <Box component="span" sx={visuallyHidden}>
                    {' '}– Tarif {tier.name}
                  </Box>
                </Button>
              </CardContent>
            </Card>
          </Box>
        );
      })}
    </Box>
  );
}
