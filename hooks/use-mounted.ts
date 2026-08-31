import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True once the component has hydrated on the client, false during SSR and
 * the first client render. For gating anything that depends on
 * browser-only/persisted state (theme, localStorage, matchMedia) so the
 * server-rendered markup and the first client render agree.
 *
 * Implemented with useSyncExternalStore rather than the classic
 * `useState(false) + useEffect(() => setState(true))` pattern — that
 * pattern calls setState synchronously inside an effect body, which
 * triggers an extra cascading render (flagged by the
 * react-hooks/set-state-in-effect lint rule). useSyncExternalStore's
 * server/client snapshot pair is what this check actually is.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
