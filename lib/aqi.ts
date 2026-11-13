import type { IconName } from '../components/Icon';
import type { Lang } from './i18n';

export type BandKey =
  | 'good'
  | 'moderate'
  | 'usg'
  | 'unhealthy'
  | 'veryunhealthy'
  | 'hazardous';

export interface AdviceItem {
  icon: IconName;
  en: string;
  bn: string;
}

export interface Band {
  key: BandKey;
  max: number;
  en: string;
  bn: string;
  /** short form used in the scale-bar legend */
  sEn: string;
  sBn: string;
  color: string;
}

export const BANDS: Band[] = [
  {
    key: 'good',
    max: 50,
    en: 'Good',
    bn: 'ভালো',
    sEn: 'Good',
    sBn: 'ভালো',
    color: '#00d97d',
  },
  {
    key: 'moderate',
    max: 100,
    en: 'Moderate',
    bn: 'মধ্যম',
    sEn: 'Moderate',
    sBn: 'মধ্যম',
    color: '#ffd43d',
  },
  {
    key: 'usg',
    max: 150,
    en: 'Unhealthy for Sensitive Groups',
    bn: 'সংবেদনশীলদের জন্য অস্বাস্থ্যকর',
    sEn: 'Sensitive',
    sBn: 'সংবেদনশীল',
    color: '#ff9d42',
  },
  {
    key: 'unhealthy',
    max: 200,
    en: 'Unhealthy',
    bn: 'অস্বাস্থ্যকর',
    sEn: 'Unhealthy',
    sBn: 'অস্বাস্থ্যকর',
    color: '#ff5d5d',
  },
  {
    key: 'veryunhealthy',
    max: 300,
    en: 'Very Unhealthy',
    bn: 'খুব অস্বাস্থ্যকর',
    sEn: 'Very Unhealthy',
    sBn: 'খুব অস্বাস্থ্যকর',
    color: '#b06cff',
  },
  {
    key: 'hazardous',
    max: 500,
    en: 'Hazardous',
    bn: 'বিপজ্জনক',
    sEn: 'Hazardous',
    sBn: 'বিপজ্জনক',
    color: '#d5305c',
  },
];

export function bandOf(aqi: number): Band {
  for (const b of BANDS) if (aqi <= b.max) return b;
  return BANDS[BANDS.length - 1];
}

export const BAND_BG: Record<BandKey, string> = {
  good: '#0a1512',
  moderate: '#14130a',
  usg: '#160f09',
  unhealthy: '#170b0b',
  veryunhealthy: '#100a18',
  hazardous: '#150a10',
};

/* ---------------- Health advice per band ---------------- */

