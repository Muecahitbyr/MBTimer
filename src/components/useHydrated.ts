import { useSyncExternalStore } from 'react';

const noop = () => () => undefined;

/** false beim Prerendern und während der Hydration, danach true. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}
