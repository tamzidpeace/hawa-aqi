import { useEffect, useRef, useState } from 'react';
import { bandOf } from '../lib/aqi';
import { fmtHour, type Lang } from '../lib/i18n';
import type { HourlyPoint } from '../lib/api';

const SCALE_MAX = 300;
const MIN_STEP = 28; // px per hour on the smallest screens (horizontal scroll below this)
const H = 176;
const PAD_T = 18; // room for the value labels above the line
const PAD_B = 26; // hour-label strip
const AREA_ID = 'hawa-fc-area';

interface Pt {
  x: number;
  y: number;
}

/** Line graph of the next 24 hourly AQI values, spanning the card width. */
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
  const n = Math.max(cols.length, 1);
  const ref = useRef<HTMLDivElement>(null);
  const [avail, setAvail] = useState<number | null>(null);

  // stretch to the card width; below 24×28px the chart scrolls horizontally
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setAvail(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const w = avail != null && avail >= n * MIN_STEP ? avail : n * MIN_STEP;
  const step = w / n;
  const xOf = (i: number) => (i + 0.5) * step;

  // zoom the y-scale to the data range so hour-to-hour movement is visible
  // (rounded to 25s, always including 0 for low values)
  const vals = cols.map((c) => c.aqi).filter((v): v is number => v != null);
  const vMax = vals.length ? Math.max(...vals) : SCALE_MAX;
  const vMin = vals.length ? Math.min(...vals) : 0;
  const hi = Math.max(100, Math.ceil((vMax + 15) / 25) * 25);
  const lo = vMin > 60 ? Math.max(0, Math.floor((vMin - 15) / 25) * 25) : 0;
  const yOf = (v: number) =>
    PAD_T + (1 - (Math.min(Math.max(v, lo), hi) - lo) / (hi - lo)) * (H - PAD_T - PAD_B);

  const pts: (Pt | null)[] = cols.map((h, i) => {
    if (h.aqi == null) return null;
    return { x: xOf(i), y: yOf(h.aqi) };
  });

  // smooth Catmull-Rom → cubic Bézier segments, each stroked in the left
  // point's band color so the line shifts green → yellow → red like the UI
  const segs: { d: string; color: string }[] = [];
  for (let i = 0; i < n - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    if (!a || !b || cols[i].aqi == null) continue;
    const p0 = pts[i - 1] ?? a;
    const p2 = pts[i + 2] ?? b;
    const c1x = a.x + (b.x - p0.x) / 6;
    const c1y = a.y + (b.y - p0.y) / 6;
    const c2x = b.x - (p2.x - a.x) / 6;
    const c2y = b.y - (p2.y - a.y) / 6;
    segs.push({
      d: `M${a.x} ${a.y} C${c1x} ${c1y} ${c2x} ${c2y} ${b.x} ${b.y}`,
      color: bandOf(cols[i].aqi!).color,
    });
  }

  const solid = pts.filter((p): p is Pt => p != null);
  const first = solid[0];
  const last = solid[solid.length - 1];
  const area =
    solid.length > 1 && solid.length === n
      ? `M${first.x} ${H - PAD_B + 6} L${first.x} ${first.y} ` +
        segs.map((s) => s.d.replace(/^M[^C]+C/, 'C')).join(' ') +
        ` L${last.x} ${H - PAD_B + 6} Z`
      : '';

  return (
    <div className="fc-scroll">
      <div className="fc-chart" ref={ref}>
        <svg className="fc-line" width={w} height={H} viewBox={`0 0 ${w} ${H}`} aria-hidden="true">
          <defs>
            <linearGradient id={AREA_ID} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" style={{ stopColor: 'var(--ac)', stopOpacity: 0.2 }} />
              <stop offset="0.75" style={{ stopColor: 'var(--ac)', stopOpacity: 0.04 }} />
              <stop offset="1" style={{ stopColor: 'var(--ac)', stopOpacity: 0 }} />
            </linearGradient>
          </defs>

          {area && <path d={area} fill={`url(#${AREA_ID})`} />}
          {segs.map((s, i) => (
            <path
              key={i}
              d={s.d}
              fill="none"
              stroke={s.color}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}

          {pts.map((p, i) =>
            p == null || cols[i].aqi == null ? null : (
              <g key={cols[i].time}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={i === 0 ? 4 : 3}
                  fill={bandOf(cols[i].aqi!).color}
                  stroke={i === 0 ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.25)'}
                  strokeWidth={i === 0 ? 1.5 : 1}
                />
                <text
                  x={p.x}
                  y={p.y - 9}
                  textAnchor="middle"
                  className={`fc-val${i === 0 ? ' now' : ''}`}
                >
                  {cols[i].aqi}
                </text>
              </g>
            ),
          )}

          {cols.map((h, i) =>
            i === 0 || i % 3 === 0 ? (
              <text
                key={h.time}
                x={xOf(i)}
                y={H - 8}
                textAnchor="middle"
                className={`fc-hr${i === 0 ? ' now' : ''}`}
              >
                {i === 0 ? nowLabel : fmtHour(h.time, lang)}
              </text>
            ) : null,
          )}
        </svg>
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
