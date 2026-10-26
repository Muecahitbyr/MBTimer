import type { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DemoProvider, useDemo } from './store/DemoStore';
import { FeedbackProvider } from './components/Feedback';
import DemoLayout from './layout/DemoLayout';
import DemoLogin from './pages/DemoLogin';
import Dashboard from './pages/Dashboard';
import Zeiterfassung from './pages/Zeiterfassung';
import Urlaub from './pages/Urlaub';
import Urlaubskalender from './pages/Urlaubskalender';
import Korrekturen from './pages/Korrekturen';
import Mitarbeiter from './pages/Mitarbeiter';
import Neuigkeiten from './pages/Neuigkeiten';
import Kiosk from './pages/Kiosk';
import { can } from './lib/permissions';
import { usePageMeta } from '../components/usePageMeta';
import { pageMeta } from '../site/seo';

function RequireUser() {
  const { user } = useDemo();
  if (!user) return <Navigate to="/demo" replace />;
  return <DemoLayout />;
}

function AdminOnly({ children }: { children: ReactElement }) {
  const { user } = useDemo();
  return user && can.manageEmployees(user.role) ? children : <Navigate to="/demo/dashboard" replace />;
}

export default function DemoApp() {
  usePageMeta(pageMeta['/demo']);
  return (
    <DemoProvider>
      <FeedbackProvider>
        <Routes>
          <Route index element={<DemoLogin />} />
          <Route path="kiosk" element={<Kiosk />} />
          <Route element={<RequireUser />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="zeiterfassung" element={<Zeiterfassung />} />
            <Route path="urlaub" element={<Urlaub />} />
            <Route path="urlaubskalender" element={<Urlaubskalender />} />
            <Route path="korrekturen" element={<Korrekturen />} />
            <Route path="mitarbeiter" element={<AdminOnly><Mitarbeiter /></AdminOnly>} />
            <Route path="neuigkeiten" element={<Neuigkeiten />} />
          </Route>
          <Route path="*" element={<Navigate to="/demo" replace />} />
        </Routes>
      </FeedbackProvider>
    </DemoProvider>
  );
}
