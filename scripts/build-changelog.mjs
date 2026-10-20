import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const source = fs.readFileSync(new URL('changelog/releases.md', root), 'utf8');
const releases = [];
let release, section;
for (const raw of source.split(/\r?\n/)) {
  const line = raw.trim();
  if (!line) continue;
  const heading = line.match(/^# ([\d.]+) \| (\d{4}-\d{2}-\d{2})$/);
  if (heading) {
    const date = new Date(`${heading[2]}T00:00:00Z`);
    if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== heading[2]) throw new Error(`Invalid date: ${line}`);
    release = { version: heading[1], date: heading[2], sections: [] };
    releases.push(release); section = undefined;
  } else if (line.startsWith('## ') && release) {
    section = { title: line.slice(3), items: [] }; release.sections.push(section);
  } else if (line.startsWith('- ') && section) {
    section.items.push(line.slice(2));
  } else { throw new Error(`Unsupported release note line: ${line}`); }
}
if (!releases.length) throw new Error('Add at least one release.');
releases.sort((a, b) => b.date.localeCompare(a.date));
const icons = {
  features: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  fixes: '<path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5m0 3h.01"/>'
};
const html = releases.map(release => {
  const date = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${release.date}T00:00:00Z`));
  return `<article class="release" aria-labelledby="release-${release.version}">
    <div class="release-meta"><time datetime="${release.date}">${date}</time><h2 id="release-${release.version}">${escape(release.version)}</h2></div>
    <div class="release-notes">${release.sections.map(section => `<section class="release-section"><h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">${/fix|optimization/i.test(section.title) ? icons.fixes : icons.features}</svg>${escape(section.title)}</h3><ul>${section.items.map(item => `<li>${escape(item)}</li>`).join('')}</ul></section>`).join('')}</div>
  </article>`;
}).join('\n');
const target = new URL('changelog/index.html', root);
const page = fs.readFileSync(target, 'utf8');
fs.writeFileSync(target, page.replace(/<!-- RELEASES:START -->[\s\S]*?<!-- RELEASES:END -->/, `<!-- RELEASES:START -->\n${html}\n<!-- RELEASES:END -->`));
console.log(`Built ${releases.length} changelog release(s).`);
