#!/usr/bin/env node
/**
 * convert-to-webp.mjs - PNG/JPEG画像をWebPに変換
 */

import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

const postsDir = 'public/posts';

async function findImages(dir) {
  const images = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      images.push(...await findImages(fullPath));
    } else if (/\.(png|jpg|jpeg)$/i.test(entry.name)) {
      images.push(fullPath);
    }
  }

  return images;
}

async function convertToWebP(imagePath) {
  const ext = extname(imagePath);
  const outputPath = imagePath.replace(ext, '.webp');

  console.log(`Converting: ${imagePath} -> ${outputPath}`);

  await sharp(imagePath)
    .webp({ quality: 85 })
    .toFile(outputPath);

  const originalStats = await stat(imagePath);
  const webpStats = await stat(outputPath);

  const reduction = ((1 - webpStats.size / originalStats.size) * 100).toFixed(1);
  console.log(`  Original: ${(originalStats.size / 1024).toFixed(1)}KB`);
  console.log(`  WebP: ${(webpStats.size / 1024).toFixed(1)}KB`);
  console.log(`  Reduction: ${reduction}%\n`);
}

async function main() {
  console.log('Finding images in posts directory...\n');
  const images = await findImages(postsDir);

  if (images.length === 0) {
    console.log('No images found.');
    return;
  }

  console.log(`Found ${images.length} image(s)\n`);

  for (const image of images) {
    await convertToWebP(image);
  }

  console.log('Done!');
}

main().catch(console.error);
