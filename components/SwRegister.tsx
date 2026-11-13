'use client';

import { useEffect } from 'react';

/** Registers the hand-rolled service worker (PWA install + offline shell). */
export function SwRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* non-HTTPS or unsupported — the app still works online */
    });
  }, []);
  return null;
}
