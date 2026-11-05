#!/usr/bin/env node
// Install the shared consent gate and remove analytics that bypass it.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let updated = 0;
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || ['node_modules', 'partials'].includes(entry.name)) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { walk(file); continue; }
    if (!entry.name.endsWith('.html')) continue;
    let html = fs.readFileSync(file, 'utf8');
    if (!/<\/head>/i.test(html) || !/<body\b/i.test(html) ||
        !/(?:lp-header|site-footer|googletagmanager)/.test(html)) continue;
    let ahrefs = html.match(/data-ahrefs-key="([^"]+)"/)?.[1];
    html = html.replace(/<script\b([^>]*)>[\s\S]*?<\/script>/gi, (tag, attributes) => {
      if (/analytics\.ahrefs\.com/.test(attributes)) {
        ahrefs = attributes.match(/data-key="([^"]+)"/)?.[1];
        return '';
      }
      if (/googletagmanager\.com\/gtag\/js|\/js\/cookie-consent\.js/.test(attributes)) return '';
      if (/\bgtag\s*\(\s*['"]config['"]\s*,/.test(tag) && /dataLayer/.test(tag)) return '';
      return tag;
    });
    html = html.replace(/<link\b[^>]*href="\/css\/cookie-consent\.css"[^>]*>\s*/g, '');
    const tags = `<link rel="stylesheet" href="/css/cookie-consent.css">\n<script src="/js/cookie-consent.js" defer${ahrefs ? ` data-ahrefs-key="${ahrefs}"` : ''}></script>\n`;
    html = html.replace(/<\/head>/i, tags + '</head>');
    const headEnd = html.toLowerCase().indexOf('</head>');
    html = html.slice(0, headEnd).replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n') + html.slice(headEnd);
    fs.writeFileSync(file, html);
    updated++;
  }
}
walk(root);
console.log(`build-cookie-consent: ${updated} pages now load analytics only through the consent gate.`);
