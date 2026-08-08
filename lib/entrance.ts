/**
 * Entrance event bus (design D1; hero-R9, pre-R6). Module singleton
 * dispatching a `window` CustomEvent. The `fired` flag guarantees the signal
 * is dispatched at most once; `onEntranceReady` invokes the callback
 * immediately when the signal already fired, otherwise subscribes with a
 * 1.8s fallback timer so the hero entrance still plays even if the preloader
 * never signals. Client-only and SSR-safe: no `window` access at module
 * scope.
 */

export const ENTRANCE_EVENT = "maranatha:entrance";

/** Fallback: force the entrance if the preloader never dispatches (D1). */
const FALLBACK_MS = 1800;

let fired = false;

/** Dispatches the entrance signal exactly once (idempotent). */
export function signalEntranceReady(): void {
  if (fired || typeof window === "undefined") return;
  fired = true;
  window.dispatchEvent(new CustomEvent(ENTRANCE_EVENT));
}

/**
 * Subscribes `cb` to the entrance signal. If the signal already fired, `cb`
 * runs on the next macrotask. Returns an unsubscribe function.
 */
export function onEntranceReady(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  if (fired) {
    const timer = window.setTimeout(cb, 0);
    return () => window.clearTimeout(timer);
  }

  let fallback = 0;
  let done = false;

  const run = () => {
    if (done) return;
    done = true;
    window.clearTimeout(fallback);
    window.removeEventListener(ENTRANCE_EVENT, onEvent);
    cb();
  };

  const onEvent = () => run();

  fallback = window.setTimeout(run, FALLBACK_MS);
  window.addEventListener(ENTRANCE_EVENT, onEvent);

  return () => {
    done = true;
    window.clearTimeout(fallback);
    window.removeEventListener(ENTRANCE_EVENT, onEvent);
  };
}
