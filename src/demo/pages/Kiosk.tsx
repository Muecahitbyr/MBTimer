import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircle from '@mui/icons-material/CheckCircle';
import WifiOffRounded from '@mui/icons-material/WifiOffRounded';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { Logo } from '../../components/Logo';
import { useDemo } from '../store/DemoStore';
import { employees, fullName, PRACTICE_NAME } from '../data/employees';
import type { Employee } from '../data/types';
import { formatLong } from '../lib/date';
import { presence, type Presence } from '../lib/time';
import EmployeeAvatar from '../components/EmployeeAvatar';
import PinPad from '../components/PinPad';
import { useStamp } from '../components/useStamp';
import { ABSENCE_LABELS } from '../data/types';

function subscribeOnline(cb: () => void) {
  window.addEventListener('online', cb);
  window.addEventListener('offline', cb);
  return () => {
    window.removeEventListener('online', cb);
    window.removeEventListener('offline', cb);
  };
}

function useLiveTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);
  return now;
}

function presenceText(p: Presence): string {
  switch (p.kind) {
    case 'anwesend':
      return `Anwesend seit ${p.since}`;
    case 'gegangen':
      return `Gegangen um ${p.at}`;
    case 'abwesend':
      return ABSENCE_LABELS[p.type];
    case 'frei':
      return 'Heute frei';
    default:
      return 'Nicht eingestempelt';
  }
}