const ADVICE: Record<BandKey, AdviceItem[]> = {
  good: [
    {
      icon: 'run',
      en: 'Perfect for outdoor activity — walking, running, cycling are all safe.',
      bn: 'বাইরের কাজ বা ব্যায়ামের জন্য চমৎকার — হাঁটা, দৌড়ানো, সাইক্লিং সবই নিরাপদ।',
    },
    {
      icon: 'window',
      en: 'Let fresh air in — keeping windows open is fine today.',
      bn: 'জানালা খোলা রাখুন — আজ বাতাস পরিষ্কার।',
    },
    {
      icon: 'heart',
      en: 'Today’s air poses little or no health risk.',
      bn: 'আজকের বাতাস স্বাস্থ্যের জন্য প্রায় কোনো ঝুঁকি নেই।',
    },
  ],
  moderate: [
    {
      icon: 'alert',
      en: 'Acceptable for most people; unusually sensitive ones may feel mild irritation.',
      bn: 'বেশিরভাগ মানুষের জন্য ঠিক আছে; খুব সংবেদনশীলদের হালকা অস্বস্তি হতে পারে।',
    },
    {
      icon: 'run',
      en: 'If your throat or eyes feel irritated, shorten long outdoor workouts.',
      bn: 'গলা বা চোখে জ্বালা লাগলে দীর্ঘ বাইরের ব্যায়াম একটু কমিয়ে দিন।',
    },
    {
      icon: 'wind',
      en: 'Smoke or dust can spike in the evening — keep an eye out.',
      bn: 'সন্ধ্যায় ধোঁয়া বা ধুলোর মাত্রা বাড়তে পারে — খেয়াল রাখুন।',
    },
  ],
  usg: [
    {
      icon: 'alert',
      en: 'Sensitive groups — children, elderly, pregnant women, asthma & heart patients — should cut back long outdoor exertion.',
      bn: 'শিশু, বয়স্ক, গর্ভবতী নারী ও হাঁপানি-হৃদরোগীরা দীর্ঘ বাইরের কসরত কমান।',
    },
    {
      icon: 'mask',
      en: 'Wear a mask on busy roads and dusty lanes.',
      bn: 'ব্যস্ত বা ধুলোমাখা রাস্তায় মাস্ক পরুন।',
    },
    {
      icon: 'window',
      en: 'Keep windows closed during dust peaks; air the room out later.',
      bn: 'ধুলোর সময় জানালা বন্ধ রাখুন, পরে ঘর বাতাস করুন।',
    },
  ],
  unhealthy: [
    {
      icon: 'mask',
      en: 'Wear an N95/KN95 mask whenever you step out.',
      bn: 'বাইরে বের হলে N95 বা KN95 মাস্ক পরুন।',
    },
    {
      icon: 'run',
      en: 'Everyone: cut down prolonged outdoor activity — move workouts indoors.',
      bn: 'সবাই দীর্ঘ বাইরের কার্যকলাপ কমান — ব্যায়াম ঘরের ভেতরে নিন।',
    },
    {
      icon: 'window',
      en: 'Keep windows closed; run an air purifier if you have one.',
      bn: 'জানালা বন্ধ রাখুন; থাকলে এয়ার পিউরিফায়ার চালান।',
    },
    {
      icon: 'heart',
      en: 'People with breathing or heart conditions: stay alert for symptoms.',
      bn: 'শ্বাসকষ্ট বা হৃদরোগীরা শারীরিক লক্ষণের দিকে খেয়াল রাখুন।',
    },
  ],
  veryunhealthy: [
    {
      icon: 'home',
      en: 'Avoid going outside unless it is really necessary.',
      bn: 'খুব প্রয়োজন ছাড়া বাইরে বের হবেন না।',
    },
    {
      icon: 'mask',
      en: 'An N95 mask is a must if you must go out.',
      bn: 'যেতেই হলে অবশ্যই N95 মাস্ক পরুন।',
    },
    {
      icon: 'window',
      en: 'Keep windows shut all day; keep the purifier running.',
      bn: 'সারাদিন জানালা বন্ধ রাখুন; পিউরিফায়ার চালু রাখুন।',
    },
    {
      icon: 'alert',
      en: 'Children and the elderly should stay indoors completely.',
      bn: 'শিশু ও বয়স্করা সম্পূর্ণ ঘরের ভেতরে থাকুন।',
    },
  ],
  hazardous: [
    {
      icon: 'home',
      en: 'Health emergency: everyone should stay indoors.',
      bn: 'স্বাস্থ্য জরুরি অবস্থা — সবাই ঘরের ভেতরে থাকুন।',
    },
    {
      icon: 'window',
      en: 'Seal windows and doors; run the purifier at full power.',
      bn: 'জানালা-দরজা বন্ধ করুন; পিউরিফায়ার পুরো ক্ষমতায় চালান।',
    },
    {
      icon: 'run',
      en: 'No outdoor exercise at all.',
      bn: 'বাইরে কোনো ব্যায়াম একদমই নয়।',
    },
    {
      icon: 'alert',
      en: 'Shortness of breath or chest pain? Seek medical help fast.',
      bn: 'শ্বাসকষ্ট বা বুকে চাপ লাগলে দ্রুত চিকিৎসা নিন।',
    },
  ],
};

export function adviceFor(key: BandKey, lang: Lang): { icon: IconName; text: string }[] {
  return ADVICE[key].map((a) => ({ icon: a.icon, text: lang === 'bn' ? a.bn : a.en }));
}

/* ---------------- Pollutant definitions ---------------- */

export type PollutantKey = 'pm25' | 'pm10' | 'o3' | 'no2' | 'so2' | 'co';

export interface PollutantDef {
  key: PollutantKey;
  code: string;
  en: string;
  bn: string;
  lo: number; // below = low
  hi: number; // below = medium, above = high
}

export const POLLUTANTS: PollutantDef[] = [
  { key: 'pm25', code: 'PM2.5', en: 'Fine particles', bn: 'সূক্ষ্ম ধূলিকণা', lo: 12, hi: 35.5 },
  { key: 'pm10', code: 'PM10', en: 'Coarse dust', bn: 'মোটা ধুলো', lo: 54, hi: 154 },
  { key: 'o3', code: 'O₃', en: 'Ozone', bn: 'ওজোন', lo: 100, hi: 160 },
  { key: 'no2', code: 'NO₂', en: 'Nitrogen dioxide', bn: 'নাইট্রোজেন ডাইঅক্সাইড', lo: 40, hi: 100 },
  { key: 'so2', code: 'SO₂', en: 'Sulphur dioxide', bn: 'সালফার ডাইঅক্সাইড', lo: 40, hi: 120 },
  { key: 'co', code: 'CO', en: 'Carbon monoxide', bn: 'কার্বন মনোক্সাইড', lo: 4000, hi: 10000 },
];
