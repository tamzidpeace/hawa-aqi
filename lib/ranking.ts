import { fetchAqiBatch } from './api';

export type Region =
  | 'southasia'
  | 'asia'
  | 'mideast'
  | 'europe'
  | 'africa'
  | 'namerica'
  | 'samerica'
  | 'oceania';

export interface RankCity {
  en: string;
  bn: string;
  country?: string;
  countryBn?: string;
  region: Region;
  lat: number;
  lon: number;
}

export interface RankEntry extends RankCity {
  aqi: number | null;
}

export const REGIONS: { key: Region | 'all'; en: string; bn: string }[] = [
  { key: 'all', en: 'All', bn: 'সব' },
  { key: 'southasia', en: 'South Asia', bn: 'দক্ষিণ এশিয়া' },
  { key: 'asia', en: 'Asia', bn: 'এশিয়া' },
  { key: 'mideast', en: 'Middle East', bn: 'মধ্যপ্রাচ্য' },
  { key: 'europe', en: 'Europe', bn: 'ইউরোপ' },
  { key: 'africa', en: 'Africa', bn: 'আফ্রিকা' },
  { key: 'namerica', en: 'N. America', bn: 'উত্তর আমেরিকা' },
  { key: 'samerica', en: 'S. America', bn: 'দক্ষিণ আমেরিকা' },
  { key: 'oceania', en: 'Oceania', bn: 'ওশেনিয়া' },
];

export const BD_CITIES: RankCity[] = [
  { en: 'Dhaka', bn: 'ঢাকা', region: 'southasia', lat: 23.8106, lon: 90.4126 },
  { en: 'Chattogram', bn: 'চট্টগ্রাম', region: 'southasia', lat: 22.3569, lon: 91.7832 },
  { en: 'Khulna', bn: 'খুলনা', region: 'southasia', lat: 22.8456, lon: 89.5403 },
  { en: 'Rajshahi', bn: 'রাজশাহী', region: 'southasia', lat: 24.3745, lon: 88.6042 },
  { en: 'Sylhet', bn: 'সিলেট', region: 'southasia', lat: 24.8949, lon: 91.8687 },
  { en: 'Barishal', bn: 'বরিশাল', region: 'southasia', lat: 22.7016, lon: 90.3535 },
  { en: 'Rangpur', bn: 'রংপুর', region: 'southasia', lat: 25.7439, lon: 89.2752 },
  { en: 'Mymensingh', bn: 'ময়মনসিংহ', region: 'southasia', lat: 24.7471, lon: 90.4203 },
  { en: 'Cumilla', bn: 'কুমিল্লা', region: 'southasia', lat: 23.4607, lon: 91.1809 },
  { en: 'Narayanganj', bn: 'নারায়ণগঞ্জ', region: 'southasia', lat: 23.6238, lon: 90.4998 },
  { en: 'Gazipur', bn: 'গাজীপুর', region: 'southasia', lat: 24.0023, lon: 90.4263 },
  { en: 'Bogura', bn: 'বগুড়া', region: 'southasia', lat: 24.8481, lon: 89.3719 },
  { en: 'Jashore', bn: 'যশোর', region: 'southasia', lat: 23.1664, lon: 89.2081 },
  { en: 'Dinajpur', bn: 'দিনাজপুর', region: 'southasia', lat: 25.6217, lon: 88.6354 },
  { en: "Cox's Bazar", bn: 'কক্সবাজার', region: 'southasia', lat: 21.4272, lon: 92.0058 },
  { en: 'Savar', bn: 'সাভার', region: 'southasia', lat: 23.8583, lon: 90.2667 },
];

/** [en, bn, country, countryBn, region, lat, lon] */
type Row = [string, string, string, string, Region, number, number];

