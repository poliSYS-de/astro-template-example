import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, parse } from 'path';

const INPUT_DIR = 'public/images';
const OUTPUT_DIR = 'public/images/optimized';
const SIZES = [480, 960, 1440];
const QUALITY = 80;

async function findImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const images = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'optimized') {
      images.push(...await findImages(fullPath));
    } else if (/\.(jpe?g|jpg|png)$/i.test(entry.name) && !entry.name.startsWith('.')) {
      images.push(fullPath);
    }
  }

  return images;
}

async function optimize() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const images = await findImages(INPUT_DIR);
  console.log(`Found ${images.length} images to optimize\n`);

  for (const inputPath of images) {
    const { name } = parse(inputPath);

    for (const width of SIZES) {
      const outputPath = join(OUTPUT_DIR, `${name}-${width}w.webp`);
      await sharp(inputPath)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outputPath);
    }

    // Full-size WebP (fuer OG-Images etc.)
    const fullPath = join(OUTPUT_DIR, `${name}.webp`);
    await sharp(inputPath)
      .resize(1920, null, { withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(fullPath);

    const meta = await sharp(inputPath).metadata();
    console.log(`✓ ${name} (${meta.width}x${meta.height}) → 4 WebP variants`);
  }

  console.log('\nDone!');
}

optimize().catch(console.error);
