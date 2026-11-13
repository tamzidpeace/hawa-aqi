import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'হাওয়া Hawa — Air Quality (AQI)',
    short_name: 'হাওয়া Hawa',
    description:
      'Live air quality (AQI) for your neighborhood with simple health advice. English & বাংলা.',
    theme_color: '#070b10',
    background_color: '#070b10',
    display: 'standalone',
    start_url: '/',
    orientation: 'portrait',
    categories: ['health', 'weather', 'utilities'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/icons/maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
