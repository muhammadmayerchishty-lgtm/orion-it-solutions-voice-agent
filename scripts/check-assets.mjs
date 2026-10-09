import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const PUBLIC_IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const SCAN_TARGETS = [path.join(ROOT_DIR, 'src'), path.join(ROOT_DIR, 'index.html')];

const KEBAB_FILENAME_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*\.(webp|png|jpg|jpeg|svg|gif|avif)$/;
const IMAGE_REF_REGEX = /\/images\/([^"'`\s<>?)]+)/g;

function walkFiles(targetPath) {
  if (!fs.existsSync(targetPath)) return [];
  const stat = fs.statSync(targetPath);
  if (stat.isFile()) return [targetPath];

  const results = [];
  for (const entry of fs.readdirSync(targetPath, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.')) {
      continue;
    }
    const fullPath = path.join(targetPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(fullPath));
    } else if (/\.(tsx?|jsx?|html|css|mjs|cjs|json)$/i.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

const errors = [];

// 1. Validate every file inside public/images/
if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
  errors.push('Directory "public/images/" does not exist.');
} else {
  const imageFiles = fs.readdirSync(PUBLIC_IMAGES_DIR);
  for (const fileName of imageFiles) {
    const fullPath = path.join(PUBLIC_IMAGES_DIR, fileName);
    const stat = fs.statSync(fullPath);
    if (!stat.isFile()) continue;

    if (/[A-Z\s[\]()]/.test(fileName) || !KEBAB_FILENAME_REGEX.test(fileName)) {
      errors.push(
        `Invalid asset filename in public/images/: "${fileName}" (must be lowercase-kebab-case with no spaces, brackets, or capitals)`
      );
    }

    if (fileName.endsWith('.webp') && stat.size > 400 * 1024) {
      const kb = (stat.size / 1024).toFixed(1);
      errors.push(
        `Oversized WebP image in public/images/: "${fileName}" is ${kb} KB (limit: 400 KB)`
      );
    }
  }
}

// 2. Scan source files for "/images/..." references and verify existence + naming
const filesToScan = SCAN_TARGETS.flatMap((t) => walkFiles(t));
const referencedAssets = new Set();

for (const filePath of filesToScan) {
  const relFile = path.relative(ROOT_DIR, filePath);
  const content = fs.readFileSync(filePath, 'utf8');

  let match;
  IMAGE_REF_REGEX.lastIndex = 0;
  while ((match = IMAGE_REF_REGEX.exec(content)) !== null) {
    const assetName = match[1];
    const fullRef = `/images/${assetName}`;
    referencedAssets.add(fullRef);

    if (/[A-Z\s[\]()]/.test(assetName) || !KEBAB_FILENAME_REGEX.test(assetName)) {
      errors.push(
        `[${relFile}] Invalid image reference "${fullRef}": filename must be lowercase-kebab-case with no capitals, spaces, or brackets.`
      );
      continue;
    }

    const diskPath = path.join(PUBLIC_IMAGES_DIR, assetName);
    if (!fs.existsSync(diskPath)) {
      errors.push(
        `[${relFile}] Missing image asset for reference "${fullRef}" (expected at public/images/${assetName}).`
      );
    }
  }
}

if (errors.length > 0) {
  console.error('\n❌ Asset verification failed (scripts/check-assets.mjs):');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
} else {
  console.log(
    `✅ Asset check passed: ${referencedAssets.size} "/images/..." reference(s) verified in public/images/.`
  );
}
