import type { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { theme } from './theme/theme';

const globalStyles = {
  ':root': { '--mbt-tint': '#F3F2EE', '--mbt-holiday': '#FBF0D2', '--mbt-ink': '#111111', '--mbt-line-strong': '#C9C7C1' },
  ':root.dark': { '--mbt-tint': '#1F1F1C', '--mbt-holiday': '#3A3120', '--mbt-ink': '#F2F1EE', '--mbt-line-strong': '#46443F' },
  html: { scrollBehavior: 'smooth' },
  '@media (prefers-reduced-motion: reduce)': { html: { scrollBehavior: 'auto' } },
} as const;

/** Gemeinsame Provider für Browser (main.tsx) und Prerendering (entry-server.tsx). */
export default function Root({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme} defaultMode="system">
      <CssBaseline enableColorScheme />
      <GlobalStyles styles={globalStyles} />
      {children}
    </ThemeProvider>
  );
}