const WORLD_ROWS: Row[] = [
  // ---- South Asia ----
  ['Delhi', 'দিল্লি', 'India', 'ভারত', 'southasia', 28.6139, 77.209],
  ['Karachi', 'করাচি', 'Pakistan', 'পাকিস্তান', 'southasia', 24.8607, 67.0011],
  ['Islamabad', 'ইসলামাবাদ', 'Pakistan', 'পাকিস্তান', 'southasia', 33.6844, 73.0479],
  ['Kathmandu', 'কাঠমান্ডু', 'Nepal', 'নেপাল', 'southasia', 27.7172, 85.324],
  ['Thimphu', 'থিম্পু', 'Bhutan', 'ভুটান', 'southasia', 27.4728, 89.639],
  ['Colombo', 'কলম্বো', 'Sri Lanka', 'শ্রীলঙ্কা', 'southasia', 6.9271, 79.8612],
  ['Malé', 'মালে', 'Maldives', 'মালদ্বীপ', 'southasia', 4.1755, 73.5093],
  ['Kabul', 'কাবুল', 'Afghanistan', 'আফগানিস্তান', 'southasia', 34.5553, 69.2075],
  // ---- East / Southeast / Central Asia ----
  ['Beijing', 'বেইজিং', 'China', 'চীন', 'asia', 39.9042, 116.4074],
  ['Shanghai', 'সাংহাই', 'China', 'চীন', 'asia', 31.2304, 121.4737],
  ['Hong Kong', 'হংকং', 'Hong Kong SAR', 'হংকং', 'asia', 22.3193, 114.1694],
  ['Tokyo', 'টোকিও', 'Japan', 'জাপান', 'asia', 35.6762, 139.6503],
  ['Osaka', 'ওসাকা', 'Japan', 'জাপান', 'asia', 34.6937, 135.5023],
  ['Seoul', 'সিউল', 'South Korea', 'দক্ষিণ কোরিয়া', 'asia', 37.5665, 126.978],
  ['Pyongyang', 'পিয়ংইয়াং', 'North Korea', 'উত্তর কোরিয়া', 'asia', 39.0392, 125.7625],
  ['Taipei', 'তাইপেই', 'Taiwan', 'তাইওয়ান', 'asia', 25.033, 121.5654],
  ['Ulaanbaatar', 'উলানবাটর', 'Mongolia', 'মঙ্গোলিয়া', 'asia', 47.8864, 106.9057],
  ['Manila', 'ম্যানিলা', 'Philippines', 'ফিলিপাইন', 'asia', 14.5995, 120.9842],
  ['Hanoi', 'হ্যানয়', 'Vietnam', 'ভিয়েতনাম', 'asia', 21.0278, 105.8342],
  ['Ho Chi Minh City', 'হো চি মিন সিটি', 'Vietnam', 'ভিয়েতনাম', 'asia', 10.8231, 106.6297],
  ['Bangkok', 'ব্যাংকক', 'Thailand', 'থাইল্যান্ড', 'asia', 13.7563, 100.5018],
  ['Vientiane', 'ভিয়েনতিয়েন', 'Laos', 'লাওস', 'asia', 17.9757, 102.6331],
  ['Phnom Penh', 'নমপেন', 'Cambodia', 'কম্বোডিয়া', 'asia', 11.5625, 104.9161],
  ['Yangon', 'ইয়াঙ্গুন', 'Myanmar', 'মায়ানমার', 'asia', 16.8661, 96.1951],
  ['Kuala Lumpur', 'কুয়ালালামপুর', 'Malaysia', 'মালয়েশিয়া', 'asia', 3.139, 101.6869],
  ['Singapore', 'সিঙ্গাপুর', 'Singapore', 'সিঙ্গাপুর', 'asia', 1.3521, 103.8198],
  ['Jakarta', 'জাকার্তা', 'Indonesia', 'ইন্দোনেশিয়া', 'asia', -6.2088, 106.8456],
  ['Astana', 'আস্তানা', 'Kazakhstan', 'কাজাখস্তান', 'asia', 51.1694, 71.4491],
  ['Tashkent', 'তাসখন্দ', 'Uzbekistan', 'উজবেকিস্তান', 'asia', 41.2995, 69.2401],
  ['Bishkek', 'বিশকেক', 'Kyrgyzstan', 'কিরগিজস্তান', 'asia', 42.8746, 74.5698],
  ['Dushanbe', 'দুশানবে', 'Tajikistan', 'তাজিকিস্তান', 'asia', 38.5598, 68.787],
  ['Ashgabat', 'আশগাবাত', 'Turkmenistan', 'তুর্কমেনিস্তান', 'asia', 37.96, 58.3261],
  // ---- Middle East ----
  ['Riyadh', 'রিয়াদ', 'Saudi Arabia', 'সৌদি আরব', 'mideast', 24.7136, 46.6753],
  ['Jeddah', 'জেদ্দা', 'Saudi Arabia', 'সৌদি আরব', 'mideast', 21.4858, 39.1925],
  ['Dubai', 'দুবাই', 'UAE', 'সংযুক্ত আরব আমিরাত', 'mideast', 25.2048, 55.2708],
  ['Doha', 'দোহা', 'Qatar', 'কাতার', 'mideast', 25.2854, 51.531],
  ['Kuwait City', 'কুয়েত সিটি', 'Kuwait', 'কুয়েত', 'mideast', 29.3759, 47.9774],
  ['Manama', 'মানামা', 'Bahrain', 'বাহরাইন', 'mideast', 26.2285, 50.586],
  ['Muscat', 'মাসকাট', 'Oman', 'ওমান', 'mideast', 23.588, 58.3829],
  ['Tehran', 'তেহরান', 'Iran', 'ইরান', 'mideast', 35.6892, 51.389],
  ['Baghdad', 'বাগদাদ', 'Iraq', 'ইরাক', 'mideast', 33.3152, 44.3661],
  ['Amman', 'আম্মান', 'Jordan', 'জর্ডান', 'mideast', 31.9539, 35.9106],
  ['Beirut', 'বৈরুত', 'Lebanon', 'লেবানন', 'mideast', 33.8938, 35.5018],
  ['Damascus', 'দামেস্ক', 'Syria', 'সিরিয়া', 'mideast', 33.5138, 36.2765],
  ['Tel Aviv', 'তেল আবিব', 'Israel', 'ইসরায়েল', 'mideast', 32.0853, 34.7818],
  ['Istanbul', 'ইস্তাম্বুল', 'Türkiye', 'তুরস্ক', 'mideast', 41.0082, 28.9784],
  ['Sanaa', 'সানা', 'Yemen', 'ইয়েমেন', 'mideast', 15.3694, 44.191],
  // ---- Europe ----
  ['London', 'লন্ডন', 'UK', 'যুক্তরাজ্য', 'europe', 51.5074, -0.1278],
  ['Paris', 'প্যারিস', 'France', 'ফ্রান্স', 'europe', 48.8566, 2.3522],
  ['Berlin', 'বার্লিন', 'Germany', 'জার্মানি', 'europe', 52.52, 13.405],
  ['Madrid', 'মাদ্রিদ', 'Spain', 'স্পেন', 'europe', 40.4168, -3.7038],
  ['Barcelona', 'বার্সেলোনা', 'Spain', 'স্পেন', 'europe', 41.3874, 2.1686],
  ['Lisbon', 'লিসবন', 'Portugal', 'পর্তুগাল', 'europe', 38.7223, -9.1393],
  ['Rome', 'রোম', 'Italy', 'ইতালি', 'europe', 41.9028, 12.4964],
  ['Milan', 'মিলান', 'Italy', 'ইতালি', 'europe', 45.4642, 9.19],
  ['Vienna', 'ভিয়েনা', 'Austria', 'অস্ট্রিয়া', 'europe', 48.2082, 16.3738],
  ['Zurich', 'জুরিখ', 'Switzerland', 'সুইজারল্যান্ড', 'europe', 47.3769, 8.5417],
  ['Amsterdam', 'আমস্টারডাম', 'Netherlands', 'নেদারল্যান্ডস', 'europe', 52.3676, 4.9041],
  ['Brussels', 'ব্রাসেলস', 'Belgium', 'বেলজিয়াম', 'europe', 50.8503, 4.3517],
  ['Luxembourg', 'লাক্সেমবার্গ', 'Luxembourg', 'লাক্সেমবার্গ', 'europe', 49.6116, 6.1319],
  ['Copenhagen', 'কোপেনহেগেন', 'Denmark', 'ডেনমার্ক', 'europe', 55.6761, 12.5683],
  ['Stockholm', 'স্টকহোম', 'Sweden', 'সুইডেন', 'europe', 59.3293, 18.0686],
  ['Oslo', 'অসলো', 'Norway', 'নরওয়ে', 'europe', 59.9139, 10.7522],
  ['Helsinki', 'হেলসিঙ্কি', 'Finland', 'ফিনল্যান্ড', 'europe', 60.1699, 24.9384],
  ['Reykjavik', 'রেইকজাভিক', 'Iceland', 'আইসল্যান্ড', 'europe', 64.1466, -21.9426],
  ['Dublin', 'ডাবলিন', 'Ireland', 'আয়ারল্যান্ড', 'europe', 53.3498, -6.2603],
  ['Warsaw', 'ওয়ারশ', 'Poland', 'পোল্যান্ড', 'europe', 52.2297, 21.0122],
  ['Prague', 'প্রাগ', 'Czechia', 'চেকিয়া', 'europe', 50.0755, 14.4378],
  ['Budapest', 'বুদাপেস্ট', 'Hungary', 'হাঙ্গেরি', 'europe', 47.4979, 19.0402],
  ['Bratislava', 'ব্রাতিস্লাভা', 'Slovakia', 'স্লোভাকিয়া', 'europe', 48.1486, 17.1077],
  ['Ljubljana', 'লিউব্লিয়ানা', 'Slovenia', 'স্লোভেনিয়া', 'europe', 46.0569, 14.5058],
  ['Zagreb', 'জাগরেব', 'Croatia', 'ক্রোয়েশিয়া', 'europe', 45.815, 15.9819],
  ['Belgrade', 'বেলগ্রেড', 'Serbia', 'সার্বিয়া', 'europe', 44.7866, 20.4489],
  ['Sarajevo', 'সারায়েভো', 'Bosnia & Herzegovina', 'বসনিয়া ও হার্জেগোভিনা', 'europe', 43.8563, 18.4131],
  ['Tirana', 'তিরানা', 'Albania', 'আলবেনিয়া', 'europe', 41.3275, 19.8187],
  ['Skopje', 'স্কোপিয়ে', 'North Macedonia', 'উত্তর ম্যাসিডোনিয়া', 'europe', 41.9981, 21.4254],
  ['Athens', 'এথেন্স', 'Greece', 'গ্রিস', 'europe', 37.9838, 23.7275],
  ['Sofia', 'সোফিয়া', 'Bulgaria', 'বুলগেরিয়া', 'europe', 42.6977, 23.3219],
  ['Bucharest', 'বুখারেস্ট', 'Romania', 'রোমানিয়া', 'europe', 44.4268, 26.1025],
  ['Chișinău', 'কিশিনাউ', 'Moldova', 'মলদোভা', 'europe', 47.0105, 28.8638],
  ['Kyiv', 'কিয়েভ', 'Ukraine', 'ইউক্রেন', 'europe', 50.4501, 30.5234],
  ['Minsk', 'মিনস্ক', 'Belarus', 'বেলারুশ', 'europe', 53.9006, 27.559],
  ['Moscow', 'মস্কো', 'Russia', 'রাশিয়া', 'europe', 55.7558, 37.6173],
  ['St Petersburg', 'সেন্ট পিটার্সবার্গ', 'Russia', 'রাশিয়া', 'europe', 59.9311, 30.3609],
  ['Riga', 'রিগা', 'Latvia', 'লাটভিয়া', 'europe', 56.8796, 24.6032],
  ['Vilnius', 'ভিলনিয়াস', 'Lithuania', 'লিথুয়ানিয়া', 'europe', 54.6872, 25.2797],
  ['Tallinn', 'তালিন', 'Estonia', 'এস্তোনিয়া', 'europe', 59.437, 24.7536],
  ['Nicosia', 'নিকোসিয়া', 'Cyprus', 'সাইপ্রাস', 'europe', 35.1856, 33.3823],
  ['Yerevan', 'ইয়েরেভান', 'Armenia', 'আর্মেনিয়া', 'europe', 40.1792, 44.4991],
  ['Baku', 'বাকু', 'Azerbaijan', 'আজারবাইজান', 'europe', 40.4093, 49.8671],
  ['Tbilisi', 'তিবিলিসি', 'Georgia', 'জর্জিয়া', 'europe', 41.7151, 44.8271],
  // ---- Africa ----
  ['Cairo', 'কায়রো', 'Egypt', 'মিশর', 'africa', 30.0444, 31.2357],
  ['Tripoli', 'ত্রিপোলি', 'Libya', 'লিবিয়া', 'africa', 32.8872, 13.1913],
  ['Tunis', 'টিউনিস', 'Tunisia', 'তিউনিসিয়া', 'africa', 36.8065, 10.1815],
  ['Algiers', 'আলজিয়ার্স', 'Algeria', 'আলজেরিয়া', 'africa', 36.7538, 3.0588],
  ['Casablanca', 'কাসাব্লাঙ্কা', 'Morocco', 'মরক্কো', 'africa', 33.5731, -7.5898],
  ['Nouakchott', 'নুয়াকশট', 'Mauritania', 'মরিতানিয়া', 'africa', 18.0735, -15.9582],
  ['Dakar', 'ডাকার', 'Senegal', 'সেনেগাল', 'africa', 14.7167, -17.4677],
  ['Bamako', 'বামাকো', 'Mali', 'মালি', 'africa', 12.6392, -8.0029],
  ['Ouagadougou', 'ওয়াগাডুগু', 'Burkina Faso', 'বুর্কিনা ফাসো', 'africa', 12.3714, -1.5197],
  ['Abidjan', 'আবিজান', "Côte d'Ivoire", 'কোত দিভোয়ার', 'africa', 5.3599, -4.0083],
  ['Accra', 'আকরা', 'Ghana', 'ঘানা', 'africa', 5.6037, -0.187],
  ['Lomé', 'লোমে', 'Togo', 'টোগো', 'africa', 6.1319, 1.2228],
  ['Cotonou', 'কোতোনু', 'Benin', 'বেনিন', 'africa', 6.3703, 2.3912],
  ['Lagos', 'লাগোস', 'Nigeria', 'নাইজেরিয়া', 'africa', 6.5244, 3.3792],
  ['Abuja', 'আবুজা', 'Nigeria', 'নাইজেরিয়া', 'africa', 9.0765, 7.3986],
  ['Niamey', 'নিয়ামে', 'Niger', 'নাইজার', 'africa', 13.5127, 2.1128],
  ["N'Djamena", 'এনজামেনা', 'Chad', 'চাদ', 'africa', 12.1348, 15.0557],
  ['Khartoum', 'খার্তুম', 'Sudan', 'সুদান', 'africa', 15.5007, 32.5599],
  ['Addis Ababa', 'আদ্দিস আবাবা', 'Ethiopia', 'ইথিওপিয়া', 'africa', 9.032, 38.7469],
  ['Asmara', 'আসমারা', 'Eritrea', 'ইরিত্রিয়া', 'africa', 15.3229, 38.9251],
  ['Djibouti', 'জিবুতি', 'Djibouti', 'জিবুতি', 'africa', 11.5721, 43.1456],
  ['Mogadishu', 'মোগাদিশু', 'Somalia', 'সোমালিয়া', 'africa', 2.0469, 45.3182],
  ['Nairobi', 'নাইরোবি', 'Kenya', 'কেনিয়া', 'africa', -1.2864, 36.8172],
  ['Kampala', 'কাম্পালা', 'Uganda', 'উগান্ডা', 'africa', 0.3476, 32.5825],
  ['Kigali', 'কিগালি', 'Rwanda', 'রুয়ান্ডা', 'africa', -1.9441, 30.0619],
  ['Bujumbura', 'বুজুম্বুরা', 'Burundi', 'বুরুন্ডি', 'africa', -3.3877, 29.3606],
  ['Dar es Salaam', 'দার এস সালাম', 'Tanzania', 'তানজানিয়া', 'africa', -6.7924, 39.2083],
  ['Kinshasa', 'কিনশাসা', 'DR Congo', 'গণতান্ত্রিক কঙ্গো', 'africa', -4.4419, 15.2663],
  ['Brazzaville', 'ব্রাজাভিল', 'Congo', 'কঙ্গো', 'africa', -4.2634, 15.2429],
  ['Bangui', 'বাঙ্গুই', 'Central African Rep.', 'মধ্য আফ্রিকান প্রজাতন্ত্র', 'africa', 4.3947, 18.5582],
  ['Yaoundé', 'ইয়াউন্দে', 'Cameroon', 'ক্যামেরুন', 'africa', 3.848, 11.5021],
  ['Libreville', 'লিব্রেভিল', 'Gabon', 'গ্যাবন', 'africa', 0.4162, 9.4673],
  ['Malabo', 'মালাবো', 'Equatorial Guinea', 'নিরক্ষীয় গিনি', 'africa', 3.7504, 8.7371],
  ['Luanda', 'লুয়ান্ডা', 'Angola', 'অ্যাঙ্গোলা', 'africa', -8.839, 13.2894],
  ['Lusaka', 'লুসাকা', 'Zambia', 'জাম্বিয়া', 'africa', -15.3875, 28.3228],
  ['Harare', 'হারারে', 'Zimbabwe', 'জিম্বাবুয়ে', 'africa', -17.8252, 31.0335],
  ['Maputo', 'মাপুতো', 'Mozambique', 'মোজাম্বিক', 'africa', -25.9692, 32.5732],
  ['Lilongwe', 'লিলংওয়ে', 'Malawi', 'মালাউই', 'africa', -13.9626, 33.7741],
  ['Gaborone', 'গাবোরোন', 'Botswana', 'বতসোয়ানা', 'africa', -24.6282, 25.9231],
  ['Windhoek', 'উইন্ডহোক', 'Namibia', 'নামিবিয়া', 'africa', -22.5597, 17.0832],
  ['Johannesburg', 'জোহানেসবার্গ', 'South Africa', 'দক্ষিণ আফ্রিকা', 'africa', -26.2041, 28.0473],
  ['Maseru', 'মাসেরু', 'Lesotho', 'লেসোথো', 'africa', -29.3151, 27.4869],
  ['Mbabane', 'এমবাবানে', 'Eswatini', 'এসওয়াতিনি', 'africa', -26.3054, 31.1367],
  ['Antananarivo', 'আন্তানানারিভো', 'Madagascar', 'মাদাগাস্কার', 'africa', -18.8792, 47.5079],
  ['Port Louis', 'পোর্ট লুই', 'Mauritius', 'মরিশাস', 'africa', -20.1609, 57.5012],
  ['Praia', 'প্রাইয়া', 'Cabo Verde', 'কেপ ভার্দে', 'africa', 14.933, -23.5133],
  // ---- North America ----
  ['Washington DC', 'ওয়াশিংটন ডিসি', 'USA', 'যুক্তরাষ্ট্র', 'namerica', 38.9072, -77.0369],
  ['New York', 'নিউ ইয়র্ক', 'USA', 'যুক্তরাষ্ট্র', 'namerica', 40.7128, -74.006],
  ['Los Angeles', 'লস অ্যাঞ্জেলেস', 'USA', 'যুক্তরাষ্ট্র', 'namerica', 34.0522, -118.2437],
  ['Chicago', 'শিকাগো', 'USA', 'যুক্তরাষ্ট্র', 'namerica', 41.8781, -87.6298],
  ['Ottawa', 'অটোয়া', 'Canada', 'কানাডা', 'namerica', 45.4215, -75.6972],
  ['Toronto', 'টরন্টো', 'Canada', 'কানাডা', 'namerica', 43.6532, -79.3832],
  ['Montreal', 'মন্ট্রিল', 'Canada', 'কানাডা', 'namerica', 45.5019, -73.5674],
  ['Vancouver', 'ভ্যাঙ্কুভার', 'Canada', 'কানাডা', 'namerica', 49.2827, -123.1207],
  ['Mexico City', 'মেক্সিকো সিটি', 'Mexico', 'মেক্সিকো', 'namerica', 19.4326, -99.1332],
  ['Guatemala City', 'গুয়াতেমালা সিটি', 'Guatemala', 'গুয়াতেমালা', 'namerica', 14.6349, -90.5069],
  ['Havana', 'হাভানা', 'Cuba', 'কিউবা', 'namerica', 23.1136, -82.3666],
  ['Kingston', 'কিংস্টন', 'Jamaica', 'জ্যামাইকা', 'namerica', 18.0179, -76.8099],
  ['Santo Domingo', 'সান্তো ডোমিঙ্গো', 'Dominican Rep.', 'ডোমিনিকান প্রজাতন্ত্র', 'namerica', 18.4861, -69.9312],
  ['San Juan', 'সান হুয়ান', 'Puerto Rico', 'পুয়ের্তো রিকো', 'namerica', 18.4655, -66.1057],
  ['Port-au-Prince', 'পোর্ট-অ-প্রিন্স', 'Haiti', 'হাইতি', 'namerica', 18.5944, -72.3074],
  ['San José', 'সান হোসে', 'Costa Rica', 'কোস্টা রিকা', 'namerica', 9.9281, -84.0907],
  ['Panama City', 'পানামা সিটি', 'Panama', 'পানামা', 'namerica', 8.9824, -79.5199],
  ['Tegucigalpa', 'তেগুসিগালপা', 'Honduras', 'হন্ডুরাস', 'namerica', 14.0723, -87.1921],
  ['Managua', 'মানাগুয়া', 'Nicaragua', 'নিকারাগুয়া', 'namerica', 12.115, -86.2362],
  ['San Salvador', 'সান সালভাদর', 'El Salvador', 'এল সালভাদর', 'namerica', 13.6929, -89.2182],
  ['Nassau', 'নাসাউ', 'Bahamas', 'বাহামাস', 'namerica', 25.0443, -77.3504],
  ['Port of Spain', 'পোর্ট অব স্পেন', 'Trinidad & Tobago', 'ত্রিনিদাদ ও টোবাগো', 'namerica', 10.6549, -61.5019],
  // ---- South America ----
  ['Bogotá', 'বোগোটা', 'Colombia', 'কলম্বিয়া', 'samerica', 4.711, -74.0721],
  ['Caracas', 'কারাকাস', 'Venezuela', 'ভেনেজুয়েলা', 'samerica', 10.4806, -66.9036],
  ['Quito', 'কিটো', 'Ecuador', 'ইকুয়েডর', 'samerica', -0.1807, -78.4678],
  ['Lima', 'লিমা', 'Peru', 'পেরু', 'samerica', -12.0464, -77.0428],
  ['La Paz', 'লা পাজ', 'Bolivia', 'বলিভিয়া', 'samerica', -16.4897, -68.1193],
  ['Santiago', 'সান্তিয়াগো', 'Chile', 'চিলি', 'samerica', -33.4489, -70.6693],
  ['Buenos Aires', 'বুয়েনস আইরেস', 'Argentina', 'আর্জেন্টিনা', 'samerica', -34.6037, -58.3816],
  ['Montevideo', 'মন্টেভিডেও', 'Uruguay', 'উরুগুয়ে', 'samerica', -34.9011, -56.1645],
  ['Asunción', 'আসুনসিওন', 'Paraguay', 'প্যারাগুয়ে', 'samerica', -25.2637, -57.5759],
  ['Brasília', 'ব্রাসিলিয়া', 'Brazil', 'ব্রাজিল', 'samerica', -15.7939, -47.8828],
  ['São Paulo', 'সাও পাওলো', 'Brazil', 'ব্রাজিল', 'samerica', -23.5505, -46.6333],
  ['Rio de Janeiro', 'রিও ডি জেনেইরো', 'Brazil', 'ব্রাজিল', 'samerica', -22.9068, -43.1729],
  ['Georgetown', 'জর্জটাউন', 'Guyana', 'গায়ানা', 'samerica', 6.8013, -58.1551],
  ['Paramaribo', 'পারামারিবো', 'Suriname', 'সুরিনাম', 'samerica', 5.852, -55.2038],
  // ---- Oceania ----
  ['Canberra', 'ক্যানবেরা', 'Australia', 'অস্ট্রেলিয়া', 'oceania', -35.2809, 149.13],
  ['Sydney', 'সিডনি', 'Australia', 'অস্ট্রেলিয়া', 'oceania', -33.8688, 151.2093],
  ['Melbourne', 'মেলবোর্ন', 'Australia', 'অস্ট্রেলিয়া', 'oceania', -37.8136, 144.9631],
  ['Wellington', 'ওয়েলিংটন', 'New Zealand', 'নিউজিল্যান্ড', 'oceania', -41.2865, 174.7762],
  ['Auckland', 'অকল্যান্ড', 'New Zealand', 'নিউজিল্যান্ড', 'oceania', -36.8485, 174.7633],
  ['Port Moresby', 'পোর্ট মোরেসবি', 'Papua New Guinea', 'পাপুয়া নিউগিনি', 'oceania', -9.4438, 147.1803],
  ['Suva', 'সুভা', 'Fiji', 'ফিজি', 'oceania', -18.1416, 178.4419],
  ['Honiara', 'হনিয়ারা', 'Solomon Islands', 'সলোমন দ্বীপপুঞ্জ', 'oceania', -9.4319, 159.9556],
  ['Port Vila', 'পোর্ট ভিলা', 'Vanuatu', 'ভানুয়াতু', 'oceania', -17.7333, 168.3273],
  ['Apia', 'আপিয়া', 'Samoa', 'সামোয়া', 'oceania', -13.8333, -171.7667],
];

