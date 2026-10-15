#!/usr/bin/env node
/**
 * Generates the Spaces theme cards on /spaces-themes/ from the `spaces/` content folder.
 *
 * One theme = one folder with a `theme.json`, a screenshot and a `.launchmetheme` file
 * (see spaces/README.md). Adding a theme never means editing a central list: this script
 * scans `spaces/&#42;/theme.json`, sorts by `order` then `name`, and rewrites the markup between
 * <!-- LAUNCHME_SPACES_GRID_BEGIN --> / <!-- LAUNCHME_SPACES_GRID_END --> in the page.
 *
 * Mirrors build-headers.mjs / build-footers.mjs: static HTML output, no client-side JS,
 * idempotent across repeated builds.
 */
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SPACES_DIR = path.join(ROOT, 'spaces');
const PAGE = path.join(ROOT, 'spaces-themes', 'index.html');

const GRID_RE =
  /([^\S\r\n]*)<!--\s*LAUNCHME_SPACES_GRID_BEGIN\s*-->[\s\S]*?<!--\s*LAUNCHME_SPACES_GRID_END\s*-->/;

/** Accepted values for the wallpaper `type`, mapped to how they read in the label. */
const WALLPAPER_TYPES = { regular: 'Regular', dynamic: 'Dynamic', live: 'Live' };
/** Shown when a theme does not say which kind of wallpaper it uses. */
const WALLPAPER_FALLBACK_LABEL = 'Wallpaper (regular/dynamic/live)';

/**
 * Labels above each credit row, in card order. `label` is a function so a row can read
 * the theme — the wallpaper row prints the actual type, e.g. "Wallpaper (Live)".
 */
const CREDIT_ROWS = [
  { key: 'author', label: () => 'Author' },
  { key: 'wallpaper', label: (theme) => wallpaperLabel(theme) },
  { key: 'widgets', label: () => 'Widgets' },
  { key: 'icons', label: () => 'Icons' },
];

