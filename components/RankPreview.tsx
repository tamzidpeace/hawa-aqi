import { useEffect, useState } from 'react';
import { bandOf } from '../lib/aqi';
import { makeT, type Lang } from '../lib/i18n';
import { getRanking, type RankEntry } from '../lib/ranking';

/** Compact top-5 pollution ranking (Bangladesh) shown on the home screen,
 * with a horizontal bar per city sized relative to the leader. */
export function RankPreview({
  lang,
  onPick,
  onSeeAll,
}: {
  lang: Lang;
  onPick: (c: { name: string; lat: number; lon: number }) => void;
  onSeeAll: () => void;
}) {
  const t = makeT(lang);
  const [rows, setRows] = useState<RankEntry[] | null>(null);

  useEffect(() => {
    let dead = false;
    getRanking('bd')
      .then((r) => {
        if (!dead) setRows(r.slice(0, 5));
      })
      .catch(() => {
        if (!dead) setRows([]);
      });
    return () => {
      dead = true;
    };
  }, []);

  if (!rows || rows.length === 0) return null;

  const maxAqi = Math.max(...rows.map((r) => r.aqi ?? 0), 1);

  return (
    <section className="card rank-card">
      <div className="rank-head">
        <div className="sec-title">{t('rankingTitle')}</div>
        <button className="see-all" onClick={onSeeAll}>
          {t('seeAll')} →
        </button>
      </div>
      <div className="rank-list">
        {rows.map((c, i) => {
          const band = c.aqi != null ? bandOf(c.aqi) : null;
          const pct = c.aqi != null ? Math.max(Math.min((c.aqi / maxAqi) * 100, 100), 5) : 0;
          return (
            <button
              key={c.en}
              className="rank-row"
              onClick={() =>
                onPick({ name: lang === 'bn' ? c.bn : c.en, lat: c.lat, lon: c.lon })
              }
            >
              <span className="rank-no">{i + 1}</span>
              <span className="rank-name">{lang === 'bn' ? c.bn : c.en}</span>
              <span className="rank-bar">
                {c.aqi != null && band && (
                  <i
                    className="rank-fill"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${band.color}55, ${band.color})`,
                    }}
                  />
                )}
              </span>
              <span className="rank-aqi" style={{ color: band?.color ?? 'inherit' }}>
                {c.aqi ?? '—'}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
