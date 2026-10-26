import { createTheme } from '@mui/material/styles';

/** Akzentfarbe „klinisches Blau“, neutrale Grautöne; alle Text-/Flächenkombinationen erfüllen WCAG AA. */
export const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#1D5FA8', light: '#5B8FD0', dark: '#154A85', contrastText: '#FFFFFF' },
        secondary: { main: '#475569', contrastText: '#FFFFFF' },
        success: { main: '#2E7D32' },
        warning: { main: '#B85C00' },
        error: { main: '#C62828' },
        background: { default: '#F6F8FB', paper: '#FFFFFF' },
        text: { primary: '#1A2433', secondary: '#556274' },
        divider: 'rgba(26, 36, 51, 0.12)',
      },
    },
    dark: {
      palette: {
        primary: { main: '#8DB8F0', light: '#B7D2F6', dark: '#5B8FD0', contrastText: '#0B1220' },
        secondary: { main: '#B6C2D2', contrastText: '#0B1220' },
        success: { main: '#81C784' },
        warning: { main: '#FFB74D' },
        error: { main: '#EF9A9A' },
        background: { default: '#0F141B', paper: '#171D26' },
        text: { primary: '#E7ECF3', secondary: '#A3AFBF' },
        divider: 'rgba(231, 236, 243, 0.14)',
      },
    },
  },
  typography: {
    fontFamily: '"Inter Variable", "Inter", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
    h1: { fontWeight: 750, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.015em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  // Basis 4 px: sx-Werte wie borderRadius: 2/3/4 ergeben 8/12/16 px.
  shape: { borderRadius: 4 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 10, padding: '8px 20px' }, sizeLarge: { padding: '12px 26px' } },
    },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: { root: { borderRadius: 16 } },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 600 } } },
    MuiTextField: { defaultProps: { size: 'small' } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 10 } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 16 } } },
    MuiAlert: { styleOverrides: { root: { borderRadius: 10 } } },
    MuiToggleButtonGroup: { styleOverrides: { root: { borderRadius: 10 } } },
    MuiLinearProgress: { styleOverrides: { root: { borderRadius: 4, height: 8 } } },
    MuiTableCell: { styleOverrides: { head: { fontWeight: 700 } } },
    MuiLink: { defaultProps: { underline: 'hover' } },
  },
});