function StampDialog({ employee, onClose }: { employee: Employee; onClose: () => void }) {
  const { open, toggle } = useStamp(employee.id);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [step, setStep] = useState<'pin' | 'aktion' | 'fertig'>('pin');
  const [result, setResult] = useState<{ action: 'kommen' | 'gehen'; time: string } | null>(null);
  const actionRef = useRef<HTMLButtonElement>(null);

  // Nach korrekter PIN den Stempel-Button fokussieren (Tastatur/Screenreader).
  useEffect(() => {
    if (step === 'aktion') actionRef.current?.focus();
  }, [step]);

  const changePin = (v: string) => {
    setError(false);
    setPin(v);
    if (v.length === 4) {
      if (v === employee.pin) setStep('aktion');
      else {
        setError(true);
        window.setTimeout(() => setPin(''), 400);
      }
    }
  };

  useEffect(() => {
    if (step !== 'fertig') return;
    const t = window.setTimeout(onClose, 3500);
    return () => window.clearTimeout(t);
  }, [step, onClose]);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs" aria-labelledby="kiosk-dialog-titel">
      <IconButton onClick={onClose} aria-label="Schließen" sx={{ position: 'absolute', right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ textAlign: 'center', py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <EmployeeAvatar employee={employee} size={64} />
        </Box>
        <Typography id="kiosk-dialog-titel" variant="h5" component="h2" sx={{ mt: 1.5 }}>{fullName(employee)}</Typography>

        {step === 'pin' && (
          <>
            <Typography sx={{ color: 'text.secondary', mt: 0.5, mb: 1 }}>Bitte PIN eingeben</Typography>
            <Box sx={{ display: 'inline-block', px: 1.5, py: 0.5, mb: 2.5, borderRadius: 2, bgcolor: '#FFF3CD', color: '#4A3500', fontSize: 14, fontWeight: 600 }}>
              Demo-PIN: {employee.pin}
            </Box>
            <PinPad value={pin} onChange={changePin} error={error} />
            <Typography role="alert" sx={{ color: 'error.main', mt: 2, minHeight: 24 }}>{error ? 'PIN falsch – bitte erneut versuchen.' : ''}</Typography>
          </>
        )}

        {step === 'aktion' && (
          <Box sx={{ mt: 3, display: 'grid', gap: 1.5 }}>
            <Typography sx={{ color: 'text.secondary' }}>{open ? `Eingestempelt seit ${open.start} Uhr` : 'Noch nicht eingestempelt'}</Typography>
            <Button
              ref={actionRef}
              variant="contained"
              color={open ? 'secondary' : 'primary'}
              size="large"
              sx={{ py: 2.5, fontSize: '1.4rem' }}
              onClick={() => {
                setResult(toggle('kiosk', true));
                setStep('fertig');
              }}
            >
              {open ? 'Gehen' : 'Kommen'}
            </Button>
            <Button onClick={onClose}>Abbrechen</Button>
          </Box>
        )}

        {step === 'fertig' && result && (
          <Box sx={{ mt: 3 }} role="status">
            <CheckCircle color="success" sx={{ fontSize: 64 }} aria-hidden="true" />
            <Typography variant="h6" component="p" sx={{ mt: 1 }}>
              {result.action === 'kommen' ? 'Kommen' : 'Gehen'} gestempelt um {result.time} Uhr
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              {result.action === 'kommen' ? `Einen schönen Arbeitstag, ${employee.firstName}!` : `Schönen Feierabend, ${employee.firstName}!`}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function Kiosk() {
  const { state, clock } = useDemo();
  const online = useSyncExternalStore(subscribeOnline, () => navigator.onLine, () => true);
  const [simulateOffline, setSimulateOffline] = useState(false);
  const [selected, setSelected] = useState<Employee | null>(null);
  const now = useLiveTime();
  const offline = !online || simulateOffline;
  const time = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'var(--mbt-tint)' }}>
      <Box sx={{ bgcolor: '#FFF3CD', color: '#4A3500', borderBottom: '1px solid #E8C96B', px: 2, py: 0.5, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', fontSize: 14 }}>
        <Button component={RouterLink} to="/demo" size="small" startIcon={<ArrowBack />} sx={{ color: 'inherit' }}>Zurück</Button>
        <strong>Demo-Kiosk – alle Daten sind erfunden, PINs werden angezeigt</strong>
        <Box sx={{ flex: 1 }} />
        <FormControlLabel
          control={<Switch size="small" checked={simulateOffline} onChange={(e) => setSimulateOffline(e.target.checked)} />}
          label="Verbindungsabbruch simulieren"
          slotProps={{ typography: { sx: { fontSize: 14 } } }}
        />
      </Box>

      <Box component="header" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: { xs: 2, md: 4 }, py: 2.5, flexWrap: 'wrap' }}>
        <Box>
          <Logo size={34} />
          <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>{PRACTICE_NAME}</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography component="p" sx={{ fontSize: { xs: '2.2rem', md: '3rem' }, fontWeight: 750, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            <time dateTime={now.toISOString()}>{time}</time>
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>{formatLong(clock.today)}</Typography>
        </Box>
      </Box>

      {offline && (
        <Alert severity="error" icon={<WifiOffRounded />} sx={{ mx: { xs: 2, md: 4 }, mb: 2, fontSize: '1rem' }} role="alert">
          <strong>Keine Internetverbindung.</strong> Stempeln ist gerade nicht möglich. Bitte prüfen Sie die Verbindung des Tablets oder wenden Sie sich an die Leitung.
        </Alert>
      )}

      <Box component="main" sx={{ flex: 1, px: { xs: 2, md: 4 }, pb: 4 }}>
        <Typography variant="h5" component="h1" sx={{ mb: 2 }}>Bitte tippen Sie auf Ihren Namen</Typography>
        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 1.5, md: 2 } }}>
          {employees.map((e) => {
            const p = presence(state.data, e.id, clock);
            const here = p.kind === 'anwesend';
            return (
              <Box component="li" key={e.id}>
                <ButtonBase
                  onClick={() => setSelected(e)}
                  disabled={offline}
                  aria-label={`${fullName(e)} – ${presenceText(p)}`}
                  sx={{
                    width: '100%',
                    p: { xs: 1.5, md: 2.5 },
                    borderRadius: 4,
                    bgcolor: 'background.paper',
                    border: 2,
                    borderColor: here ? 'success.main' : 'transparent',
                    boxShadow: '0 4px 14px -8px rgba(16, 36, 66, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    opacity: offline ? 0.5 : 1,
                    transition: 'transform 0.1s',
                    '&:active': { transform: 'scale(0.98)' },
                    '&.Mui-focusVisible': { outline: '3px solid', outlineColor: 'primary.main' },
                  }}
                >
                  <EmployeeAvatar employee={e} size={56} />
                  <Typography sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.15rem' }, textAlign: 'center' }}>
                    {e.firstName} {e.lastName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: 14, color: 'text.secondary' }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: here ? 'success.main' : 'action.disabled' }} />
                    {presenceText(p)}
                  </Box>
                </ButtonBase>
              </Box>
            );
          })}
        </Box>
      </Box>
      {selected && <StampDialog employee={selected} onClose={() => setSelected(null)} />}
    </Box>
  );
}
