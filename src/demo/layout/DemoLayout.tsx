import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import AccessTime from '@mui/icons-material/AccessTime';
import BeachAccessOutlined from '@mui/icons-material/BeachAccessOutlined';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import EditCalendarOutlined from '@mui/icons-material/EditCalendarOutlined';
import PeopleOutline from '@mui/icons-material/PeopleOutlined';
import CampaignOutlined from '@mui/icons-material/CampaignOutlined';
import TabletMacOutlined from '@mui/icons-material/TabletMacOutlined';
import SwapHoriz from '@mui/icons-material/SwapHoriz';
import { Logo } from '../../components/Logo';
import ColorModeToggle from '../../components/ColorModeToggle';
import SkipLink from '../../components/SkipLink';
import DemoBanner from '../components/DemoBanner';
import EmployeeAvatar from '../components/EmployeeAvatar';
import { useDemoUser } from '../store/DemoStore';
import { PRACTICE_NAME, fullName } from '../data/employees';
import { ROLE_LABELS } from '../data/types';
import { can } from '../lib/permissions';

const DRAWER_WIDTH = 248;

export default function DemoLayout() {
  const { user, state, dispatch } = useDemoUser();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data } = state;

  const pendingVacation = can.approveVacation(user.role) ? data.absences.filter((a) => a.status === 'beantragt').length : 0;
  const pendingCorrections = can.approveCorrections(user.role) ? data.corrections.filter((c) => c.status === 'offen').length : 0;

  const items = [
    { to: '/demo/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
    { to: '/demo/zeiterfassung', label: 'Zeiterfassung', icon: <AccessTime /> },
    { to: '/demo/urlaub', label: 'Urlaub', icon: <BeachAccessOutlined />, badge: pendingVacation },
    { to: '/demo/urlaubskalender', label: 'Urlaubskalender', icon: <CalendarMonthOutlined /> },
    { to: '/demo/korrekturen', label: 'Zeitkorrekturen', icon: <EditCalendarOutlined />, badge: pendingCorrections },
    ...(can.manageEmployees(user.role) ? [{ to: '/demo/mitarbeiter', label: 'Mitarbeiter', icon: <PeopleOutline /> }] : []),
    { to: '/demo/neuigkeiten', label: 'Neuigkeiten', icon: <CampaignOutlined /> },
  ];

  const drawer = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2.5 }}>
        <Logo size={30} />
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>{PRACTICE_NAME}</Typography>
      </Box>
      <Divider />
      <List component="nav" aria-label="Demo-Navigation" sx={{ px: 1, py: 1.5 }}>
        {items.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.active': { bgcolor: 'var(--mbz-tint)', color: 'primary.main', fontWeight: 700, '& .MuiListItemIcon-root': { color: 'primary.main' } },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Badge badgeContent={item.badge} color="error">{item.icon}</Badge>
            </ListItemIcon>
            <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontWeight: 'inherit' } } }} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ flex: 1 }} />
      <Divider />
      <List sx={{ px: 1 }}>
        <ListItemButton component={NavLink} to="/demo/kiosk" sx={{ borderRadius: 2 }}>
          <ListItemIcon sx={{ minWidth: 40 }}><TabletMacOutlined /></ListItemIcon>
          <ListItemText primary="Kiosk-Ansicht" secondary="Stempeluhr am Empfang" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <SkipLink target="demo-inhalt" />
      <DemoBanner />
      <Box sx={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Box component="aside" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
          <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} sx={{ display: { xs: 'block', md: 'none' } }} slotProps={{ paper: { sx: { width: DRAWER_WIDTH } } }}>
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            open
            sx={{ display: { xs: 'none', md: 'block' }, height: '100%' }}
            slotProps={{ paper: { sx: { width: DRAWER_WIDTH, position: 'sticky', top: 0, height: '100vh', borderRight: 1, borderColor: 'divider' } } }}
          >
            {drawer}
          </Drawer>
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Toolbar sx={{ gap: 1.5 }}>
              <IconButton edge="start" onClick={() => setMobileOpen(true)} aria-label="Navigation öffnen" sx={{ display: { md: 'none' } }}>
                <MenuIcon />
              </IconButton>
              <Box sx={{ display: { xs: 'none', sm: 'block', md: 'none' } }}>
                <Logo size={26} />
              </Box>
              <Box sx={{ flex: 1 }} />
              <ColorModeToggle />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <EmployeeAvatar employee={user} size={34} />
                <Box sx={{ display: { xs: 'none', sm: 'block' }, lineHeight: 1.2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{fullName(user)}</Typography>
                  <Chip label={ROLE_LABELS[user.role]} size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: 11 }} />
                </Box>
              </Box>
              <Button
                variant="outlined"
                size="small"
                startIcon={<SwapHoriz />}
                onClick={() => {
                  dispatch({ type: 'logout' });
                  navigate('/demo');
                }}
                sx={{ whiteSpace: 'nowrap' }}
              >
                Rolle wechseln
              </Button>
            </Toolbar>
          </AppBar>
          <Box component="main" id="demo-inhalt" tabIndex={-1} sx={{ flex: 1, p: { xs: 2, sm: 3, lg: 4 }, maxWidth: 1400, width: '100%', mx: 'auto', '&:focus': { outline: 'none' } }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
