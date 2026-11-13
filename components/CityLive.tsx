'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { bandOf, BAND_BG } from '../lib/aqi';
import { fmtHour, fmtTime, makeT } from '../lib/i18n';
import { useAir, useInstall, useLang } from '../lib/hooks';
import type { CityPageInfo } from '../lib/ranking';
import type { AirResult } from '../lib/api';
import { Advice } from './Advice';
import { Forecast, bestWindow } from './Forecast';
import { Gauge, ScaleBar } from './Gauge';
import { Icon } from './Icon';
import { NearbyChips } from './NearbyChips';
import { Pollutants } from './Pollutants';

/** Interactive live view for a /aqi/[city] landing page (seeded server-side). */
export function CityLive({ city, ssrAqi }: { city: CityPageInfo; ssrAqi: number | null }) {
  const [lang, setLang] = useLang();
  const t = makeT(lang);
  const router = useRouter();
  const install = useInstall();

  // seed with the server-fetched AQI so the hero + advice render in the HTML
  const seed: AirResult | undefined =
    ssrAqi != null
      ? {
          aqi: ssrAqi,
          estimated: false,
          pollutants: { pm25: null, pm10: null, o3: null, no2: null, so2: null, co: null },
          hourly: [],
          updated: '',
        }
      : undefined;
  const { data, loading, error, reload } = useAir(city.lat, city.lon, seed);

  const aqi = data?.aqi ?? ssrAqi ?? null;
  const band = aqi != null ? bandOf(aqi) : null;
  const best = useMemo(() => (data ? bestWindow(data.hourly) : null), [data]);
  const name = lang === 'bn' ? city.bn : city.en;

  // tint the browser chrome with the current band color
  useEffect(() => {
    const m = document.querySelector('meta[name="theme-color"]');
    if (m && band) m.setAttribute('content', BAND_BG[band.key]);
  }, [band]);

  const share = async () => {
    if (aqi == null || !band) return;
    const text =
      lang === 'bn'
        ? `${name} — বাতাসের মান: AQI ${aqi} (${band.bn}) · হাওয়া`
        : `${name} — Air quality: AQI ${aqi} (${band.en}) · Hawa`;
    try {
      if (navigator.share) await navigator.share({ title: 'হাওয়া Hawa', text, url: location.href });
      else {
        await navigator.clipboard.writeText(`${text} ${location.href}`);
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="app" data-band={band?.key ?? 'good'}>
      <div className="bg-blob b1" />
      <div className="bg-blob b2" />
      <div className="page">
        <header className="top">
          <div className="brand">
            <Link className="icon-btn" href="/" aria-label={t('back')}>
              <Icon name="arrowLeft" size={18} />
            </Link>
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
            <button className="icon-btn" onClick={share} aria-label={t('share')} title={t('share')}>
              <Icon name="share" size={18} />
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
              <h1 className="loc-name">{name}</h1>
              <div className="loc-meta" suppressHydrationWarning>
                {[
                  city.country
                    ? lang === 'bn'
                      ? (city.countryBn ?? city.country)
                      : city.country
                    : city.bd
                      ? t('bd')
                      : '',
                  data?.updated
                    ? t('updated').replace('{x}', fmtTime(data.updated, lang))
                    : '',
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </div>
            </div>
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
            lat={city.lat}
            lon={city.lon}
            myName={name}
            lang={lang}
            onPick={(p) => {
              try {
                localStorage.setItem(
                  'hawa.loc',
                  JSON.stringify({ name: p.name, lat: p.lat, lon: p.lon, source: 'manual' }),
                );
              } catch {
                /* ignore */
              }
              router.push('/');
            }}
          />

          {loading && !data && (
            <>
              <div className="skel skel-hero" />
              <div className="skel skel-row" />
              <div className="skel skel-row" />
            </>
          )}

          {aqi != null && band && (
            <>
              <section className="card hero">
                {best && (
                  <div className="best" suppressHydrationWarning>
                    <Icon name="clock" size={16} />
                    <span>
                      <b>{t('bestWindow')}:</b> {fmtHour(best.time, lang)} · AQI {best.aqi}
                    </span>
                  </div>
                )}
                <Gauge aqi={aqi} band={band} label={band[lang]} />
                <ScaleBar aqi={aqi} lang={lang} />
                {data?.estimated && (
                  <div className="est">
                    <Icon name="info" size={13} /> {t('estimated')}
                  </div>
                )}
              </section>
              <Advice band={band} lang={lang} />
              {data && <Pollutants p={data.pollutants} lang={lang} />}
              {data && data.hourly.length > 0 && (
                <section className="card fc-card">
                  <div className="sec-title">{t('next24')}</div>
                  <Forecast hourly={data.hourly} lang={lang} nowLabel={t('now')} />
                </section>
              )}
            </>
          )}

          <Link className="card rank-link" href="/ranking">
            <Icon name="trophy" size={16} />
            <span>{t('rankingTitle')}</span>
            <span className="see-all">{t('seeAll')} →</span>
          </Link>
        </main>

        <footer>
          <div>{t('source')}</div>
          <div>{t('disclaimer')}</div>
          {install.isIOS && !install.standalone && <div className="ios-hint">{t('addHome')}</div>}
        </footer>
      </div>
    </div>
  );
}
