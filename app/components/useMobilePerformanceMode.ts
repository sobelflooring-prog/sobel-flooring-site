"use client";

import { useSyncExternalStore } from "react";

const MOBILE_QUERY = "(max-width: 900px)";
const subscribers = new Set<() => void>();
let mobileQueryList: MediaQueryList | null = null;

function getMediaQueryList() {
  if (typeof window === "undefined") return null;
  mobileQueryList ??= window.matchMedia(MOBILE_QUERY);
  return mobileQueryList;
}

function subscribe(callback: () => void) {
  const mediaQuery = getMediaQueryList();
  if (!mediaQuery) return () => undefined;

  if (subscribers.size === 0) mediaQuery.addEventListener("change", notifySubscribers);
  subscribers.add(callback);

  return () => {
    subscribers.delete(callback);
    if (subscribers.size === 0) mediaQuery.removeEventListener("change", notifySubscribers);
  };
}

function notifySubscribers() {
  subscribers.forEach((callback) => callback());
}

function getSnapshot() {
  return getMediaQueryList()?.matches ?? false;
}

export function useMobilePerformanceMode() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
