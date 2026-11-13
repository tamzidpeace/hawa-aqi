import { BANDS, bandOf, type Band } from '../lib/aqi';

const R = 94;
const C = 2 * Math.PI * R;

export function Gauge({ aqi, band, label }: { aqi: number; band: Band; label: string }) {
  const pct = Math.min(aqi, 500) / 500;
  return (
    <div className="gauge">
      <svg viewBox="0 0 220 220" width="100%" aria-hidden="true">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={band.color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={band.color} />
          </linearGradient>
        </defs>
        <circle cx="110" cy="110" r={R} className="gauge-track" />
        <circle
          cx="110"
          cy="110"
          r={R}
          className="gauge-fill"
          stroke="url(#gaugeGrad)"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - pct)}
          transform="rotate(-90 110 110)"
        />
      </svg>
      <div className="gauge-center">
        <div className="gauge-aqi">{aqi}</div>
        <div className="gauge-label">US AQI</div>
        <div className="gauge-band">{label}</div>
      </div>
    </div>
  );
}

export function ScaleBar({ aqi, lang }: { aqi: number; lang: 'en' | 'bn' }) {
  const pct = Math.min(aqi, 500) / 500;
  const cur = bandOf(aqi);
  return (
    <div className="scalebar">
      <div className="scalebar-zone">
        <div className="scalebar-track" />
        <div className="scalebar-marker" style={{ left: `${pct * 100}%` }} />
      </div>
      <div className="scalebar-ends">
        <span>0</span>
        <span>{lang === 'bn' ? 'মাত্রা বাড়ছে →' : 'worse →'}</span>
        <span>500</span>
      </div>
      <div className="scale-legend">
        {BANDS.map((b, i) => {
          const lo = i === 0 ? 0 : BANDS[i - 1].max + 1;
          return (
            <span key={b.key} className={`lg-item${b.key === cur.key ? ' on' : ''}`}>
              <i className="lg-dot" style={{ background: b.color }} />
              <span className="lg-text">
                <span className="lg-name">{lang === 'bn' ? b.sBn : b.sEn}</span>
                <span className="lg-range">
                  {lo}–{b.max}
                </span>
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
