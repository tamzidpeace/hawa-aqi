import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CityLive } from '../../../components/CityLive';
import { bandOf } from '../../../lib/aqi';
import { ALL_CITIES, cityBySlug, getCityAqi } from '../../../lib/ranking';

// regenerate the static pages every 15 minutes so the AQI stays fresh
export const revalidate = 900;

export function generateStaticParams() {
  return ALL_CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const c = cityBySlug(slug);
  if (!c) return {};
  const aqi = await getCityAqi(c.en);
  const band = aqi != null ? bandOf(aqi) : null;
  const aqiTxt = aqi != null ? `AQI ${aqi}${band ? ` (${band.en} / ${band.bn})` : ''}` : 'live AQI';
  const country = c.country ?? (c.bd ? 'Bangladesh' : '');
  return {
    title: `${c.en} (${c.bn}) Air Quality Index Today`,
    description:
      `${c.bn} (${c.en}) এর আজকের বাতাসের মান — ${aqiTxt}. ` +
      `স্বাস্থ্য পরামর্শ, PM2.5/PM10 দূষণকারীর মাত্রা ও ২৪ ঘণ্টার AQI পূর্বাভাস। ` +
      `${country ? `${country} · ` : ''}হাওয়া Hawa live air quality.`,
    alternates: { canonical: `/aqi/${c.slug}` },
    openGraph: {
      title: `${c.bn} (${c.en}) — বাতাসের মান ${aqiTxt}`,
      description: `${c.en} (${c.bn}) live air quality — health advice, pollutant levels & 24h forecast.`,
      url: `/aqi/${c.slug}`,
      images: [{ url: '/og.png', width: 1200, height: 630 }],
    },
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slug } = await params;
  const c = cityBySlug(slug);
  if (!c) notFound();
  const aqi = await getCityAqi(c.en);
  return <CityLive city={c} ssrAqi={aqi} />;
}
