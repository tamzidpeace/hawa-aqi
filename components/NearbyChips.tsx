import { useEffect, useState } from 'react';
import { distKm, fetchAqiBatch, fetchNearbyPlaces, type NearbyPlace } from '../lib/api';
import { bandOf } from '../lib/aqi';
import { makeT, type Lang } from '../lib/i18n';

interface Item extends NearbyPlace {
  aqi: number | null;
}

/**
 * Horizontal chips of named places around the current location,
 * each with a live AQI value colored by band.
 */
export function NearbyChips({
  lat,
  lon,
  myName,
  lang,
  onPick,
}: {
  lat: number;
  lon: number;
  myName: string;
  lang: Lang;
  onPick: (p: NearbyPlace) => void;
}) {
  const t = makeT(lang);
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    let dead = false;
    (async () => {
      setItems(null);
      let places: NearbyPlace[] = [];
      try {
        places = await fetchNearbyPlaces(lat, lon);
      } catch {
        places = [];
      }
      places = places
        .filter(
          (p) =>
            p.name.trim().toLowerCase() !== myName.trim().toLowerCase() &&
            distKm({ lat, lon }, p) > 0.3,
        )
        .slice(0, 8);
      if (!places.length) {
        if (!dead) setItems([]);
        return;
      }
      let aqis: (number | null)[] = [];
      try {
        aqis = await fetchAqiBatch(places);
      } catch {
        /* chips will show "—" */
      }
      if (!dead) setItems(places.map((p, i) => ({ ...p, aqi: aqis[i] ?? null })));
    })();
    return () => {
      dead = true;
    };
  }, [lat, lon, myName]);

  if (!items || items.length === 0) return null;

  return (
    <section className="card nearby-card">
      <div className="sec-title">{t('nearbyTitle')}</div>
      <div className="nearby-chips">
        {items.map((p) => {
          const band = p.aqi != null ? bandOf(p.aqi) : null;
          return (
            <button
              key={`${p.name}-${p.lat.toFixed(3)}`}
              className="nchip"
              onClick={() => onPick(p)}
              title={p.name}
            >
              <span className="nchip-dot" style={{ background: band?.color ?? '#64717e' }} />
              <span className="nchip-name">{lang === 'bn' && p.bn ? p.bn : p.name}</span>
              <span className="nchip-aqi" style={{ color: band?.color ?? 'inherit' }}>
                {p.aqi ?? '—'}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
