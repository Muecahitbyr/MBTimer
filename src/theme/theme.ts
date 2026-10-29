import { createTheme } from '@mui/material/styles';

/** Monospace für Uhrzeiten, Nummern und kleine Beschriftungen (Designrichtung „Präzise“). */
export const MONO = '"JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, monospace';

/**
 * Designrichtung „Präzise“: fast weißer Grund, schwarze Haarlinien, Kobaltblau als einziger Akzent,
 * Inter Tight + JetBrains Mono. Alle Text-/Flächenkombinationen erfüllen WCAG AA.
 */
export const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#2B4BD8', light: '#6B80E6', dark: '#1F37A6', contrastText: '#FFFFFF' },
        secondary: { main: '#111111', contrastText: '#FFFFFF' },
        success: { main: '#2E7D32' },
        warning: { main: '#B85C00' },
        error: { main: '#C62828' },
        background: { default: '#FAFAF8', paper: '#FFFFFF' },
        text: { primary: '#111111', secondary: '#5C5B57' },
        divider: '#E4E2DD',
      },
    },
    dark: {
      palette: {
        primary: { main: '#9AABFF', light: '#C3CDFF', dark: '#6B80E6', contrastText: '#0B0B0A' },
        secondary: { main: '#E4E2DD', contrastText: '#0B0B0A' },
        success: { main: '#81C784' },
        warning: { main: '#FFB74D' },
        error: { main: '#EF9A9A' },
        background: { default: '#121211', paper: '#1A1A18' },
        text: { primary: '#F2F1EE', secondary: '#A8A6A0' },
        divider: 'rgba(242, 241, 238, 0.12)',
      },
    },
  },
  typography: {
    fontFamily: '"Inter Tight Variable", "Inter Tight", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
    h1: { fontWeight: 600, letterSpacing: '-0.045em' },
    h2: { fontWeight: 600, letterSpacing: '-0.035em' },
    h3: { fontWeight: 600, letterSpacing: '-0.03em' },
    h4: { fontWeight: 600, letterSpacing: '-0.025em' },
    h5: { fontWeight: 600, letterSpacing: '-0.02em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    subtitle1: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 },
  },
  // Basis 4 px: sx-Werte wie borderRadius: 2/3/4 ergeben 8/12/16 px.
  shape: { borderRadius: 4 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999,
          padding: '8px 20px',
          variants: [
            // Sekundäre Buttons neutral (Haarlinie), Kobalt bleibt dem Hauptbutton vorbehalten.
            {
              props: { variant: 'outlined', color: 'primary' },
              style: {
                color: 'var(--mui-palette-text-primary)',
                borderColor: 'var(--mbt-line-strong)',
                '&:hover': { borderColor: 'var(--mui-palette-text-primary)', backgroundColor: 'transparent' },
              },
            },
          ],
        },
        sizeLarge: { minHeight: 48, padding: '0 26px', fontSize: '1rem' },
      },
    },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: { root: { borderRadius: 6 } },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    MuiTextField: { defaultProps: { size: 'small' } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 6 } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 12 } } },
    MuiAlert: { styleOverrides: { root: { borderRadius: 6 } } },
    MuiToggleButtonGroup: { styleOverrides: { root: { borderRadius: 999 } } },
    MuiToggleButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
    MuiLinearProgress: { styleOverrides: { root: { borderRadius: 4, height: 8 } } },
    MuiTableCell: { styleOverrides: { head: { fontWeight: 700 } } },
    MuiLink: { defaultProps: { underline: 'hover' } },
  },
});
