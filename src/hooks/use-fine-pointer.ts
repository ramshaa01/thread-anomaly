"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(pointer: fine)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

/**
 * True only when the primary input is a precise pointer (mouse/trackpad).
 * Server/first-paint snapshot is false so cursor-driven effects never
 * attach listeners on touch devices, and never mismatch during hydration.
 */
export function useFinePointer(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