export const WORLD_CITIES: RankCity[] = WORLD_ROWS.map(
  ([en, bn, country, countryBn, region, lat, lon]) => ({
    en,
    bn,
    country,
    countryBn,
    region,
    lat,
    lon,
  }),
);

const CACHE_KEY = 'hawa.rank.v2';
const TTL = 10 * 60 * 1000;

interface RankCache {
  t: number;
  bd: RankEntry[];
  world: RankEntry[];
}

/** localStorage only exists in the browser — this module also runs on the server. */
const hasLS = () => typeof localStorage !== 'undefined';

function readCache(): RankCache | null {
  if (!hasLS()) return null;
  try {
    const c: RankCache = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (c && Date.now() - c.t < TTL && c.bd?.length && c.world?.length) return c;
  } catch {
    /* ignore */
  }
  return null;
}

async function build(list: RankCity[]): Promise<RankEntry[]> {
  // share one TTL-cached batch (also used by the city pages) instead of
  // re-fetching when the module already has fresh values
  const m = await allCityAqis();
  if (!m.size) throw new Error('aqi batch unavailable');
  return list.map((c) => ({ ...c, aqi: m.get(c.en) ?? null }));
}

/** Ranked list for a group; caches both groups for 10 minutes. */
export async function getRanking(group: 'bd' | 'world'): Promise<RankEntry[]> {
  const c = readCache();
  if (c) return sortEntries(c[group]);
  const [bd, world] = await Promise.all([build(BD_CITIES), build(WORLD_CITIES)]);
  const next: RankCache = { t: Date.now(), bd, world };
  try {
    if (hasLS()) localStorage.setItem(CACHE_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return sortEntries(next[group]);
}

/* ---------------- city landing pages (/aqi/[city]) ---------------- */

export interface CityPageInfo extends RankCity {
  slug: string;
  bd: boolean;
}

function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics (São Paulo → sao-paulo)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function withSlugs(list: RankCity[], bd: boolean): CityPageInfo[] {
  const seen = new Set<string>();
  return list.map((c) => {
    let slug = slugify(c.en);
    while (seen.has(slug)) slug = `${slug}-2`;
    seen.add(slug);
    return { ...c, slug, bd };
  });
}

export const ALL_CITIES: CityPageInfo[] = [
  ...withSlugs(BD_CITIES, true),
  ...withSlugs(WORLD_CITIES, false),
];

export function cityBySlug(slug: string): CityPageInfo | null {
  return ALL_CITIES.find((c) => c.slug === slug) ?? null;
}

/**
 * AQI for every city, fetched in a few batched requests and shared across
 * all city pages (server-side, TTL-refreshed so warm processes stay fresh).
 */
let aqiMap: { at: number; promise: Promise<Map<string, number | null>> } | null = null;

export function allCityAqis(): Promise<Map<string, number | null>> {
  if (!aqiMap || Date.now() - aqiMap.at > TTL) {
    const promise = fetchAqiBatch(ALL_CITIES)
      .then((vals) => {
        const m = new Map<string, number | null>();
        ALL_CITIES.forEach((c, i) => m.set(c.en, vals[i] ?? null));
        return m;
      })
      .catch(() => {
        aqiMap = null; // allow retry on next call
        return new Map<string, number | null>();
      });
    aqiMap = { at: Date.now(), promise };
  }
  return aqiMap.promise;
}

export async function getCityAqi(en: string): Promise<number | null> {
  return (await allCityAqis()).get(en) ?? null;
}

export function sortEntries(entries: RankEntry[], dir: 'worst' | 'best' = 'worst'): RankEntry[] {
  return [...entries].sort((a, b) => {
    if (a.aqi == null && b.aqi == null) return 0;
    if (a.aqi == null) return 1;
    if (b.aqi == null) return -1;
    return dir === 'worst' ? b.aqi - a.aqi : a.aqi - b.aqi;
  });
}
