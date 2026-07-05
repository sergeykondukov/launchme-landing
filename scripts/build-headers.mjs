#!/usr/bin/env node
/**
 * Replaces the first <header class="site-header …">…</header> block in each mapped HTML file
 * with content from partials/header-*.html.
 *
 * Why: static GitHub Pages site has no server-side includes; one partial + this script = single place
 * to change navigation and DMG URL across the whole site.
 *
 * DMG path: scripts/site-config.mjs (shared with Sparkle / hero / article CTAs).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { DMG_PATH } from './site-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

/** Horizontal whitespace before `<header>` is included so repeated builds do not stack indent. */
// Matches the legacy `site-header` (first migration) and the new `lp-header` (idempotent
// rebuilds), tolerating any extra classes (e.g. variant modifiers).
/** Header block + optional header-*.js scripts immediately after it (replaced atomically). */
const HEADER_RE = /[^\S\r\n]*<header\s+class="(?:site-header|lp-header)[^"]*"[^>]*>[\s\S]*?<\/header>(?:\s*<script\s+src="\/js\/header-[^"]+\.js"\s+defer><\/script>)*/;

function loadPartial(name) {
  const p = path.join(ROOT, 'partials', name);
  return fs.readFileSync(p, 'utf8');
}

function applyMarketing(template, { homeHref, pricingAria, downloadGa }) {
  // On the home page nav anchors are same-page (#features); elsewhere they jump home (/#features).
  const navPrefix = homeHref.startsWith('#') ? '' : '/';
  return template
    .replaceAll('__HOME_HREF__', homeHref)
    .replaceAll('__NAV_PREFIX__', navPrefix)
    .replaceAll('__PRICING_ARIA__', pricingAria ? ' aria-current="page"' : '')
    .replaceAll('__DOWNLOAD_GA_AREA__', downloadGa)
    .replaceAll('__DMG_URL__', DMG_PATH);
}

function applyAccount(template) {
  return template.replaceAll('__DMG_URL__', DMG_PATH);
}

/**
 * Partials use consistent relative indentation; we dedent to column 0, then add `base`
 * so nested markup keeps its structure (stripLeading-only was flattening inner tags).
 */
function indentPartial(raw, base = '    ') {
  let lines = raw.split('\n');
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  const nonempty = lines.filter((l) => l.trim());
  if (nonempty.length === 0) return '';
  let minIndent = Infinity;
  for (const line of nonempty) {
    minIndent = Math.min(minIndent, line.match(/^(\s*)/)[1].length);
  }
  return lines
    .map((line) => {
      if (!line.trim()) return '';
      return base + line.slice(minIndent);
    })
    .join('\n');
}

/**
 * Which header variant each page uses.
 * - marketing: Pricing + DMG badge (same bar as home).
 * - minimal: logo only.
 * - account: logo + text Download link (narrow layout).
 */
const PAGE_HEADERS = {
  // Marketing bar
  'index.html': { variant: 'marketing', homeHref: '#top', pricingAria: false, downloadGa: 'header' },
  'pricing/index.html': {
    variant: 'marketing',
    homeHref: '/',
    pricingAria: true,
    downloadGa: 'pricing-header',
  },
  'support/index.html': {
    variant: 'marketing',
    homeHref: '/',
    pricingAria: false,
    downloadGa: 'support-header',
  },
  'press-assets/index.html': {
    variant: 'marketing',
    homeHref: '/',
    pricingAria: false,
    downloadGa: 'press-header',
  },

  // Account (LaunchMe Direct / Supabase)
  'account/index.html': { variant: 'account' },

  // Minimal (same partial for all)
  'blog/index.html': { variant: 'minimal' },
  'blog/how-to-get-launchpad-back-on-macos-26-tahoe.html': { variant: 'minimal' },
  'blog/launchme-update-1-111.html': { variant: 'minimal' },
  'blog/launchme-update-1-118.html': { variant: 'minimal' },
  'blog/launchme-vs-appgrid.html': { variant: 'minimal' },
  'blog/launchme-vs-apphub.html': { variant: 'minimal' },
  'blog/launchme-vs-buho-launchpad.html': { variant: 'minimal' },
  'blog/launchme-vs-folderx.html': { variant: 'minimal' },
  'blog/launchme-vs-hotlaunch.html': { variant: 'minimal' },
  'blog/launchme-vs-launchie.html': { variant: 'minimal' },
  'blog/launchme-vs-launchos.html': { variant: 'minimal' },
  'blog/launchme-vs-qal-pro.html': { variant: 'minimal' },
  'blog/launchme-vs-raycast.html': { variant: 'minimal' },
  'help/index.html': { variant: 'marketing', homeHref: '/', pricingAria: false, downloadGa: 'help-header' },
  'help/direct/index.html': { variant: 'marketing', homeHref: '/', pricingAria: false, downloadGa: 'help-direct-header' },
  'terms/index.html': { variant: 'marketing', homeHref: '/', pricingAria: false, downloadGa: 'terms-header' },
  'privacy/index.html': { variant: 'marketing', homeHref: '/', pricingAria: false, downloadGa: 'privacy-header' },
  'refunds/index.html': { variant: 'marketing', homeHref: '/', pricingAria: false, downloadGa: 'refunds-header' },
};

function main() {
  const marketingTpl = loadPartial('header-marketing.html');
  const minimalTpl = loadPartial('header-minimal.html');
  const accountTpl = loadPartial('header-account.html');

  let updated = 0;
  for (const [rel, cfg] of Object.entries(PAGE_HEADERS)) {
    const filePath = path.join(ROOT, rel);
    if (!fs.existsSync(filePath)) {
      console.warn(`skip (missing): ${rel}`);
      continue;
    }
    let html = fs.readFileSync(filePath, 'utf8');
    if (!/<header\s+class="(?:site-header|lp-header)/.test(html)) {
      console.warn(`skip (no header match): ${rel}`);
      continue;
    }

    let block;
    if (cfg.variant === 'marketing') {
      block = applyMarketing(marketingTpl, cfg);
    } else if (cfg.variant === 'minimal') {
      block = minimalTpl;
    } else if (cfg.variant === 'account') {
      block = applyAccount(accountTpl);
    } else {
      throw new Error(`Unknown variant for ${rel}`);
    }

    block = indentPartial(block);

    html = html.replace(HEADER_RE, block);
    fs.writeFileSync(filePath, html, 'utf8');
    updated++;
    console.log(`ok: ${rel}`);
  }

  console.log(`\nbuild-headers: updated ${updated} file(s). DMG_PATH=${DMG_PATH}`);
}

main();
