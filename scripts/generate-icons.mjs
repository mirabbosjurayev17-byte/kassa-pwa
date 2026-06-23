import sharp from 'sharp'
import { mkdir, readFile } from 'fs/promises'

await mkdir('public/icons', { recursive: true })

// Brand "K" monogram — Caribbean-green stroke on Rich Black, from public/icon.svg
const svg = await readFile('public/icon.svg')

await sharp(svg).resize(192, 192).png().toFile('public/icons/icon-192.png')
await sharp(svg).resize(512, 512).png().toFile('public/icons/icon-512.png')

console.log('Icons generated from public/icon.svg -> icon-192.png, icon-512.png')
