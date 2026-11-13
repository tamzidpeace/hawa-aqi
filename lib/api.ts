export interface Place {
  name: string;
  admin1?: string;
  country?: string;
  lat: number;
  lon: number;
}

export interface AirPollutants {
  pm25: number | null;
  pm10: number | null;
  o3: number | null;
  no2: number | null;
  so2: number | null;
  co: number | null;
}

export interface HourlyPoint {
  time: string;
  aqi: number | null;
}

export interface AirResult {
  aqi: number;
  estimated: boolean;
  pollutants: AirPollutants;
  hourly: HourlyPoint[];
  updated: string;
}

/* EPA 2024 PM2.5 → AQI breakpoints (24h standard, used as fallback estimate) */
const PM25_BREAKS: [number, number, number, number][] = [
  [0, 9, 0, 50],
  [9.1, 35.4, 51, 100],
  [35.5, 55.4, 101, 150],
  [55.5, 125.4, 151, 200],
  [125.5, 225.4, 201, 300],
  [225.5, 500.4, 301, 500],
];

function aqiFromPm25(c: number): number {
  for (const [cl, ch, al, ah] of PM25_BREAKS) {
    if (c <= ch) return Math.round(al + ((ah - al) * (c - cl)) / (ch - cl));
  }
  return 500;
}

export async function fetchAir(lat: number, lon: number): Promise<AirResult> {
  const url =
    `https://air-quality-api.open-meteo.com/v1/air-quality` +
    `?latitude=${lat}&longitude=${lon}` +
    `&current=us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide` +
    `&hourly=us_aqi&forecast_days=2&timezone=auto`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`air http ${r.status}`);
  const j = await r.json();
  const c = j.current;
  if (!c) throw new Error('air no current');

  let aqi = c.us_aqi;
  let estimated = false;
  if ((aqi == null || Number.isNaN(aqi)) && c.pm2_5 != null) {
    aqi = aqiFromPm25(c.pm2_5);
    estimated = true;
  }
  if (aqi == null) throw new Error('air no aqi');

  const times: string[] = j.hourly?.time ?? [];
  const vals: (number | null)[] = j.hourly?.us_aqi ?? [];
  const hh = String(c.time).slice(0, 13); // "2026-11-04T14"
  let idx = times.findIndex((t) => t.slice(0, 13) === hh);
  if (idx < 0) idx = 0;
  const hourly: HourlyPoint[] = times
    .slice(idx, idx + 24)
    .map((t, i) => ({ time: t, aqi: vals[idx + i] ?? null }));

  return {
    aqi: Math.round(aqi),
    estimated,
    pollutants: {
      pm25: c.pm2_5 ?? null,
      pm10: c.pm10 ?? null,
      o3: c.ozone ?? null,
      no2: c.nitrogen_dioxide ?? null,
      so2: c.sulphur_dioxide ?? null,
      co: c.carbon_monoxide ?? null,
    },
    hourly,
    updated: c.time,
  };
}

export async function searchPlaces(q: string, lang: string): Promise<Place[]> {
  const r = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=${lang}&format=json`,
  );
  if (!r.ok) return [];
  const j = await r.json();
  return (j.results ?? []).map(
    (x: Record<string, unknown>): Place => ({
      name: String(x.name ?? ''),
      admin1: x.admin1 ? String(x.admin1) : undefined,
      country: x.country ? String(x.country) : undefined,
      lat: Number(x.latitude),
      lon: Number(x.longitude),
    }),
  );
}

export async function reverseGeocode(
  lat: number,
  lon: number,
  lang: string,
): Promise<string | null> {
  try {
    const r = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=${lang}`,
    );
    if (!r.ok) return null;
    const j = await r.json();
    const area: string = j.locality || j.city || j.principalSubdivision || '';
    const region: string =
      j.principalSubdivision && area !== j.principalSubdivision
        ? j.principalSubdivision
        : '';
    return [area, region].filter(Boolean).join(', ') || null;
  } catch {
    return null;
  }
}

export interface QuickPlace {
  en: string;
  bn: string;
  lat: number;
  lon: number;
}

export const QUICK_PLACES: QuickPlace[] = [
  { en: 'Dhanmondi', bn: 'ধানমন্ডি', lat: 23.8103, lon: 90.4124 },
  { en: 'Gulshan', bn: 'গুলশান', lat: 23.7925, lon: 90.4078 },
  { en: 'Banani', bn: 'বনানী', lat: 23.7936, lon: 90.4043 },
  { en: 'Mirpur', bn: 'মিরপুর', lat: 23.806, lon: 90.366 },
  { en: 'Uttara', bn: 'উত্তরা', lat: 23.8759, lon: 90.3795 },
  { en: 'Motijheel', bn: 'মতিঝিল', lat: 23.7286, lon: 90.4146 },
  { en: 'Old Dhaka', bn: 'পুরান ঢাকা', lat: 23.7068, lon: 90.4066 },
  { en: 'Bashundhara', bn: 'বসুন্ধরা', lat: 23.8137, lon: 90.4269 },
  { en: 'Chattogram', bn: 'চট্টগ্রাম', lat: 22.3569, lon: 91.7832 },
  { en: 'Sylhet', bn: 'সিলেট', lat: 24.8949, lon: 91.8687 },
];

/* ---------------- batch AQI (many coordinates, one request) ---------------- */

