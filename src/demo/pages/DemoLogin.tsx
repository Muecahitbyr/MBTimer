import { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TabletMacOutlined from '@mui/icons-material/TabletMacOutlined';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { Logo } from '../../components/Logo';
import { MONO } from '../../theme/theme';
import DemoBanner from '../components/DemoBanner';
import EmployeeAvatar from '../components/EmployeeAvatar';
import { useDemo } from '../store/DemoStore';
import { DEMO_PERSONAS, PRACTICE_NAME, employees, fullName } from '../data/employees';

export default function DemoLogin() {
  const { user, dispatch } = useDemo();
  const navigate = useNavigate();

  // Weiterleitung erst nach dem Hydrieren: Das vorgerenderte HTML kennt den gespeicherten Demo-Zustand nicht.
  useEffect(() => {
    if (user) navigate('/demo/dashboard', { replace: true });
  }, [user, navigate]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <DemoBanner />
      <Container maxWidth="md" component="main" sx={{ py: { xs: 5, md: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box component={RouterLink} to="/" aria-label="Zur MBTimer-Webseite" sx={{ display: 'inline-flex', textDecoration: 'none' }}>
            <Logo size={40} />
          </Box>
          <Chip label="DEMO-ZUGANG" variant="outlined" sx={{ display: 'flex', width: 'fit-content', mx: 'auto', mt: 2, fontFamily: MONO, fontSize: 12, letterSpacing: '0.06em', borderColor: 'var(--mbt-line-strong)' }} />
          <Typography variant="h3" component="h1" sx={{ mt: 2, fontSize: { xs: '1.9rem', md: '2.4rem' } }}>
            MBTimer ausprobieren
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 1.5, maxWidth: 560, mx: 'auto' }}>
            Wählen Sie eine Rolle – ganz ohne Passwort. Sie sehen die fiktive „{PRACTICE_NAME}“ mit {employees.length} erfundenen
            Mitarbeitern und Daten der letzten Monate.
          </Typography>
        </Box>

        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          {DEMO_PERSONAS.map((p) => {
            const emp = employees.find((e) => e.id === p.employeeId)!;
            return (
              <Box component="li" key={p.employeeId} sx={{ minWidth: 0 }}>
                <Card sx={{ height: '100%' }}>
                  <CardActionArea
                    onClick={() => {
                      dispatch({ type: 'login', employeeId: emp.id });
                      navigate('/demo/dashboard');
                    }}
                    sx={{ height: '100%', p: 0.5 }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <EmployeeAvatar employee={emp} size={44} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="h6" component="h2" sx={{ lineHeight: 1.2 }}>
                            Als {p.title} anmelden
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {fullName(emp)} · {emp.position}
                          </Typography>
                        </Box>
                        <ArrowForward color="primary" aria-hidden="true" />
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1.5 }}>{p.description}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Box>
            );
          })}
        </Box>

        <Card sx={{ mt: 3, bgcolor: 'var(--mbt-tint)', borderColor: 'transparent' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <TabletMacOutlined color="primary" sx={{ fontSize: 40 }} aria-hidden="true" />
            <Box sx={{ flex: 1, minWidth: 220 }}>
              <Typography variant="h6" component="h2">Kiosk-Stempeluhr</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                So sieht die Stempeluhr auf dem Tablet aus. Die Demo-PINs werden angezeigt.
              </Typography>
            </Box>
            <Button component={RouterLink} to="/demo/kiosk" variant="contained">Kiosk öffnen</Button>
          </CardContent>
        </Card>

        <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', mt: 4 }}>
          Dies ist kein echter Login. Alle Personen, Zeiten und E-Mail-Adressen (@example.com) sind erfunden.
        </Typography>
      </Container>
    </Box>
  );
}
