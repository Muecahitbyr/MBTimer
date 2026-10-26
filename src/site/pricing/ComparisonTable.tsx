import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Check from '@mui/icons-material/Check';
import Remove from '@mui/icons-material/Remove';
import { pricing, vatNote, type PricingTier } from '../../config/pricing';
import { ca } from './format';
import { visuallyHidden } from '../../components/visuallyHidden';

const yes = (
  <>
    <Check fontSize="small" sx={{ color: 'primary.main', verticalAlign: 'middle' }} aria-hidden="true" />
    <Box component="span" sx={visuallyHidden}>enthalten</Box>
  </>
);
const no = (
  <>
    <Remove fontSize="small" sx={{ color: 'text.disabled', verticalAlign: 'middle' }} aria-hidden="true" />
    <Box component="span" sx={visuallyHidden}>nicht enthalten</Box>
  </>
);

function price(tier: PricingTier, months: number) {
  // Geschützte Leerzeichen: „ca. 49 €“ bricht in schmalen Spalten nicht um.
  return tier.monthlyNet === null ? 'auf Anfrage' : ca(tier.monthlyNet * months).replace(/ /g, '\u00a0');
}

export default function ComparisonTable() {
  const tiers = pricing.tiers;
  // mobileOnly/desktopOnly: Auf dem Handy werden die Funktionszeilen (überall enthalten) zu einer Zeile zusammengefasst.
  const rows: { label: string; cell: (t: PricingTier) => ReactNode; mobileOnly?: boolean; desktopOnly?: boolean }[] = [
    { label: 'Mitarbeiter', cell: (t) => (t.maxEmployees === null ? 'über 50' : `bis ${t.maxEmployees}`) },
    { label: 'Preis monatlich', cell: (t) => price(t, 1) },
    { label: 'Preis jährlich', cell: (t) => price(t, 12 - pricing.yearlyFreeMonths) },
    { label: 'Alle Funktionen', cell: () => yes, mobileOnly: true },
    ...pricing.includedFeatures.map((f) => ({ label: f, cell: () => yes, desktopOnly: true })),
    { label: 'Mehrere Standorte', cell: (t: PricingTier) => (t.extras.some((e) => e.includes('Standorte')) ? yes : no) },
    { label: 'Mehrere Betriebe', cell: (t: PricingTier) => (t.extras.some((e) => e.includes('Betriebe')) ? yes : no) },
    { label: 'Bevorzugter Support', cell: (t: PricingTier) => (t.extras.includes('Bevorzugter Support') ? yes : no) },
  ];

  return (
    <Box sx={{ mt: { xs: 8, md: 10 } }}>
      <Typography variant="h4" component="h2" sx={{ textAlign: 'center', fontSize: { xs: '1.5rem', md: '2rem' } }}>
        Tarife im Vergleich
      </Typography>
      <Typography sx={{ textAlign: 'center', color: 'text.secondary', mt: 1, mb: 3 }}>
        Alle Beträge sind unverbindliche Richtwerte, {vatNote()}
      </Typography>
      <TableContainer sx={{ border: 1, borderColor: 'divider', borderRadius: 4, bgcolor: 'background.paper' }}>
        <Table size="small" sx={{ '& td, & th': { px: { xs: 0.5, sm: 2 }, fontSize: { xs: '0.72rem', sm: '0.875rem' }, '@media (max-width: 359px)': { px: 0.25, fontSize: '0.66rem' } } }}>
          <caption style={{ captionSide: 'bottom' }}>Vergleich der MBTimer-Tarife (Richtwerte, {vatNote()})</caption>
          <TableHead>
            <TableRow>
              <TableCell component="th" scope="col">Leistung</TableCell>
              {tiers.map((t) => (
                <TableCell key={t.id} component="th" scope="col" align="center">{t.name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label} sx={{ display: row.mobileOnly ? { sm: 'none' } : row.desktopOnly ? { xs: 'none', sm: 'table-row' } : undefined }}>
                <TableCell component="th" scope="row">{row.label}</TableCell>
                {tiers.map((t) => (
                  <TableCell key={t.id} align="center">{row.cell(t)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