export async function fetchAqiBatch(
  coords: { lat: number; lon: number }[],
): Promise<(number | null)[]> {
  const CHUNK = 50;
  const groups: { lat: number; lon: number }[][] = [];
  for (let i = 0; i < coords.length; i += CHUNK) groups.push(coords.slice(i, i + CHUNK));
  const parts = await Promise.all(
    groups.map(async (g) => {
      const lat = g.map((c) => c.lat.toFixed(4)).join(',');
      const lon = g.map((c) => c.lon.toFixed(4)).join(',');
      const r = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`,
      );
      if (!r.ok) throw new Error(`batch http ${r.status}`);
      const j = await r.json();
      return Array.isArray(j) ? j : [j];
    }),
  );
  return parts
    .flat()
    .map((x: { current?: { us_aqi?: number | null } }) => x.current?.us_aqi ?? null);
}

/* ---------------- nearby named places ---------------- */

export interface NearbyPlace {
  name: string;
  bn?: string;
  lat: number;
  lon: number;
}

/** Great-circle distance in km. */
export function distKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];

interface OverpassEl {
  lat: number;
  lon: number;
  tags?: { name?: string };
}

/** Race all Overpass mirrors; first successful response wins, null if all fail. */
async function overpass(q: string): Promise<OverpassEl[] | null> {
  const tries = OVERPASS_MIRRORS.map(async (base) => {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 8000);
    try {
      const r = await fetch(`${base}?data=${encodeURIComponent(q)}`, { signal: ctl.signal });
      if (!r.ok) throw new Error(`overpass ${r.status}`);
      const j = await r.json();
      if (!Array.isArray(j.elements)) throw new Error('overpass shape');
      return j.elements as OverpassEl[];
    } finally {
      clearTimeout(timer);
    }
  });
  try {
    return await Promise.any(tries);
  } catch {
    return null;
  }
}

/** Known places used when Overpass is slow or unreachable. */
const FALLBACK_PLACES: NearbyPlace[] = [
  { name: 'Dhanmondi', bn: 'ধানমন্ডি', lat: 23.8103, lon: 90.4124 },
  { name: 'Gulshan', bn: 'গুলশান', lat: 23.7925, lon: 90.4078 },
  { name: 'Banani', bn: 'বনানী', lat: 23.7936, lon: 90.4043 },
  { name: 'Mohakhali', bn: 'মহাখালী', lat: 23.7802, lon: 90.4026 },
  { name: 'Mirpur', bn: 'মিরপুর', lat: 23.806, lon: 90.366 },
  { name: 'Uttara', bn: 'উত্তরা', lat: 23.8759, lon: 90.3795 },
  { name: 'Motijheel', bn: 'মতিঝিল', lat: 23.7286, lon: 90.4146 },
  { name: 'Old Dhaka', bn: 'পুরান ঢাকা', lat: 23.7068, lon: 90.4066 },
  { name: 'Bashundhara', bn: 'বসুন্ধরা', lat: 23.8137, lon: 90.4269 },
  { name: 'Badda', bn: 'বাদ্দা', lat: 23.7804, lon: 90.4265 },
  { name: 'Tejgaon', bn: 'তেজগাঁও', lat: 23.7636, lon: 90.3864 },
  { name: 'Farmgate', bn: 'ফার্মগেট', lat: 23.7566, lon: 90.3864 },
  { name: 'Mohammadpur', bn: 'মোহাম্মদপুর', lat: 23.766, lon: 90.3617 },
  { name: 'Rampura', bn: 'রামপুরা', lat: 23.7605, lon: 90.4085 },
  { name: 'Malibagh', bn: 'মালিবাগ', lat: 23.7386, lon: 90.4086 },
  { name: 'Jatrabari', bn: 'যাত্রাবাড়ী', lat: 23.7005, lon: 90.4262 },
  { name: 'Savar', bn: 'সাভার', lat: 23.8583, lon: 90.2667 },
  { name: 'Keraniganj', bn: 'কেরানীগঞ্জ', lat: 23.6394, lon: 90.3142 },
  { name: 'Narayanganj', bn: 'নারায়ণগঞ্জ', lat: 23.6238, lon: 90.4998 },
  { name: 'Gazipur', bn: 'গাজীপুর', lat: 24.0023, lon: 90.4263 },
  { name: 'Chattogram', bn: 'চট্টগ্রাম', lat: 22.3569, lon: 91.7832 },
  { name: 'Sylhet', bn: 'সিলেট', lat: 24.8949, lon: 91.8687 },
  { name: 'Khulna', bn: 'খুলনা', lat: 22.8456, lon: 89.5403 },
  { name: 'Rajshahi', bn: 'রাজশাহী', lat: 24.3745, lon: 88.6042 },
];

/**
 * Up to 8 named places near the coordinate (suburbs, neighbourhoods…)
 * via OpenStreetMap Overpass; falls back to the nearest known places.
 */
export async function fetchNearbyPlaces(lat: number, lon: number): Promise<NearbyPlace[]> {
  const q =
    `[out:json][timeout:15];(node(around:7000,${lat},${lon})` +
    `["place"~"^(suburb|neighbourhood|quarter|town|village)$"];);out tags 40;`;
  const els = await overpass(q);
  if (els) {
    const seen = new Set<string>();
    const sorted = els
      .filter((e) => e.tags?.name)
      .map((e) => ({
        name: e.tags!.name!,
        lat: e.lat,
        lon: e.lon,
        d: distKm({ lat, lon }, { lat: e.lat, lon: e.lon }),
      }))
      .sort((a, b) => a.d - b.d);
    const out: NearbyPlace[] = [];
    for (const p of sorted) {
      const key = p.name.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ name: p.name, lat: p.lat, lon: p.lon });
      if (out.length >= 8) break;
    }
    if (out.length) return out;
  }
  return FALLBACK_PLACES.map((p) => ({ ...p, d: distKm({ lat, lon }, p) }))
    .filter((p) => p.d < 45)
    .sort((a, b) => a.d - b.d)
    .slice(0, 8)
    .map(({ d: _d, ...p }) => p);
}
