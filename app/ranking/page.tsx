import type { Metadata } from 'next';
import { RankingClient } from '../../components/RankingClient';
import { getRanking, sortEntries, type RankEntry } from '../../lib/ranking';

// always render fresh: SSR per request so the ranking is live even right
// after a deploy (the shared batch cache keeps upstream requests low)
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'City AQI Ranking — Bangladesh & World',
  description:
    'Live air quality ranking of 16 Bangladeshi cities and 183 world cities (capitals & major cities) — most polluted to cleanest, with region filters. শহরের AQI র‍্যাঙ্কিং।',
  alternates: { canonical: '/ranking' },
};

export default async function RankingPage() {
  let initial: RankEntry[] | null = null;
  try {
    initial = sortEntries(await getRanking('bd'), 'worst');
  } catch {
    initial = null;
  }
  return <RankingClient initialBd={initial} />;
}
