import type { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { theme } from './theme/theme';

const globalStyles = {
  ':root': { '--mbt-tint': '#EEF3FA', '--mbt-holiday': '#FBF0D2' },
  ':root.dark': { '--mbt-tint': '#141B26', '--mbt-holiday': '#3A3120' },
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
