import fs from 'node:fs';
import path from 'node:path';

// Keep this pass after asset-slot generation so every build preserves optimization.
export function optimizeDockMarkup(html, root) {
  const manifestPath = path.join(root, 'images/optimized/dock-manifest.json');
  if (!fs.existsSync(manifestPath)) throw new Error('Run python3 scripts/optimize-dock-images.py first');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  html = html.replace(/<img\b[^>]*>/g, tag => {
    const original = tag.match(/data-original-src="([^"]+)"/)?.[1] ?? tag.match(/\bsrc="([^"]+)"/)?.[1];
    const asset = manifest[original];
    if (!asset) return tag;
    tag = tag.replace(/\s(?:src|srcset|sizes|data-original-src|data-dock-src|data-dock-srcset|data-dock-sizes|width|height)="[^"]*"/g, '');
    const hero = /dock-hero__(?:base|slide|fingers)/.test(tag);
    const sizes = hero ? '(max-width: 767px) 222.34vw, (max-width: 1500px) 153.34vw, 2300px'
      : original.includes('/cards/') && asset.width <= 544 ? '(max-width: 767px) 100vw, 560px'
      : /Carusel|dock-details/.test(original) ? '(max-width: 767px) 85vw, 700px'
      : '(max-width: 1200px) 100vw, 1300px';
    const variants = asset.variants;
    const upgrade = variants.length ? ` data-dock-src="${variants.at(-1).src}" data-dock-srcset="${variants.map(v => `${v.src} ${v.width}w`).join(', ')}" data-dock-sizes="${sizes}"` : '';
    // src remains a useful image even when JavaScript is disabled or the upgrade fails.
    const dimensions = original.endsWith('/logoicontext.png') ? '' : ` width="${asset.width}" height="${asset.height}"`;
    return tag.replace(/>$/, ` src="${asset.preview}"${dimensions} data-original-src="${original}"${upgrade}>`);
  });
  html = html.replace(/\bposter="([^"]+)"/g, (match, url) => manifest[url] ? `poster="${manifest[url].preview}"` : match);
  // The shared carousel markup did not previously request native lazy loading.
  return html.replace(/<img\b[^>]*>/g, tag => /loading\s*=|dock-hero__|lp-logo/.test(tag) ? tag : tag.replace(/>$/, ' loading="lazy" decoding="async">'));
}
