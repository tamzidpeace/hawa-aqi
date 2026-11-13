import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Bengali } from 'next/font/google';
import { SwRegister } from '../components/SwRegister';
import { SITE_URL } from '../lib/site';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const notoBn = Noto_Sans_Bengali({
  subsets: ['bengali'],
  variable: '--font-noto-bn',
  display: 'swap',
});

const DESCRIPTION =
  'হাওয়া Hawa — Live air quality (US AQI) for your exact neighborhood or city with simple health advice, pollutant levels and a 24-hour forecast. English & বাংলা.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'হাওয়া Hawa — Air Quality (AQI) around you',
    template: '%s · হাওয়া Hawa',
  },
  description: DESCRIPTION,
  applicationName: 'হাওয়া Hawa',
  keywords: [
    'AQI',
    'air quality',
    'ঢাকার বাতাস',
    'Dhaka AQI',
    'বাতাসের মান',
    'air quality index',
    'Bangladesh air quality',
    'পরিবেশ দূষণ',
    'PM2.5',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'হাওয়া Hawa',
    title: 'হাওয়া Hawa — Air Quality (AQI) around you',
    description: DESCRIPTION,
    url: '/',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'হাওয়া Hawa — Air Quality (AQI)' }],
    locale: 'bn_BD',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'হাওয়া Hawa — Air Quality (AQI) around you',
    description: DESCRIPTION,
    images: ['/og.png'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Hawa',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    apple: ['/icons/apple-touch-180.png'],
  },
  other: { 'mobile-web-app-capable': 'yes' },
};

export const viewport: Viewport = {
  themeColor: '#070b10',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const WEB_APP_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'হাওয়া Hawa — Air Quality (AQI)',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Any',
  description: DESCRIPTION,
  inLanguage: ['bn', 'en'],
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={`${inter.variable} ${notoBn.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEB_APP_LD) }}
        />
        <SwRegister />
      </body>
    </html>
  );
}