const warnings = [];
function warn(msg) {
  warnings.push(msg);
  console.warn(`warn: ${msg}`);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/** Encode a path segment for a URL but keep it readable (spaces → %20, not +). */
function urlPath(...segments) {
  return '/' + segments.map((s) => encodeURIComponent(s)).join('/');
}

/**
 * A credit value counts as "empty" when the name is missing, blank, or an explicit dash.
 * Empty values render as an unclickable em dash, per the page spec.
 */
function isBlankName(name) {
  const t = String(name ?? '').trim();
  return t === '' || t === '-' || t === '–' || t === '—';
}

/**
 * Only absolute http(s) and site-absolute paths become links. Anything else (javascript:,
 * data:, a bare word someone typed by mistake) degrades to plain text.
 */
function safeHref(url) {
  const t = String(url ?? '').trim();
  if (!t) return null;
  if (t.startsWith('/')) return t;
  if (/^https?:\/\//i.test(t)) return t;
  return null;
}

/** Accepts a string, an object, or an array of either; always returns a list of entries. */
function toCreditList(value) {
  if (value == null) return [];
  const arr = Array.isArray(value) ? value : [value];
  return arr
    .map((item) => (typeof item === 'string' ? { name: item } : item))
    .filter((item) => item && typeof item === 'object');
}

/**
 * Wallpaper kind comes from `wallpaper.type` (or a top-level `wallpaperType`).
 * Anything missing or unrecognised falls back to the generic list, so a typo degrades
 * to the old label instead of printing nonsense in the card.
 */
function wallpaperLabel(theme) {
  const fromEntry = toCreditList(theme.credits.wallpaper).find((e) => e.type);
  const raw = String(fromEntry?.type ?? theme.credits.wallpaperType ?? '').trim().toLowerCase();
  if (!raw) return WALLPAPER_FALLBACK_LABEL;
  if (!WALLPAPER_TYPES[raw]) {
    warn(
      `spaces/${theme.slug}: wallpaper type "${raw}" is not regular/dynamic/live — ` +
        'using the generic label.'
    );
    return WALLPAPER_FALLBACK_LABEL;
  }
  return `Wallpaper (${WALLPAPER_TYPES[raw]})`;
}

function renderCredit(value) {
  const entries = toCreditList(value).filter((e) => !isBlankName(e.name));
  if (entries.length === 0) return '<span class="space-card__credit-empty">&mdash;</span>';

  return entries
    .map((entry) => {
      const name = escapeHtml(String(entry.name).trim());
      const href = safeHref(entry.url);
      if (!href) return `<span class="space-card__credit">${name}</span>`;
      return (
        `<a class="space-card__credit space-card__credit--link" href="${escapeHtml(href)}"` +
        ` target="_blank" rel="noopener noreferrer">${name}</a>`
      );
    })
    .join('<span class="space-card__credit-sep">, </span>');
}

/**
 * Asset paths in theme.json are relative to the theme folder, unless they are already
 * site-absolute (`/images/…`) or a full URL — that lets a theme reuse an existing site image.
 */
function resolveAsset(rawValue, slug, { checkExists }) {
  const raw = String(rawValue ?? '').trim();
  if (!raw) return { href: null, missing: true };
  if (/^https?:\/\//i.test(raw)) return { href: raw, missing: false };
  if (raw.startsWith('/')) {
    const onDisk = path.join(ROOT, decodeURIComponent(raw).replace(/^\//, ''));
    const missing = checkExists && !fs.existsSync(onDisk);
    return { href: raw, missing };
  }
  const onDisk = path.join(SPACES_DIR, slug, raw);
  const missing = checkExists && !fs.existsSync(onDisk);
  return { href: urlPath('spaces', slug, raw), missing };
}

function readThemes() {
  if (!fs.existsSync(SPACES_DIR)) {
    warn('spaces/ folder not found — nothing to generate.');
    return [];
  }

  const themes = [];
  for (const entry of fs.readdirSync(SPACES_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    // `_template` and dotfolders are scaffolding, never content.
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;

    const slug = entry.name;
    const manifest = path.join(SPACES_DIR, slug, 'theme.json');
    if (!fs.existsSync(manifest)) {
      warn(`spaces/${slug}: no theme.json — skipped.`);
      continue;
    }

    let data;
    try {
      data = JSON.parse(fs.readFileSync(manifest, 'utf8'));
    } catch (err) {
      warn(`spaces/${slug}/theme.json is not valid JSON (${err.message}) — skipped.`);
      continue;
    }

    if (isBlankName(data.name)) {
      warn(`spaces/${slug}/theme.json: "name" is required — skipped.`);
      continue;
    }

    const shot = resolveAsset(data.screenshot, slug, { checkExists: true });
    if (shot.missing) {
      warn(`spaces/${slug}: screenshot "${data.screenshot ?? ''}" not found.`);
    }
    const file = resolveAsset(data.file, slug, { checkExists: true });
    if (file.missing) {
      warn(`spaces/${slug}: theme file "${data.file ?? ''}" not found — button disabled.`);
    }

    themes.push({
      slug,
      description: String(data.description ?? "").trim(),
      name: String(data.name).trim(),
      order: Number.isFinite(Number(data.order)) ? Number(data.order) : 100,
      screenshot: shot.missing ? null : shot.href,
      downloadHref: file.missing ? null : file.href,
      downloadName: file.missing ? null : path.basename(String(data.file).trim()),
      credits: data,
    });
  }

  themes.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  return themes;
}

/** App catalog shares the exact content and sorting used by the website. */
function buildCatalog(themes) {
  const credits = (value) => toCreditList(value)
    .filter((entry) => !isBlankName(entry.name))
    .map((entry) => ({ name: String(entry.name).trim(),
      ...(safeHref(entry.url) ? { url: safeHref(entry.url) } : {}),
      ...(entry.type ? { type: String(entry.type).toLowerCase() } : {}) }));
  const themeIds = new Set();
  return {
    schemaVersion: 1,
    themes: themes.filter((theme) => theme.screenshot && theme.downloadHref).map((theme) => {
      // Catalog packages are local content: inspect them at build time, never fetch remote URLs.
      const source = String(theme.credits.file);
      if (/^https?:/i.test(source)) throw new Error(`${theme.slug}: catalog package must be local`);
      const file = source.startsWith('/')
        ? path.resolve(ROOT, '.' + source)
        : path.resolve(SPACES_DIR, theme.slug, source);
      if (!file.startsWith(ROOT + path.sep)) throw new Error(`${theme.slug}: package outside site`);
      const manifest = JSON.parse(execFileSync('unzip', ['-p', file, 'manifest.json'],
        { encoding: 'utf8', maxBuffer: 1024 * 1024 }));
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(manifest.themeId)
          || !Number.isInteger(manifest.schemaVersion) || manifest.schemaVersion < 1) {
        throw new Error(`${theme.slug}: invalid package manifest`);
      }
      const identity = manifest.themeId.toLowerCase();
      if (themeIds.has(identity)) throw new Error(`${theme.slug}: duplicate package themeId`);
      themeIds.add(identity);
      const fileSize = fs.statSync(file).size;
      if (fileSize <= 0 || fileSize > 1073741824) throw new Error(`${theme.slug}: package exceeds app size limit`);
      const hash = createHash('sha256');
      const fd = fs.openSync(file, 'r');
      try {
        const buffer = Buffer.alloc(1024 * 1024);
        let count;
        while ((count = fs.readSync(fd, buffer, 0, buffer.length, null)) > 0) hash.update(buffer.subarray(0, count));
      } finally { fs.closeSync(fd); }
      return {
        id: theme.slug, themeId: manifest.themeId, name: theme.name,
        description: theme.description, order: theme.order,
        screenshotURL: theme.screenshot, downloadURL: theme.downloadHref,
        fileSize, sha256: hash.digest('hex'),
        packageSchemaVersion: manifest.schemaVersion, createdWithAppVersion: manifest.appVersion,
        author: credits(theme.credits.author), wallpaper: credits(theme.credits.wallpaper),
        widgets: credits(theme.credits.widgets), icons: credits(theme.credits.icons),
      };
    }),
  };
}

function renderCard(theme, indent) {
  const i = indent;
  const lines = [];
  lines.push(`${i}<article class="space-card">`);
  lines.push(`${i}    <h2 class="space-card__title">${escapeHtml(theme.name)}</h2>`);

  if (theme.screenshot) {
    lines.push(
      `${i}    <img class="space-card__shot" src="${escapeHtml(theme.screenshot)}"` +
        ` alt="${escapeHtml(theme.name)} Space preview" loading="lazy" decoding="async">`
    );
  } else {
    lines.push(`${i}    <div class="space-card__shot space-card__shot--empty" aria-hidden="true"></div>`);
  }

  if (theme.description) {
    lines.push(`${i}    <p class="space-card__description">${escapeHtml(theme.description)}</p>`);
  }
  lines.push(`${i}    <dl class="space-card__meta">`);
  for (const row of CREDIT_ROWS) {
    lines.push(`${i}        <dt class="space-card__meta-label">${escapeHtml(row.label(theme))}</dt>`);
    lines.push(`${i}        <dd class="space-card__meta-value">${renderCredit(theme.credits[row.key])}</dd>`);
  }
  lines.push(`${i}    </dl>`);

  if (theme.downloadHref) {
    lines.push(
      `${i}    <a class="space-card__download" href="${escapeHtml(theme.downloadHref)}"` +
        ` download="${escapeHtml(theme.downloadName)}"` +
        ` data-ga="space-theme-download" data-ga-area="${escapeHtml(theme.slug)}"` +
        ` data-theme-name="${escapeHtml(theme.name)}">Download theme</a>`
    );
  } else {
    // No file on disk: keep the button in place but inert, so a typo never ships a 404 link.
    lines.push(
      `${i}    <span class="space-card__download space-card__download--disabled"` +
        ` aria-disabled="true">Download theme</span>`
    );
  }

  lines.push(`${i}</article>`);
  return lines.join('\n');
}

function renderGrid(themes, indent) {
  if (themes.length === 0) {
    return `${indent}<p class="spaces-empty">No Spaces themes published yet — check back soon.</p>`;
  }
  return themes.map((t) => renderCard(t, indent)).join('\n');
}

function main() {
  if (!fs.existsSync(PAGE)) {
    console.warn('skip (missing): spaces-themes/index.html');
    return;
  }

  const themes = readThemes();
  const catalog = buildCatalog(themes);
  let html = fs.readFileSync(PAGE, 'utf8');
  if (!GRID_RE.test(html)) {
    console.warn('skip (no LAUNCHME_SPACES_GRID markers): spaces-themes/index.html');
    return;
  }

  html = html.replace(GRID_RE, (_full, indent) => {
    const body = renderGrid(themes, indent);
    return (
      `${indent}<!-- LAUNCHME_SPACES_GRID_BEGIN -->\n` +
      `${body}\n` +
      `${indent}<!-- LAUNCHME_SPACES_GRID_END -->`
    );
  });

  fs.writeFileSync(path.join(SPACES_DIR, 'catalog.json'), JSON.stringify(catalog, null, 2) + '\n', 'utf8');
  fs.writeFileSync(PAGE, html, 'utf8');
  console.log(`ok: spaces-themes/index.html`);
  for (const t of themes) console.log(`  · ${t.name} (spaces/${t.slug})`);
  console.log(
    `\nbuild-spaces: ${themes.length} theme(s), ${warnings.length} warning(s).`
  );
}

main();
