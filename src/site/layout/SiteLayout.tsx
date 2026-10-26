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
import { Logo } from '../../components/Logo';
import ColorModeToggle from '../../components/ColorModeToggle';
import SkipLink from '../../components/SkipLink';

export default function SiteLayout() {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', overflowX: 'clip' }}
    >
      <SkipLink />
      <AppBar
        position="sticky"
        elevation={0}
        color="inherit"
        sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 1, minHeight: { xs: 60, md: 68 } }}>
            <Box component={RouterLink} to="/" aria-label="MBTimer – zur Startseite" sx={{ textDecoration: 'none', display: 'flex', mr: 2 }}>
              <Logo />
            </Box>
            <Box component="nav" aria-label="Hauptnavigation" sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flex: 1 }}>
              {nav.map((item) => (
                <Button key={item.href} component={RouterLink} to={item.href} color="inherit" sx={{ px: 1.5, fontWeight: 500 }}>
                  {item.label}
                </Button>
              ))}
            </Box>
            <Box sx={{ flex: { xs: 1, md: 0 } }} />
            <ColorModeToggle />
            <Button component={RouterLink} to="/demo" variant="contained" sx={{ display: { xs: 'none', sm: 'inline-flex' }, whiteSpace: 'nowrap' }}>
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

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)} slotProps={{ paper: { id: 'mobile-menu', sx: { width: 280 } } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
          <Logo size={28} />
          <IconButton onClick={() => setOpen(false)} aria-label="Menü schließen">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List component="nav" aria-label="Mobile Navigation">
          {nav.map((item) => (
            <ListItemButton key={item.href} component={RouterLink} to={item.href} onClick={() => setOpen(false)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ p: 2 }}>
          <Button component={RouterLink} to="/demo" variant="contained" fullWidth onClick={() => setOpen(false)}>
            Demo ansehen
          </Button>
        </Box>
      </Drawer>

      <Box component="main" id="inhalt" tabIndex={-1} sx={{ flex: 1, '&:focus': { outline: 'none' } }}>
        <Outlet />
      </Box>

      <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, justifyContent: 'space-between' }}>
            <Box sx={{ maxWidth: 360 }}>
              <Logo size={28} />
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1.5 }}>
                {footer.tagline}
              </Typography>
            </Box>
            <Box component="nav" aria-label="Fußzeile" sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 3 }, alignItems: 'flex-start' }}>
              <Link component={RouterLink} to="/#funktionen" color="text.primary">Funktionen</Link>
              <Link component={RouterLink} to="/preise" color="text.primary">Preise</Link>
              <Link component={RouterLink} to="/demo" color="text.primary">Demo</Link>
              <Link component={RouterLink} to="/#kontakt" color="text.primary">Kontakt</Link>
              <Link component={RouterLink} to="/impressum" color="text.primary">Impressum</Link>
              <Link component={RouterLink} to="/datenschutz" color="text.primary">Datenschutz</Link>
            </Box>
          </Box>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            © {new Date().getFullYear()} {siteConfig.companyName}. Diese Webseite verwendet keine Cookies und kein Tracking.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
