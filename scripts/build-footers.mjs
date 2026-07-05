#!/usr/bin/env node
/**
 * Replaces the first <footer class="site-footer">…</footer> block in each mapped HTML file
 * with content from partials/footer.html (one source of truth for the whole site).
 *
 * Mirrors build-headers.mjs. Excludes account/* and paddle/* (they intentionally have no
 * marketing footer). DMG path comes from scripts/site-config.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { DMG_PATH } from './site-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

/** Leading horizontal whitespace is captured so repeated builds do not stack indent. */
const FOOTER_RE = /[^\S\r\n]*<footer\s+class="site-footer"[^>]*>[\s\S]*?<\/footer>/;

/** Pages that get the marketing footer (everything with a site-footer except account/paddle). */
const FOOTER_PAGES = [
  'index.html',
  'pricing/index.html',
  'support/index.html',
  'press-assets/index.html',
  'privacy/index.html',
  'terms/index.html',
  'refunds/index.html',
  'help/index.html',
  'help/direct/index.html',
  'blog/index.html',
  'blog/how-to-get-launchpad-back-on-macos-26-tahoe.html',
  'blog/launchme-update-1-111.html',
  'blog/launchme-update-1-118.html',
  'blog/launchme-vs-appgrid.html',
  'blog/launchme-vs-apphub.html',
  'blog/launchme-vs-buho-launchpad.html',
  'blog/launchme-vs-folderx.html',
  'blog/launchme-vs-hotlaunch.html',
  'blog/launchme-vs-launchie.html',
  'blog/launchme-vs-launchos.html',
  'blog/launchme-vs-qal-pro.html',
  'blog/launchme-vs-raycast.html',
];

function loadPartial(name) {
  return fs.readFileSync(path.join(ROOT, 'partials', name), 'utf8');
}

function indentPartial(raw, base = '    ') {
  let lines = raw.split('\n');
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  const nonempty = lines.filter((l) => l.trim());
  if (nonempty.length === 0) return '';
  let minIndent = Infinity;
  for (const line of nonempty) minIndent = Math.min(minIndent, line.match(/^(\s*)/)[1].length);
  return lines.map((line) => (line.trim() ? base + line.slice(minIndent) : '')).join('\n');
}

function main() {
  const tpl = indentPartial(loadPartial('footer.html').replaceAll('__DMG_URL__', DMG_PATH));

  let updated = 0;
  for (const rel of FOOTER_PAGES) {
    const filePath = path.join(ROOT, rel);
    if (!fs.existsSync(filePath)) {
      console.warn(`skip (missing): ${rel}`);
      continue;
    }
    let html = fs.readFileSync(filePath, 'utf8');
    if (!FOOTER_RE.test(html)) {
      console.warn(`skip (no footer match): ${rel}`);
      continue;
    }
    html = html.replace(FOOTER_RE, tpl);
    fs.writeFileSync(filePath, html, 'utf8');
    updated++;
    console.log(`ok: ${rel}`);
  }

  console.log(`\nbuild-footers: updated ${updated} file(s). DMG_PATH=${DMG_PATH}`);
}

main();
