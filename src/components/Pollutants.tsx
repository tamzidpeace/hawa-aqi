import { POLLUTANTS } from '../lib/aqi';
import type { AirPollutants } from '../lib/api';
import { makeT, type Lang } from '../lib/i18n';

export function Pollutants({ p, lang }: { p: AirPollutants; lang: Lang }) {
  const t = makeT(lang);
  return (
    <section className="card pol-card">
      <div className="sec-title">{t('pollutants')}</div>
      <div className="pol-grid">
        {POLLUTANTS.map((d) => {
          const v = p[d.key];
          const lvl = v == null ? 'low' : v < d.lo ? 'low' : v < d.hi ? 'med' : 'high';
          const width = v == null ? 0 : Math.min(100, ((v / d.hi) * 100) / 2);
          const label =
            v == null ? '—' : v >= 1000 ? Math.round(v).toLocaleString() : Math.round(v * 10) / 10;
          return (
            <div className="pol" key={d.key}>
              <div className="pol-head">
                <span className="pol-name">{d.code}</span>
                <span className={`pol-lv lv-${lvl}`}>{t(lvl)}</span>
              </div>
              <div className="pol-val">
                {label}
                <small>µg/m³</small>
              </div>
              <div className="pol-bar">
                <div
                  className={`pol-fill lv-${lvl}`}
                  style={{ width: `${Math.max(width, v != null ? 4 : 0)}%` }}
                />
              </div>
              <div className="pol-sub">{lang === 'bn' ? d.bn : d.en}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
