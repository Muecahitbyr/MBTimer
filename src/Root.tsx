import type { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { theme } from './theme/theme';

const globalStyles = {
  ':root': { '--mbz-tint': '#EEF3FA' },
  ':root.dark': { '--mbz-tint': '#141B26' },
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
