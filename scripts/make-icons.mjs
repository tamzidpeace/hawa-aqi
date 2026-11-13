import sharp from 'sharp';
import { mkdirSync, copyFileSync } from 'node:fs';

mkdirSync('public/icons', { recursive: true });

const opts = { density: 512 };

await sharp('assets/icon.svg', opts).resize(512, 512).png({ compressionLevel: 9 }).toFile('public/icons/icon-512.png');
await sharp('assets/icon.svg', opts).resize(192, 192).png().toFile('public/icons/icon-192.png');
await sharp('assets/icon.svg', opts).resize(180, 180).png().toFile('public/icons/apple-touch-180.png');
await sharp('assets/maskable.svg', opts).resize(512, 512).png({ compressionLevel: 9 }).toFile('public/icons/maskable-512.png');

copyFileSync('assets/icon.svg', 'public/favicon.svg');

console.log('✓ icons generated');
