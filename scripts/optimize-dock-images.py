#!/usr/bin/env python3
"""Regenerate Dock image derivatives: python3 -m pip install Pillow first."""
import hashlib
import json
import re
from pathlib import Path
from urllib.parse import unquote
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
html = (ROOT / 'dock/index.html').read_text()
css = (ROOT / 'css/dock.css').read_text()
urls = set(re.findall(r'(?:data-original-src|src|poster)="(/images/[^"<>]+)"', html))
urls.update(re.findall(r"url\(['\"]?(/images/[^)'\"]+)", css))
# Include originals on subsequent runs, after markup has been optimized.
manifest_path = ROOT / 'images/optimized/dock-manifest.json'
if manifest_path.exists():
    urls.update(json.loads(manifest_path.read_text()))
manifest = {}
for url in sorted(urls):
    if url.startswith('/images/optimized/'):
        continue
    source = ROOT / unquote(url.lstrip('/'))
    try:
        im = Image.open(source)
    except (OSError, ValueError):
        continue
    if source.stat().st_size < 40_000:
        continue
    im = ImageOps.exif_transpose(im)
    width, height = im.size
    key = source.stem.replace(' ', '-') + '-' + hashlib.sha1(url.encode()).hexdigest()[:8]
    entry = {'width': width, 'height': height, 'originalBytes': source.stat().st_size}
    def save(w, suffix, quality):
        target = ROOT / f'images/optimized/{key}-{suffix}.webp'
        scaled = im.resize((w, max(1, round(height * w / width))), Image.Resampling.LANCZOS)
        scaled.save(target, 'WEBP', quality=quality, method=6)
        return '/' + str(target.relative_to(ROOT))
    if width >= 480:
        entry['preview'] = save(min(480, width), 'preview', 42)
        widths = sorted({min(width, w) for w in (640, 1120, 1728, 2560)})
        entry['variants'] = [{'width': w, 'src': save(w, str(w), 84)} for w in widths]
    else:
        entry['preview'] = save(width, str(width), 88)
        entry['variants'] = []
    manifest[url] = entry
manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
print(f'Generated optimized derivatives for {len(manifest)} images.')
