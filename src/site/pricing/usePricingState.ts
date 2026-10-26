import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { pricing } from '../../config/pricing';
import { normalizeInput, type NormalizedInput } from './calculate';
import { readEstimateParams, writeEstimateParams } from './urlState';

/**
 * Zustand des Preisbereichs (Zahlweise, Mitarbeiter, Einrichtung, Brutto).
 * Wird nach der ersten Änderung in die URL gespiegelt – ohne localStorage/Cookies.
 * history.replaceState statt Router-Navigation, damit Anker (#preise) und Scrollposition erhalten bleiben.
 */
export function usePricingState() {
  const [state, setState] = useState<NormalizedInput>(() => normalizeInput(readEstimateParams(''), pricing));
  const touched = useRef(false);

  // Geteilte Rechnung aus der URL übernehmen. Erst nach dem Hydrieren, weil das vorgerenderte HTML
  // die Standardwerte enthält (der Server kennt die Query nicht).
  useLayoutEffect(() => {
    const { search } = window.location;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- einmalige Übernahme externer Daten (URL) nach der Hydration
    if (search) setState(normalizeInput(readEstimateParams(search), pricing));
  }, []);

  const update = useCallback((patch: Partial<NormalizedInput>) => {
    touched.current = true;
    setState((s) => normalizeInput({ ...s, ...patch }, pricing));
  }, []);

  useEffect(() => {
    if (!touched.current) return;
    const { pathname, search, hash } = window.location;
    const next = writeEstimateParams(search, state);
    if (next !== search) window.history.replaceState(window.history.state, '', `${pathname}${next}${hash}`);
  }, [state]);

  return [state, update] as const;
}
