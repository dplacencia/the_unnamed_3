"use client";

import { useSyncExternalStore } from "react";

// TailAdmin's xl sidebar breakpoint, shared with its existing shell classes.
const mobileQuery = "(max-width: 1279px)";
const getServerSnapshot = () => false;
const getSnapshot = () => window.matchMedia(mobileQuery).matches;

function subscribe(listener: () => void) {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
