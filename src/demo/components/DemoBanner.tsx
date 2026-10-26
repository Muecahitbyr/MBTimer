import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ScienceOutlined from '@mui/icons-material/ScienceOutlined';
import { useDemo } from '../store/DemoStore';
import { useNotify } from './Feedback';

/** Gut sichtbarer Hinweis auf allen Demo-Seiten. */
export default function DemoBanner() {
  const { reset } = useDemo();
  const notify = useNotify();
  return (
    <Box
      role="region"
      aria-label="Demo-Hinweis"
      sx={{ bgcolor: '#FFF3CD', color: '#4A3500', borderBottom: '1px solid #E8C96B', px: { xs: 1.5, sm: 2 }, py: 0.75, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', fontSize: { xs: 13, sm: 14 }, position: 'relative', zIndex: 1300 }}
    >
      <ScienceOutlined fontSize="small" aria-hidden="true" />
      <Box component="strong" sx={{ fontWeight: 700 }}>Demo – alle Daten sind erfunden, nichts wird gespeichert</Box>
      <Box component="span" sx={{ display: { xs: 'none', lg: 'inline' } }}>(Änderungen bleiben nur vorübergehend in diesem Browser.)</Box>
      <Box sx={{ flex: 1 }} />
      <Button
        size="small"
        startIcon={<RestartAltIcon />}
        onClick={() => {
          reset();
          notify('Demo wurde zurückgesetzt.', 'info');
        }}
        sx={{ color: 'inherit', py: 0.25, px: 1, minWidth: 0 }}
      >
        Demo zurücksetzen
      </Button>
      <Button component={RouterLink} to="/" size="small" sx={{ color: 'inherit', py: 0.25, px: 1, minWidth: 0, textDecoration: 'underline' }}>
        Zur Webseite
      </Button>
    </Box>
  );
}
