#!/usr/bin/env node
// Fill Dock asset slots from numbered exports, keeping missing assets as gray placeholders.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const page = path.join(root, 'dock/index.html');
const extensions = ['png', 'webp', 'jpg', 'jpeg', 'svg'];
const cardAssets = {
  'customize-1': { file: 'Innovative-and-simple-to-use-dock-card.jpg', width: 1121, height: 299 },
  'customize-2': { file: 'music-widgets-dock-card.jpg', width: 544, height: 544 },
  'customize-3': { file: 'system-stats-dock-card.jpg', width: 544, height: 544 },
  'customize-4': { file: 'active-apps-folder-dock-card.jpg', width: 1121, height: 406 },
  'customize-5': { file: 'manage-your-time-dock-card.jpg', width: 544, height: 544 },
  'customize-6': { file: 'weather-dock-card.jpg', width: 544, height: 544 }
};
const sceneAssets = {
  'dock-monitors': 'different-dock-for-all-monitors',
  'dock-workflow-workflows': 'workflows-dock-slide',
  'dock-workflow-customization': 'color-palettes-dock-slide',
  'dock-workflow-wallpaper': 'wallpaper-dock-slide',
  'dock-workflow-pomodoro': 'pomodoro-dock-slide',
  'dock-workflow-background-sound': 'background-sound-dock-slide'
};
const videoAssets = {
  'customize-7': { name: 'widgets-and-presets', width: 1684, height: 1080, label: 'Dock widgets and ready made presets' },
  'dock-player': { name: 'full-screenplayer-dock', width: 1666, height: 1080, label: 'Full screen player in one click' }
};
let filled = 0;
let html = fs.readFileSync(page, 'utf8').replace(
  /(<div\b[^>]*\bdata-dock-asset="([^"]+)"[^>]*>)[\s\S]*?(<\/div>)/g,
  (_match, open, name, close) => {
    const video = videoAssets[name];
    if (video && fs.existsSync(path.join(root, `images/dock/video/${video.name}.mp4`))) {
      filled++;
      const poster = `/images/dock/posters/${video.name}.jpg`;
      return `${open}<img class="dock-card__poster" src="${poster}" alt="" width="${video.width}" height="${video.height}" loading="lazy" decoding="async"><video poster="${poster}" width="${video.width}" height="${video.height}" muted loop playsinline preload="none" data-dock-video aria-label="${video.label}"><source data-src="/images/dock/video/${video.name}.mp4" type="video/mp4"></video>${close}`;
    }
    const card = cardAssets[name];
    const candidates = card ? [`images/dock/cards/${card.file}`] : [];
    if (sceneAssets[name]) candidates.push(...extensions.map(ext => `images/dock/${sceneAssets[name]}.${ext}`));
    const asset = [...candidates, ...extensions.map(ext => `images/dock/${name}.${ext}`)]
      .find(file => fs.existsSync(path.join(root, file)));
    if (asset) {
      filled++;
      const dimensions = card && asset === `images/dock/cards/${card.file}` ? ` width="${card.width}" height="${card.height}"` : '';
      return `${open}<img src="/${asset}" alt=""${dimensions} loading="lazy" decoding="async">${close}`;
    }
    const label = /^\d+-\d+$/.test(name) ? `<span>${name}</span>` : '';
    return `${open}${label}${close}`;
  }
);
// Widget exports define the actual row count and the number of cards in each row.
const widgetDirectory = path.join(root, 'images/dock/widgets');
if (fs.existsSync(widgetDirectory)) {
  const widgets = fs.readdirSync(widgetDirectory).map(file => {
    const match = file.match(/^(\d+)-(\d+)\.(png|webp|jpg|jpeg|svg)$/i);
    return match ? { file, row: Number(match[1]), position: Number(match[2]) } : null;
  }).filter(Boolean).sort((a, b) => a.row - b.row || a.position - b.position);
  if (widgets.length) {
    const rows = new Map();
    widgets.forEach(widget => {
      const name = `${widget.row}-${widget.position}`;
      let dimensions = '';
      if (widget.file.toLowerCase().endsWith('.png')) {
        const bytes = fs.readFileSync(path.join(widgetDirectory, widget.file));
        dimensions = ` width="${bytes.readUInt32BE(16)}" height="${bytes.readUInt32BE(20)}"`;
      }
      const item = `<div class="dock-pick__item dock-pick__item--image" data-dock-widget="${name}"><img src="/images/dock/widgets/${widget.file}" alt=""${dimensions} loading="lazy" decoding="async"></div>`;
      if (!rows.has(widget.row)) rows.set(widget.row, []);
      rows.get(widget.row).push(item);
    });
    const start = html.indexOf('<div class="dock-pick__collage">');
    const end = html.indexOf('</section>', start);
    if (start === -1 || end === -1) throw new Error('Dock widget collage section not found');
    const content = [...rows.entries()].map(([row, items]) =>
      `<div class="dock-pick__row" data-widget-row="${row}">\n${items.join('\n')}\n</div>`
    ).join('\n');
    html = html.slice(0, start) + `<div class="dock-pick__collage">\n${content}\n</div>` + html.slice(end);
    console.log(`build-dock: ${widgets.length} widgets across ${rows.size} rows.`);
  }
}
fs.writeFileSync(page, html);
console.log(`build-dock: filled ${filled} asset slots; remaining slots keep gray backgrounds.`);
