import { bandOf } from '../lib/aqi';
import { fmtHour, type Lang } from '../lib/i18n';
import type { HourlyPoint } from '../lib/api';

const SCALE_MAX = 300;

export function Forecast({
  hourly,
  lang,
  nowLabel,
}: {
  hourly: HourlyPoint[];
  lang: Lang;
  nowLabel: string;
}) {
  const cols = hourly.slice(0, 24);
  return (
    <div className="fc-scroll">
      <div className="fc-row">
        {cols.map((h, i) => {
          const band = h.aqi != null ? bandOf(h.aqi) : null;
          const pct = h.aqi != null ? Math.min(h.aqi, SCALE_MAX) / SCALE_MAX : 0;
          return (
            <div key={h.time} className={`fc-col${i === 0 ? ' fc-now' : ''}`}>
              <div className="fc-aqi">{h.aqi ?? '—'}</div>
              <div className="fc-bar">
                <div
                  className="fc-fill"
                  style={{
                    height: `${Math.max(pct * 100, h.aqi != null ? 6 : 2)}%`,
                    background: band?.color ?? 'rgba(255,255,255,.18)',
                  }}
                />
              </div>
              <div className="fc-hour">{i === 0 ? nowLabel : i % 3 === 0 ? fmtHour(h.time, lang) : ''}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Lowest-AQI hour within the next 12 hours, for the "best time to be out" chip. */
export function bestWindow(
  hourly: HourlyPoint[],
): { time: string; aqi: number } | null {
  const arr = hourly
    .slice(1, 13)
    .filter((h): h is { time: string; aqi: number } => h.aqi != null);
  if (!arr.length) return null;
  return arr.reduce((a, b) => (b.aqi < a.aqi ? b : a));
}
