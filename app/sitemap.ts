import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/site';
import { ALL_CITIES } from '../lib/ranking';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: 'hourly', priority: 1 },
    { url: `${SITE_URL}/ranking`, changeFrequency: 'hourly', priority: 0.8 },
    ...ALL_CITIES.map((c) => ({
      url: `${SITE_URL}/aqi/${c.slug}`,
      changeFrequency: 'hourly' as const,
      priority: c.bd ? 0.7 : 0.6,
    })),
  ];
}
