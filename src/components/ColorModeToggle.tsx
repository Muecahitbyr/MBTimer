import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';
import { useHydrated } from './useHydrated';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';

export default function ColorModeToggle() {
  const { mode, systemMode, setMode } = useColorScheme();
  const hydrated = useHydrated();
  const current = mode === 'system' ? systemMode : mode;
  // Gespeicherte Auswahl ist erst im Browser bekannt – Platz freihalten, damit nichts springt.
  if (!hydrated || !current) return <Box sx={{ width: 40, height: 40 }} />;
  const next = current === 'dark' ? 'light' : 'dark';
  const label = next === 'dark' ? 'Dunkles Design aktivieren' : 'Helles Design aktivieren';
  return (
    <Tooltip title={label}>
      <IconButton onClick={() => setMode(next)} aria-label={label} color="inherit">
        {current === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
      </IconButton>
    </Tooltip>
  );
}
