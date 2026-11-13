import sharp from 'sharp';

// 1200×630 Open Graph card — same visual language as the app (dark + wind glyph).
const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1420"/>
      <stop offset="1" stop-color="#070b10"/>
    </linearGradient>
    <radialGradient id="g1" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#14b8a6" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#14b8a6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#0ea5e9" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#0ea5e9" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="mark" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3ecf8e"/>
      <stop offset="0.5" stop-color="#14b8a6"/>
      <stop offset="1" stop-color="#0ea5e9"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" rx="0" fill="url(#bg)"/>
  <circle cx="180" cy="120" r="420" fill="url(#g1)"/>
  <circle cx="1060" cy="560" r="460" fill="url(#g2)"/>

  <!-- wind mark -->
  <g transform="translate(458 92)">
    <rect width="284" height="284" rx="66" fill="url(#mark)"/>
    <g transform="translate(40 40) scale(0.4)" fill="none" stroke="#ffffff" stroke-width="34"
       stroke-linecap="round" stroke-linejoin="round">
      <path d="M150 208h132a46 46 0 1 0-46-58"/>
      <path d="M118 284h204a52 52 0 1 1-52 62"/>
      <path d="M150 360h96"/>
    </g>
  </g>

  <text x="600" y="468" text-anchor="middle" fill="#eef4f9"
        font-family="Noto Sans Bengali, Bangla Sangam MN, Helvetica, Arial"
        font-size="84" font-weight="800">হাওয়া Hawa</text>
  <text x="600" y="524" text-anchor="middle" fill="#93a3b1"
        font-family="Noto Sans Bengali, Bangla Sangam MN, Helvetica, Arial"
        font-size="30" font-weight="500">আশেপাশের বাতাসের মান — Live Air Quality (AQI)</text>

  <!-- AQI band dots -->
  <g transform="translate(352 566)">
    <circle cx="0"  cy="0" r="9" fill="#00d97d"/><circle cx="42" cy="0" r="9" fill="#ffd43d"/>
    <circle cx="84" cy="0" r="9" fill="#ff9d42"/><circle cx="126" cy="0" r="9" fill="#ff5d5d"/>
    <circle cx="168" cy="0" r="9" fill="#b06cff"/><circle cx="210" cy="0" r="9" fill="#d5305c"/>
    <text x="248" y="9" fill="#64717e" font-family="Helvetica, Arial" font-size="24" font-weight="600">US AQI</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile('public/og.png');

console.log('✓ public/og.png generated');
