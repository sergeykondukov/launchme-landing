#!/usr/bin/env node
/**
 * Injects the home hero download CTA from partials/hero-cta.html and replaces Mac App Store
 * badge buttons / links that pointed at LaunchMe’s App Store listing with the Direct DMG path.
 *
 * Source of truth for the DMG file name: scripts/site-config.mjs (also used by build-headers.mjs).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  DMG_ABS_URL,
  DMG_PATH,
  LAUNCHME_MAC_APP_STORE_URL,
} from './site-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

/** Same indent helper as build-headers.mjs — keeps hero markup aligned inside index.html. */
function indentPartial(raw, base) {
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

function walkHtmlFiles(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkHtmlFiles(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

/**
 * Hero block on index.html — single download badge from partials/hero-cta.html.
 * Use distinctive markers so the regex cannot span the rest of the page by mistake.
 */
function injectHeroCta(html) {
  const re = /<!--\s*LAUNCHME_HERO_CTA_BEGIN\s*-->[\s\S]*?<!--\s*LAUNCHME_HERO_CTA_END\s*-->/;
  if (!re.test(html)) return html;

  let inner = fs
    .readFileSync(path.join(ROOT, 'partials/hero-cta.html'), 'utf8')
    .replaceAll('__DMG_PATH__', DMG_PATH)
    .trim();

  inner = indentPartial(inner, '                    ');
  return html.replace(
    re,
    `<!-- LAUNCHME_HERO_CTA_BEGIN -->\n${inner}\n                    <!-- LAUNCHME_HERO_CTA_END -->`
  );
}

/**
 * Replace App Store badge anchors with our DMG badge.
 * IMPORTANT: `href` must follow `class="app-badge"` immediately (only whitespace between),
 * otherwise the pattern can skip from one hero badge to a much later App Store `href`.
 */
function replaceAppStoreBadgeAnchors(html) {
  return html.replace(
    /<a class="app-badge"\s+href="https:\/\/apps\.apple\.com\/app\/apple-store\/id6751939046[^"]*"[^>]*>\s*<img[\s\S]*?<\/a>/g,
    (full) => {
      const gaArea = full.match(/data-ga-area="([^"]*)"/)?.[1] ?? 'download-badge';
      return `<a class="app-badge" href="${DMG_PATH}" data-ga="direct-dmg" data-ga-area="${gaArea}">
                        <img src="/images/download-button.svg" alt="Download LaunchMe for Mac">
                    </a>`;
    }
  );
}

/**
 * Convert the legacy raster "Direct website download" badge (<a class="app-badge"> with
 * download-button.svg) into the new chip button — a black "Download for macOS" pill.
 * Preserves the original indentation, href, and data-ga-area. Idempotent: pills don't match.
 */
const APPLE_GLYPH =
  '<svg class="apple-glyph" viewBox="0 0 384 512" aria-hidden="true"><path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>';
function replaceDownloadBadgesWithChip(html) {
  return html.replace(
    /([^\S\r\n]*)<a class="app-badge"\s+href="([^"]*)"([^>]*)>\s*<img\s+src="\/images\/download-button\.svg"[^>]*>\s*<\/a>/g,
    (full, indent, href, rest) => {
      const gaArea = rest.match(/data-ga-area="([^"]*)"/)?.[1] ?? 'download-badge';
      return (
        `${indent}<a class="lp-btn lp-btn--lg" href="${href}" data-ga="direct-dmg" data-ga-area="${gaArea}">\n` +
        `${indent}    ${APPLE_GLYPH}\n` +
        `${indent}    Download for macOS\n` +
        `${indent}</a>`
      );
    }
  );
}

/** Account page still had a primary button pointing at the App Store listing. */
function replaceAccountPrimaryCta(html) {
  return html.replace(
    /<a class="button primary" href=["']https:\/\/apps\.apple\.com\/app\/apple-store\/id6751939046[^"']*["']>Download on the Mac App Store<\/a>/g,
    `<a class="button primary" href="${DMG_PATH}">Download LaunchMe</a>`
  );
}

/** FAQ / prose links that pointed only at LaunchMe’s Mac App Store URL → website DMG. */
function replaceLaunchMeStoreUrls(html) {
  return html.split(LAUNCHME_MAC_APP_STORE_URL).join(DMG_PATH);
}

/**
 * Keep previously generated direct-download links on the current DMG.
 * This prevents old website-hosted builds from staying in article/help CTAs after a release bump.
 */
function replaceDirectDmgUrls(html) {
  return html
    .replace(
      /https:\/\/launchmeapp\.com\/updates\/LaunchMeDirect-[^"'\s<>]+\.dmg/g,
      DMG_ABS_URL
    )
    .replace(
      /\/updates\/LaunchMeDirect-[^"'\s<>]+\.dmg/g,
      DMG_PATH
    );
}

/**
 * JSON-LD `offers.url` reads cleaner as an absolute download URL for schema.org consumers.
 * Only touches the SoftwareApplication block when it still references our DMG path.
 */
function absolutizeJsonLdOfferUrl(html, relFromRoot) {
  if (relFromRoot !== 'index.html') return html;
  return html.replace(`"url": "${DMG_PATH}"`, `"url": "${DMG_ABS_URL}"`);
}

function polishFaqLinkLabels(html) {
  const esc = DMG_PATH.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const hrefPat = new RegExp(`(<a class="faq-link" href="${esc}">)([^<]+)(</a>)`, 'g');
  return html.replace(hrefPat, (m, a, label, c) => {
    const t = label.trim();
    if (t === 'LaunchMe on Mac App Store' || t === 'Mac App Store') return `${a}Download LaunchMe${c}`;
    return m;
  });
}

function processFile(absPath) {
  const rel = path.relative(ROOT, absPath).split(path.sep).join('/');
  let html = fs.readFileSync(absPath, 'utf8');
  const before = html;

  if (rel === 'index.html') html = injectHeroCta(html);

  html = replaceAppStoreBadgeAnchors(html);
  html = replaceDownloadBadgesWithChip(html);
  html = replaceAccountPrimaryCta(html);
  html = replaceLaunchMeStoreUrls(html);
  html = replaceDirectDmgUrls(html);
  html = absolutizeJsonLdOfferUrl(html, rel);
  html = polishFaqLinkLabels(html);

  if (html !== before) {
    fs.writeFileSync(absPath, html, 'utf8');
    console.log(`ok: ${rel}`);
    return 1;
  }
  return 0;
}

function main() {
  const files = walkHtmlFiles(ROOT);
  let n = 0;
  for (const f of files) n += processFile(f);
  console.log(`\nbuild-download-badges: touched ${n} file(s). DMG_PATH=${DMG_PATH}`);
}

main();
