# হাওয়া Hawa — Neighborhood Air Quality (AQI)

A installable PWA that shows live air quality (US AQI) for your exact location
with simple, actionable health advice — in **Bangla & English**.

Built with React + TypeScript + Vite + `vite-plugin-pwa`.

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
- 📲 **Installable**: full PWA (manifest + offline app shell via service
  worker); on Android/Chrome shows an in-app Install button, on iOS users can
  use Share → Add to Home Screen
- 🗺️ **Nearby areas**: chips of named places around you (OpenStreetMap
  Overpass with mirror fallback) each with a live AQI value — one tap to switch
- 🔖 **Save places**: bookmark any location; saved places appear in the search
  sheet for quick switching
- 🏆 **City ranking**: top-5 Bangladesh preview on home + full ranking page at
  `/#/ranking` — 16 Bangladeshi cities and **183 world cities** (nearly every
  country's capital / major city), with region filter chips, city/country
  search (English & বাংলা), sortable most polluted / cleanest; tap a city to
  make it your location
- 🌐 **বাংলা / English** toggle, share button, auto-refresh every 15 min

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
npm run dev        # development (http://localhost:5173)
npm run build      # type-check + production build to dist/
npm run preview    # serve dist/ (PWA works here)
npm run icons      # regenerate PWA icons from assets/*.svg (needs `sharp`)
```

## Deploy

Deploy the `dist/` folder to any static host **over HTTPS at the domain root**
(Vercel / Netlify / Cloudflare Pages). HTTPS + root scope are required for
geolocation and the service worker. Build command `npm run build`, publish
directory `dist`.

## Structure

```
src/
  lib/       api.ts (Open-Meteo/BigDataCloud/Overpass) · aqi.ts (bands, advice, pollutants)
             i18n.ts (EN/BN strings) · hooks.ts (geo, air, lang, saved, PWA install)
             ranking.ts (city lists + cached multi-location AQI ranking)
  components/ Gauge · ScaleBar · Advice · Pollutants · Forecast · SearchSheet
             NearbyChips · RankPreview · Icon
  pages/     Home.tsx (onboarding + main screen) · RankingPage.tsx (full list)
  App.tsx    routes: / and /ranking (HashRouter)
```
