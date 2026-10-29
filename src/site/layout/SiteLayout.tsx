import { useState } from 'react';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { footer, nav, siteConfig } from '../../config/site';
import { pricedTiers, pricing, trialNote, vatNote } from '../../config/pricing';
import { Logo } from '../../components/Logo';
import ColorModeToggle from '../../components/ColorModeToggle';
import SkipLink from '../../components/SkipLink';
import { MONO } from '../../theme/theme';
import { ca } from '../pricing/format';

const cheapest = Math.min(...pricedTiers().map((t) => t.monthlyNet ?? Infinity));

/** Schwarzer Abschlussblock mit Einstiegspreis (Designrichtung „Präzise“). */
function PriceBand() {
  return (
    <Box component="section" aria-labelledby="preisband" sx={{ bgcolor: '#111111', color: '#FAFAF8' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 11 }, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 5 }}>
        <Box>
          <Typography component="p" sx={{ fontFamily: MONO, fontSize: 13, letterSpacing: '0.06em', color: '#A8A6A0', mb: 2 }}>
            PREISE · ALLE FUNKTIONEN INKLUSIVE
          </Typography>
          <Typography id="preisband" variant="h2" component="h2" sx={{ fontSize: { xs: '2.4rem', md: '4.5rem' }, lineHeight: 1 }}>
            ab {ca(cheapest)} im Monat
          </Typography>
          <Typography sx={{ mt: 2, color: '#C9C7C1' }}>
            {vatNote(pricing)} · {trialNote(pricing)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          <Button component={RouterLink} to="/preise#rechner" size="large" sx={{ bgcolor: '#FAFAF8', color: '#111111', '&:hover': { bgcolor: '#E4E2DD' } }}>
            Kosten berechnen
          </Button>
          <Button component={RouterLink} to="/#kontakt" size="large" variant="outlined" sx={{ color: '#FAFAF8', borderColor: '#6B6A66', '&:hover': { borderColor: '#FAFAF8' } }}>
            Unverbindlich anfragen
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default function SiteLayout() {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', overflowX: 'clip' }}>
      <SkipLink />
      <AppBar position="sticky" elevation={0} color="inherit" sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 1, minHeight: { xs: 64, md: 72 } }}>
            <Box component={RouterLink} to="/" aria-label="MBTimer – zur Startseite" sx={{ textDecoration: 'none', display: 'flex', mr: 3 }}>
              <Logo tagline="Zeiterfassung" />
            </Box>
            <Box sx={{ flex: 1 }} />
            <Box component="nav" aria-label="Hauptnavigation" sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, mr: 1 }}>
              {nav.map((item) => (
                <Button key={item.href} component={RouterLink} to={item.href} color="inherit" sx={{ px: 1.5, fontWeight: 500 }}>
                  {item.label}
                </Button>
              ))}
            </Box>
            <ColorModeToggle />
            <Button component={RouterLink} to="/demo" variant="outlined" sx={{ display: { xs: 'none', sm: 'inline-flex' }, whiteSpace: 'nowrap', ml: 1 }}>
              Demo ansehen
            </Button>
            <IconButton
              onClick={() => setOpen(true)}
              aria-label="Menü öffnen"
              aria-controls="mobile-menu"
              aria-expanded={open}
              sx={{ display: { md: 'none' } }}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} slotProps={{ paper: { id: 'mobile-menu', sx: { width: 300 } } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
          <Logo size={28} />
          <IconButton onClick={() => setOpen(false)} aria-label="Menü schließen">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List component="nav" aria-label="Mobile Navigation">
          {nav.map((item, i) => (
            <ListItemButton key={item.href} component={RouterLink} to={item.href} onClick={() => setOpen(false)} sx={{ gap: 2 }}>
              <Box component="span" sx={{ fontFamily: MONO, fontSize: 12, color: 'text.secondary' }}>{String(i + 1).padStart(2, '0')}</Box>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ p: 2 }}>
          <Button component={RouterLink} to="/demo" variant="contained" fullWidth size="large" onClick={() => setOpen(false)}>
            Demo ansehen
          </Button>
        </Box>
      </Drawer>

      <Box component="main" id="inhalt" tabIndex={-1} sx={{ flex: 1, '&:focus': { outline: 'none' } }}>
        <Outlet />
      </Box>

      <PriceBand />
      <Box component="footer" sx={{ bgcolor: 'background.default' }}>
        <Container maxWidth="lg" sx={{ py: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 2 }}>
            <Logo size={26} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              © {new Date().getFullYear()} {siteConfig.companyName} · {footer.tagline}
            </Typography>
          </Box>
          <Box component="nav" aria-label="Fußzeile" sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 3 }, fontSize: 14 }}>
            <Link component={RouterLink} to="/preise" color="text.secondary">Preise</Link>
            <Link component={RouterLink} to="/demo" color="text.secondary">Demo</Link>
            <Link component={RouterLink} to="/#kontakt" color="text.secondary">Kontakt</Link>
            <Link component={RouterLink} to="/impressum" color="text.secondary">Impressum</Link>
            <Link component={RouterLink} to="/datenschutz" color="text.secondary">Datenschutz</Link>
          </Box>
        </Container>
        <Container maxWidth="lg" sx={{ pb: 4 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Diese Webseite verwendet keine Cookies und kein Tracking.</Typography>
        </Container>
      </Box>
    </Box>
  );
}
