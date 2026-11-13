'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { reverseGeocode, type Place } from '../lib/api';
import { bandOf, BAND_BG } from '../lib/aqi';
import { fmtHour, fmtTime, makeT } from '../lib/i18n';
import { useAir, useGeolocation, useInstall, useLang, useSaved } from '../lib/hooks';
import { Advice } from './Advice';
import { Forecast, bestWindow } from './Forecast';
import { Gauge, ScaleBar } from './Gauge';
import { Icon } from './Icon';
import { NearbyChips } from './NearbyChips';
import { Pollutants } from './Pollutants';
import { RankPreview } from './RankPreview';
import { SearchSheet } from './SearchSheet';

interface SavedLoc {
  lat: number;
  lon: number;
  name: string;
  source: 'gps' | 'manual';
}

export function Home() {
  const [lang, setLang] = useLang();
  const t = useMemo(() => makeT(lang), [lang]);
  const router = useRouter();

  // start empty on both server and client (no hydration mismatch),
  // then restore the last location from localStorage after mount
  const [loc, setLocState] = useState<SavedLoc | null>(null);
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('hawa.loc') || 'null');
      if (s && typeof s.lat === 'number' && typeof s.lon === 'number') setLocState(s);
    } catch {
      /* ignore */
    }
  }, []);
  const setLoc = (l: SavedLoc | null) => {
    setLocState(l);
    try {
      if (l) localStorage.setItem('hawa.loc', JSON.stringify(l));
      else localStorage.removeItem('hawa.loc');
    } catch {
      /* ignore */
    }
  };

  const { data, loading, error, reload } = useAir(loc?.lat ?? null, loc?.lon ?? null);
  const geo = useGeolocation();
  const install = useInstall();
  const saved = useSaved();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const band = data ? bandOf(data.aqi) : null;
  const best = useMemo(() => (data ? bestWindow(data.hourly) : null), [data]);

  // tint the browser chrome with the current band color
  useEffect(() => {
    const m = document.querySelector('meta[name="theme-color"]');
    if (m && band) m.setAttribute('content', BAND_BG[band.key]);
  }, [band]);

  // GPS result → save location, resolve the area name
  useEffect(() => {
    if (geo.status === 'ok' && geo.lat != null && geo.lon != null) {
      setLoc({ lat: geo.lat, lon: geo.lon, name: t('locating'), source: 'gps' });
      setSheetOpen(false);
      reverseGeocode(geo.lat, geo.lon, lang).then((n) => {
        if (!n) return;
        setLocState((prev) => {
          if (!(prev && prev.source === 'gps')) return prev;
          const next = { ...prev, name: n };
          localStorage.setItem('hawa.loc', JSON.stringify(next));
          return next;
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo.status, geo.lat, geo.lon, lang]);

  const share = async () => {
    if (!data || !band) return;
    const text =
      lang === 'bn'
        ? `${loc?.name ?? ''} — বাতাসের মান: AQI ${data.aqi} (${band.bn}) · হাওয়া`
        : `${loc?.name ?? ''} — Air quality: AQI ${data.aqi} (${band.en}) · Hawa`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'হাওয়া Hawa', text, url: location.href });
      } else {
        await navigator.clipboard.writeText(`${text} ${location.href}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }
    } catch {
      /* user cancelled */
    }
  };

  const sheet = (
    <SearchSheet
      open={sheetOpen}
      lang={lang}
      saved={saved.list}
      onClose={() => setSheetOpen(false)}
      onUseGps={geo.request}
      onRemoveSaved={saved.remove}
      onPick={(p: Place) => {
        setLoc({ lat: p.lat, lon: p.lon, name: p.name, source: 'manual' });
        setSheetOpen(false);
      }}
    />
  );

  /* ---------- onboarding (no location yet) ---------- */
  if (!loc) {
    return (
      <div className="app" data-band="good">
        <div className="bg-blob b1" />
        <div className="bg-blob b2" />
        <div className="onboard">
          <div className="onboard-mark">
            <Icon name="wind" size={44} />
          </div>
          <h1>{lang === 'bn' ? 'হাওয়া' : 'Hawa'}</h1>
          <div className="tag">{t('tagline')}</div>
          <div className="ob-chips">
            {t('obChips')
              .split('|')
              .map((c) => (
                <span className="ob-chip" key={c}>
                  {c}
                </span>
              ))}
          </div>
          {geo.status === 'error' && (
            <div className="warn">
              <Icon name="alert" size={17} />
              <span>
                <b>{t('locatingFailed')}.</b>{' '}
                {geo.error === 'denied'
                  ? t('permitHint')
                  : geo.error === 'unsupported'
                    ? t('unsupportedHint')
                    : ''}
              </span>
            </div>
          )}
          <button
            className="btn btn-accent"
            onClick={geo.request}
            disabled={geo.status === 'locating'}
          >
            {geo.status === 'locating' ? (
              <span className="spinner" />
            ) : (
              <Icon name="locate" size={18} />
            )}
            {geo.status === 'locating' ? t('locating') : t('useLocation')}
          </button>
          <button className="btn btn-ghost" onClick={() => setSheetOpen(true)}>
            <Icon name="search" size={18} />
            {t('searchArea')}
          </button>
          <p className="privacy">{t('privacy')}</p>
        </div>
        {sheet}
      </div>
    );
  }

  const isSaved = saved.isSaved(loc.lat, loc.lon);

  /* ---------- main app ---------- */
  return (
    <div className="app" data-band={band?.key ?? 'good'}>
      <div className="bg-blob b1" />
      <div className="bg-blob b2" />
      <div className="page">
        <header className="top">
          <div className="brand">
            <span className="brand-mark">
              <Icon name="wind" size={22} />
            </span>
            <div>
              <div className="brand-name">{lang === 'bn' ? 'হাওয়া' : 'Hawa'}</div>
              <div className="brand-sub">{t('tagline')}</div>
            </div>
          </div>
          <div className="top-actions">
            <Link
              className="icon-btn"
              href="/ranking"
              aria-label={t('rankingTitle')}
              title={t('rankingTitle')}
            >
              <Icon name="trophy" size={18} />
            </Link>
            <button
              className="icon-btn lang-btn"
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              aria-label="Language"
            >
              {lang === 'bn' ? 'EN' : 'বাং'}
            </button>
            <button
              className="icon-btn"
              onClick={share}
              aria-label={copied ? t('copied') : t('share')}
              title={copied ? t('copied') : t('share')}
            >
              <Icon name={copied ? 'check' : 'share'} size={18} />
            </button>
            {install.canInstall && (
              <button className="btn btn-accent btn-sm install-btn" onClick={install.promptInstall}>
                <Icon name="download" size={15} />
                {t('install')}
              </button>
            )}
          </div>
        </header>

        <main>
          <section className="card locbar">
            <Icon name="pin" size={18} className="loc-pin" />
            <div className="loc-text">
              <h1 className="loc-name">{loc.name}</h1>
              <div className="loc-meta" suppressHydrationWarning>
                {loc.source === 'gps' ? t('gps') : t('manual')}
                {data?.updated &&
                  ` · ${t('updated').replace('{x}', fmtTime(data.updated, lang))}`}
              </div>
            </div>
            <button
              className={`icon-btn sm${isSaved ? ' on' : ''}`}
              onClick={() => saved.toggle({ name: loc.name, lat: loc.lat, lon: loc.lon })}
              aria-label={isSaved ? t('savedTitle') : t('save')}
              title={isSaved ? t('savedTitle') : t('save')}
            >
              <Icon name="bookmark" size={15} />
            </button>
            <button
              className="icon-btn sm"
              onClick={() => setSheetOpen(true)}
              aria-label={t('changeArea')}
            >
              <Icon name="search" size={16} />
            </button>
            <button
              className={`icon-btn sm${loading ? ' spin' : ''}`}
              onClick={reload}
              aria-label={t('refresh')}
            >
              <Icon name="refresh" size={16} />
            </button>
          </section>

          {error && (
            <div className="card error-card">
              <Icon name="alert" size={18} />
              <span>{t('fetchFail')}</span>
              <button className="btn btn-ghost btn-sm" onClick={reload}>
                {t('retry')}
              </button>
            </div>
          )}

          <NearbyChips
            lat={loc.lat}
            lon={loc.lon}
            myName={loc.name}
            lang={lang}
            onPick={(p) => setLoc({ ...p, source: 'manual' })}
          />

          {loading && !data && (
            <>
              <div className="skel skel-hero" />
              <div className="skel skel-row" />
              <div className="skel skel-row" />
            </>
          )}

          {data && band && (
            <>
              <section className="card hero">
                <Gauge aqi={data.aqi} band={band} label={band[lang]} />
                <ScaleBar aqi={data.aqi} lang={lang} />
                {best && (
                  <div className="best" suppressHydrationWarning>
                    <Icon name="clock" size={16} />
                    <span>
                      <b>{t('bestWindow')}:</b> {fmtHour(best.time, lang)} · AQI {best.aqi}
                    </span>
                  </div>
                )}
                {data.estimated && (
                  <div className="est">
                    <Icon name="info" size={13} /> {t('estimated')}
                  </div>
                )}
              </section>
              <Advice band={band} lang={lang} />
              <Pollutants p={data.pollutants} lang={lang} />
              <section className="card fc-card">
                <div className="sec-title">{t('next24')}</div>
                <Forecast hourly={data.hourly} lang={lang} nowLabel={t('now')} />
              </section>
            </>
          )}

          <RankPreview
            lang={lang}
            onPick={(c) => setLoc({ ...c, source: 'manual' })}
            onSeeAll={() => router.push('/ranking')}
          />
        </main>

        <footer>
          <div>{t('source')}</div>
          <div>{t('disclaimer')}</div>
          {install.isIOS && !install.standalone && <div className="ios-hint">{t('addHome')}</div>}
        </footer>
      </div>
      {sheet}
    </div>
  );
}
