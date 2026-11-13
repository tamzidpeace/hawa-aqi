# হাওয়া Hawa — Neighborhood Air Quality (AQI)

An installable PWA that shows live air quality (US AQI) for your exact location
with simple, actionable health advice — in **Bangla & English**. Built with
**Next.js 15 (App Router) + React 19 + TypeScript**, fully server-rendered for
SEO.

## Features

- 📍 **GPS-based**: asks browser location permission, resolves your area name
  (reverse geocoding) and shows the AQI right around you
- 🔍 **Manual fallback**: search any city/area, or use quick chips for popular
  Dhaka neighborhoods (works even if GPS is denied)
- 🎨 **Band-colored UI**: the whole theme (glow, gauge, icons) shifts with the
  current AQI level — Good → Hazardous
- 💡 **Advice**: clear "what you should do now" tips per AQI band
- 🧪 **Pollutant breakdown**: PM2.5, PM10, O₃, NO₂, SO₂, CO with low/med/high
- ⏱ **Next 24 hours**: hourly AQI forecast + "best time to be out" suggestion
- 🗺️ **Nearby areas**: chips of named places around you (OpenStreetMap
  Overpass with mirror fallback) each with a live AQI value — one tap to switch
- 🔖 **Save places**: bookmark any location; saved places appear in the search
  sheet for quick switching
- 🏆 **City ranking**: top-5 Bangladesh preview on home + full ranking page at
  `/ranking` — 16 Bangladeshi cities and **183 world cities** (nearly every
  country's capital / major city), with region filter chips, city/country
  search (English & বাংলা), sortable most polluted / cleanest; tap a city to
  make it your location
- 🌐 **বাংলা / English** toggle, share button, auto-refresh every 15 min

## SEO / SSR (why Next.js)

- **Every page is server-rendered** — crawlers and link previews (Facebook,
  WhatsApp, Twitter) see real content, not an empty shell
- **199 city landing pages** at `/aqi/<city>` (e.g. `/aqi/dhaka`,
  `/aqi/delhi`, `/aqi/sao-paulo`) — each with a live "City AQI today" title,
  meta description, gauge, and health advice baked into the HTML; regenerated
  every 15 minutes (ISR)
- `/ranking` renders the full city list in the HTML (SSR per request)
- Open Graph + Twitter card with a generated 1200×630 share image (`/og.png`)
- `app/manifest.ts` (PWA manifest), `app/robots.ts`, `app/sitemap.ts`
  (201 URLs), WebApplication JSON-LD
- Self-hosted fonts via `next/font` (Inter + Noto Sans Bengali)

### Site URL

Canonical/OG URLs use `NEXT_PUBLIC_SITE_URL` (defaults to
`https://hawa-aqi.vercel.app`). Set it to your domain on deploy:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com npm run build
```

## Data sources (free, no API key)

- Air quality: [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api)
  (CAMS model, US AQI)
- Place search: Open-Meteo Geocoding API
- Reverse geocoding: BigDataCloud client API

> Values are model-based estimates; a nearby government reference monitor can
> differ.

## Run

```bash
npm install
npm run dev        # development (http://localhost:3000)
npm run build      # production build (199 city pages prerendered)
npm run start      # serve the production build
npm run icons      # regenerate PWA icons from assets/*.svg (needs `sharp`)
npm run og         # regenerate the Open Graph share image
```

## Deploy

**Vercel** (or any Node host — Netlify, Cloudflare, Railway): import the repo,
build `npm run build`, done. SSR/ISR pages need a server runtime, so static-only
hosts (GitHub Pages) are no longer enough.

HTTPS is required for geolocation and the service worker.

## Structure

```
app/
  layout.tsx          root metadata (OG/Twitter/JSON-LD), fonts, SW register
  page.tsx            home (client GPS flow, SSR onboarding)
  ranking/page.tsx    full ranking (SSR per request)
  aqi/[city]/page.tsx 199 city landing pages (SSG + 15-min ISR)
  manifest.ts · robots.ts · sitemap.ts
components/           Home · RankingClient · CityLive · Gauge · ScaleBar · Advice
                      Pollutants · Forecast · SearchSheet · NearbyChips
                      RankPreview · Icon · SwRegister
lib/       api.ts (Open-Meteo/BigDataCloud/Overpass) · aqi.ts (bands, advice)
           i18n.ts (EN/BN strings) · hooks.ts (geo, air, lang, saved, install)
           ranking.ts (city lists, batch AQI cache, slugs) · site.ts
public/    sw.js (service worker) · og.png · icons/ · favicon.svg
```
