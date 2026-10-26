import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { createInitialData } from '../data/initialState';
import { employees } from '../data/employees';
import type { Employee } from '../data/types';
import { todayISO } from '../lib/date';
import { currentClock, type Clock } from '../lib/time';
import { demoReducer, type DemoAction, type DemoState } from './reducer';

const STORAGE_KEY = 'mbtimer-demo-v1';

function freshState(): DemoState {
  return { data: createInitialData(todayISO()), currentUserId: null };
}

/** Lädt den Demo-Zustand aus localStorage – nur, wenn er vom selben Tag stammt (Daten sind relativ zu heute). */
function loadState(): DemoState {
  if (typeof window === 'undefined') return freshState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoState;
      if (parsed?.data?.generatedFor === todayISO() && Array.isArray(parsed.data.entries)) return parsed;
    }
  } catch {
    // localStorage nicht verfügbar oder beschädigt – mit frischen Daten starten.
  }
  return freshState();
}

interface DemoContextValue {
  state: DemoState;
  dispatch: (action: DemoAction) => void;
  user: Employee | null;
  clock: Clock;
  reset: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, undefined, loadState);
  const [clock, setClock] = useState(() => currentClock(todayISO()));

  useEffect(() => {
    const timer = window.setInterval(() => setClock(currentClock(todayISO())), 20_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ohne localStorage bleibt die Demo nur im Speicher – das ist in Ordnung.
    }
  }, [state]);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignorieren
    }
    dispatch({ type: 'replace', state: { ...freshState(), currentUserId: state.currentUserId } });
  }, [state.currentUserId]);

  const value = useMemo<DemoContextValue>(
    () => ({ state, dispatch, clock, reset, user: employees.find((e) => e.id === state.currentUserId) ?? null }),
    [state, clock, reset],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo außerhalb von DemoProvider');
  return ctx;
}

/** Für Seiten innerhalb des Logins: Benutzer ist garantiert gesetzt. */
export function useDemoUser(): DemoContextValue & { user: Employee } {
  const ctx = useDemo();
  if (!ctx.user) throw new Error('Kein Demo-Benutzer angemeldet');
  return ctx as DemoContextValue & { user: Employee };
}
