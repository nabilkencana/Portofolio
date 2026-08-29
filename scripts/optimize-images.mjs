import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const TARGET_DIRS = [
  path.resolve('./src/assets'),
  path.resolve('./public'),
];

async function getFiles(dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return files.flat();
}

async function optimizeImages() {
  let totalSavedBytes = 0;
  let totalProcessed = 0;

  for (const targetDir of TARGET_DIRS) {
    if (!fs.existsSync(targetDir)) continue;
    const files = await getFiles(targetDir);

    for (const file of files) {
      if (!file.match(/\.(webp|png|jpg|jpeg)$/i)) continue;
      
      const stat = await fs.promises.stat(file);
      if (stat.size < 200 * 1024) continue; // Skip files already smaller than 200KB

      const originalSize = stat.size;
      const buffer = await fs.promises.readFile(file);

      try {
        const image = sharp(buffer);
        const metadata = await image.metadata();

        const maxDim = 1600;
        let resizeOptions = { withoutEnlargement: true, fit: 'inside' };
        if (metadata.width > maxDim || metadata.height > maxDim) {
          if (metadata.width >= metadata.height) {
            resizeOptions.width = maxDim;
          } else {
            resizeOptions.height = maxDim;
          }
        }

        const optimizedBuffer = await sharp(buffer)
          .resize(resizeOptions)
          .webp({ quality: 82, effort: 5 })
          .toBuffer();

        if (optimizedBuffer.length < originalSize) {
          await fs.promises.writeFile(file, optimizedBuffer);
          const saved = originalSize - optimizedBuffer.length;
          totalSavedBytes += saved;
          totalProcessed++;
          console.log(
            `✓ Optimized: ${path.relative(process.cwd(), file)}: ${(originalSize / 1024).toFixed(1)}KB -> ${(optimizedBuffer.length / 1024).toFixed(1)}KB (saved ${(saved / 1024).toFixed(1)}KB)`
          );
        }
      } catch (err) {
        console.warn(`Could not optimize ${file}:`, err.message);
      }
    }
  }

  // Remove unused website_mokleters.png
  const unusedPng = path.resolve('./src/assets/projects/website_mokleters.png');
  if (fs.existsSync(unusedPng)) {
    const pngStat = fs.statSync(unusedPng);
    totalSavedBytes += pngStat.size;
    fs.unlinkSync(unusedPng);
    console.log(`✓ Deleted unused file: src/assets/projects/website_mokleters.png (saved ${(pngStat.size / 1024).toFixed(1)}KB)`);
  }

  console.log(`\n========================================`);
  console.log(`Total files optimized: ${totalProcessed}`);
  console.log(`Total space saved: ${(totalSavedBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`========================================`);
}

optimizeImages();
