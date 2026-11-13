export type Lang = 'en' | 'bn';

export const STR = {
  en: {
    tagline: 'Air quality around you',
    useLocation: 'Use my location',
    searchArea: 'Search an area',
    privacy:
      'Your location is only used to find nearby air quality. Nothing is stored on any server.',
    locating: 'Finding your location…',
    locatingFailed: "Couldn't get your location",
    permitHint:
      'Allow location access for this site in your browser settings, or search an area instead.',
    unsupportedHint: 'Your browser does not support location.',
    searchTitle: 'Choose an area',
    searchPlaceholder: 'Search city or area…',
    popular: 'Popular areas',
    noResults: 'Nothing found. Try another spelling.',
    gps: 'Detected via GPS',
    manual: 'Selected area',
    updated: 'Updated {x}',
    whatNow: 'What you should do now',
    pollutants: 'Pollutant levels',
    next24: 'Next 24 hours',
    bestWindow: 'Best time to be out',
    now: 'Now',
    refresh: 'Refresh',
    share: 'Share',
    install: 'Install app',
    copied: 'Copied!',
    retry: 'Try again',
    fetchFail: "Couldn't load air quality data. Check your connection.",
    changeArea: 'Change area',
    estimated: 'Estimated from PM2.5',
    source: 'Data: Open-Meteo · CAMS model · US AQI scale',
    disclaimer: 'Model-based estimates — government monitors nearby can differ.',
    addHome: 'On iPhone: Share → “Add to Home Screen”',
    obChips: 'Nearby, via GPS|English / বাংলা|Installable app',
    low: 'Low',
    med: 'Medium',
    high: 'High',
    nearbyTitle: 'Nearby areas',
    savedTitle: 'Saved places',
    save: 'Save',
    rankingTitle: 'City AQI ranking',
    seeAll: 'See all',
    bd: 'Bangladesh',
    world: 'World',
    worstFirst: 'Most polluted',
    bestFirst: 'Cleanest',
    back: 'Back',
    loading: 'Loading…',
    rankFail: "Couldn't load ranking. Tap to retry.",
    searchCities: 'Search city or country…',
    nCities: '{n} cities',
    noMatch: 'No city matches your search.',
  },
  bn: {
    tagline: 'আশেপাশের বাতাসের মান',
    useLocation: 'আমার লোকেশন ব্যবহার করুন',
    searchArea: 'এলাকা খুঁজুন',
    privacy:
      'লোকেশন শুধু কাছাকাছি বাতাসের মান দেখানোর জন্য ব্যবহার হয় — কোনো সার্ভারে কিছু সেভ থাকে না।',
    locating: 'লোকেশন খোঁজা হচ্ছে…',
    locatingFailed: 'লোকেশন পাওয়া যায়নি',
    permitHint:
      'ব্রাউজার সেটিংস থেকে এই সাইটের লোকেশন পারমিশন দিন, অথবা এলাকা খুঁজে নিন।',
    unsupportedHint: 'আপনার ব্রাউজার লোকেশন সাপোর্ট করে না।',
    searchTitle: 'এলাকা বাছুন',
    searchPlaceholder: 'শহর বা এলাকা লিখুন…',
    popular: 'জনপ্রিয় এলাকা',
    noResults: 'কিছু পাওয়া যায়নি। বানান বদলে দেখুন।',
    gps: 'GPS থেকে শনাক্ত',
    manual: 'নির্বাচিত এলাকা',
    updated: '{x} এ আপডেট',
    whatNow: 'এখন আপনার করণীয়',
    pollutants: 'দূষণকারীর মাত্রা',
    next24: 'পরের ২৪ ঘণ্টা',
    bestWindow: 'বাইরে থাকার সেরা সময়',
    now: 'এখন',
    refresh: 'রিফ্রেশ',
    share: 'শেয়ার',
    install: 'অ্যাপ ইনস্টল',
    copied: 'কপি হয়েছে!',
    retry: 'আবার চেষ্টা করুন',
    fetchFail: 'বাতাসের তথ্য আনা যায়নি। ইন্টারনেট চেক করুন।',
    changeArea: 'এলাকা বদলান',
    estimated: 'PM2.5 থেকে আনুমানিক',
    source: 'তথ্য: Open-Meteo · CAMS মডেল · US AQI স্কেল',
    disclaimer: 'মডেলভিত্তিক হিসাব — কাছের সরকারি মনিটরে ভিন্ন হতে পারে।',
    addHome: 'আইফোনে: Share → “Add to Home Screen”',
    obChips: 'জিপিএসে কাছাকাছি|বাংলা / English|অ্যাপের মতো ইনস্টলযোগ্য',
    low: 'কম',
    med: 'মাঝারি',
    high: 'বেশি',
    nearbyTitle: 'কাছের এলাকা',
    savedTitle: 'সেভ করা জায়গা',
    save: 'সেভ',
    rankingTitle: 'শহরের AQI র‍্যাঙ্কিং',
    seeAll: 'সব দেখুন',
    bd: 'বাংলাদেশ',
    world: 'বিশ্ব',
    worstFirst: 'সবচেয়ে দূষিত',
    bestFirst: 'সবচেয়ে পরিষ্কার',
    back: 'ফিরে যান',
    loading: 'লোড হচ্ছে…',
    rankFail: 'র‍্যাঙ্কিং লোড করা যায়নি। আবার চেষ্টা করুন।',
    searchCities: 'শহর বা দেশ খুঁজুন…',
    nCities: '{n} টি শহর',
    noMatch: 'আপনার খোঁজার সাথে কোনো শহর মেলেনি।',
  },
} as const;

export type StrKey = keyof typeof STR.en;

export function makeT(lang: Lang): (k: StrKey) => string {
  return (k) => STR[lang][k] ?? STR.en[k];
}

/** Format an ISO timestamp as a short local time ("3:41 PM" / "দুপু ৩:৪১"). */
export function fmtTime(iso: string, lang: Lang): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(lang === 'bn' ? 'bn-BD' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
}

/** Format an ISO timestamp as an hour label ("3 PM" / "দুপু ৩টা"). */
export function fmtHour(iso: string, lang: Lang): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(lang === 'bn' ? 'bn-BD' : 'en-US', {
    hour: 'numeric',
  }).format(d);
}
