import sharp from 'sharp'
import { mkdir } from 'fs/promises'

await mkdir('public/icons', { recursive: true })

// SVG icon: "K" harfi ko'k, ink (qora) yumaloq kvadrat ustida
const svg = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#0F172A"/>
  <text
    x="50%"
    y="54%"
    dominant-baseline="middle"
    text-anchor="middle"
    font-family="Arial Black, sans-serif"
    font-weight="900"
    font-size="${size * 0.52}"
    fill="#0077CC"
  >K</text>
</svg>`

await sharp(Buffer.from(svg(192))).png().toFile('public/icons/icon-192.png')
await sharp(Buffer.from(svg(512))).png().toFile('public/icons/icon-512.png')

console.log('✓ Icons generated: public/icons/icon-192.png, icon-512.png')
