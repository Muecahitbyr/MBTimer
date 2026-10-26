import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import SiteLayout from './site/layout/SiteLayout';
import HomePage from './site/pages/HomePage';
import ScrollManager from './components/ScrollManager';

const PricingPage = lazy(() => import('./site/pages/PricingPage'));
const ImpressumPage = lazy(() => import('./site/pages/ImpressumPage'));
const DatenschutzPage = lazy(() => import('./site/pages/DatenschutzPage'));
const NotFoundPage = lazy(() => import('./site/pages/NotFoundPage'));
const DemoApp = lazy(() => import('./demo/DemoApp'));

function Loading() {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '50vh' }}>
      <CircularProgress aria-label="Wird geladen" />
    </Box>
  );
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/demo/*" element={<DemoApp />} />
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="preise" element={<PricingPage />} />
            <Route path="impressum" element={<ImpressumPage />} />
            <Route path="datenschutz" element={<DatenschutzPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
