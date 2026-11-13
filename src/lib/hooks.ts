import { useCallback, useEffect, useState } from 'react';
import { fetchAir, type AirResult } from './api';
import type { Lang } from './i18n';

/* ---------------- language ---------------- */

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>(() => {
    const s = localStorage.getItem('hawa.lang');
    return s === 'en' ? 'en' : 'bn';
  });
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const set = useCallback((l: Lang) => {
    localStorage.setItem('hawa.lang', l);
    setLang(l);
  }, []);
  return [lang, set];
}

/* ---------------- geolocation ---------------- */

export type GeoStatus = 'idle' | 'locating' | 'ok' | 'error';

export function useGeolocation() {
  const [status, setStatus] = useState<GeoStatus>('idle');
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [error, setError] = useState<'denied' | 'unavailable' | 'timeout' | 'unsupported' | null>(
    null,
  );

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('error');
      setError('unsupported');
      return;
    }
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setStatus('ok');
        setLat(p.coords.latitude);
        setLon(p.coords.longitude);
      },
      (err) => {
        setStatus('error');
        setError(
          err.code === 1 ? 'denied' : err.code === 2 ? 'unavailable' : 'timeout',
        );
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 600000 },
    );
  }, []);

  return { status, lat, lon, error, request };
}

/* ---------------- air quality ---------------- */

interface CachedAir {
  lat: number;
  lon: number;
  data: AirResult;
}

function readCache(lat: number | null, lon: number | null): AirResult | null {
  if (lat == null || lon == null) return null;
  try {
    const c: CachedAir = JSON.parse(localStorage.getItem('hawa.last') || 'null');
    if (c && Math.abs(c.lat - lat) < 0.01 && Math.abs(c.lon - lon) < 0.01) return c.data;
  } catch {
    /* ignore */
  }
  return null;
}

export function useAir(lat: number | null, lon: number | null) {
  const [data, setData] = useState<AirResult | null>(() => readCache(lat, lon));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    if (lat == null || lon == null) return;
    setLoading(true);
    setError(false);
    try {
      const d = await fetchAir(lat, lon);
      setData(d);
      localStorage.setItem(
        'hawa.last',
        JSON.stringify({ lat, lon, data: d } satisfies CachedAir),
      );
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

  useEffect(() => {
    load();
  }, [load]);

  // silent refresh every 15 minutes while the app is visible
  useEffect(() => {
    if (lat == null) return;
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') load();
    }, 15 * 60 * 1000);
    return () => clearInterval(id);
  }, [load, lat]);

  return { data, loading, error, reload: load };
}

/* ---------------- PWA install ---------------- */

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
}

export function useInstall() {
  const [evt, setEvt] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const h = (e: Event) => {
      e.preventDefault();
      setEvt(e as BIPEvent);
    };
    const done = () => {
      setInstalled(true);
      setEvt(null);
    };
    addEventListener('beforeinstallprompt', h);
    addEventListener('appinstalled', done);
    return () => {
      removeEventListener('beforeinstallprompt', h);
      removeEventListener('appinstalled', done);
    };
  }, []);

  const standalone =
    typeof matchMedia !== 'undefined' &&
    (matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true);
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  const promptInstall = useCallback(() => {
    if (!evt) return;
    evt.prompt();
    setEvt(null);
  }, [evt]);

  return { canInstall: !!evt && !installed && !standalone, standalone, isIOS, promptInstall };
}

/* ---------------- saved places ---------------- */

export interface SavedPlace {
  name: string;
  lat: number;
  lon: number;
}

const SAVED_KEY = 'hawa.saved';

function readSaved(): SavedPlace[] {
  try {
    const v = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
    return Array.isArray(v) ? v.filter((p) => p && p.name && p.lat != null && p.lon != null) : [];
  } catch {
    return [];
  }
}

const samePlace = (a: SavedPlace, b: SavedPlace) =>
  Math.abs(a.lat - b.lat) < 1e-4 && Math.abs(a.lon - b.lon) < 1e-4;

export function useSaved() {
  const [list, setList] = useState<SavedPlace[]>(readSaved);

  const persist = (l: SavedPlace[]) => {
    setList(l);
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(l));
    } catch {
      /* ignore */
    }
  };

  const isSaved = (lat: number, lon: number) =>
    list.some((p) => Math.abs(p.lat - lat) < 1e-4 && Math.abs(p.lon - lon) < 1e-4);

  const toggle = (p: SavedPlace) =>
    persist(isSaved(p.lat, p.lon) ? list.filter((x) => !samePlace(x, p)) : [...list, p]);

  const remove = (p: SavedPlace) => persist(list.filter((x) => !samePlace(x, p)));

  return { list, isSaved, toggle, remove };
}
