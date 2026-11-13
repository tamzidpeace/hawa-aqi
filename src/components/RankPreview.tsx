import { useEffect, useState } from 'react';
import { bandOf } from '../lib/aqi';
import { makeT, type Lang } from '../lib/i18n';
import { getRanking, type RankEntry } from '../lib/ranking';

/** Compact top-5 pollution ranking (Bangladesh) shown on the home screen. */
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
              <span className="nchip-dot" style={{ background: band?.color ?? '#64717e' }} />
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
