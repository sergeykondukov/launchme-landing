import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync, execFileSync } from 'node:child_process';

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'launchme-catalog-test-'));
try {
  for (const folder of ['scripts', 'spaces-themes', 'spaces/good', 'package']) {
    fs.mkdirSync(path.join(root, folder), { recursive: true });
  }
  fs.copyFileSync(path.join(site, 'scripts/build-spaces.mjs'), path.join(root, 'scripts/build-spaces.mjs'));
  fs.writeFileSync(path.join(root, 'spaces-themes/index.html'), '<!-- LAUNCHME_SPACES_GRID_BEGIN --><!-- LAUNCHME_SPACES_GRID_END -->');
  const themeFolder = path.join(root, 'spaces/good');
  fs.writeFileSync(path.join(themeFolder, 'shot.jpg'), 'preview');
  fs.writeFileSync(path.join(themeFolder, 'theme.json'), JSON.stringify({
    name: 'Good', description: 'A <theme>', screenshot: 'shot.jpg', file: 'Good Theme.launchmetheme', author: 'LaunchMe',
  }));
  fs.writeFileSync(path.join(root, 'package/manifest.json'), JSON.stringify({
    themeId: '887A229A-AA55-4115-A74D-2214BD6C9595', schemaVersion: 1, appVersion: '2.0',
  }));
  execFileSync('zip', ['-q', path.join(themeFolder, 'Good Theme.launchmetheme'), 'manifest.json'], { cwd: path.join(root, 'package') });
  const build = () => spawnSync(process.execPath, ['scripts/build-spaces.mjs'], { cwd: root, encoding: 'utf8' });
  const catalog = () => fs.readFileSync(path.join(root, 'spaces/catalog.json'), 'utf8');
  assert.equal(build().status, 0);
  const first = catalog();
  assert.equal(build().status, 0);
  assert.equal(catalog(), first, 'output must be deterministic');
  const theme = JSON.parse(first).themes[0];
  assert.deepEqual(theme.author, [{ name: 'LaunchMe' }]);
  assert.match(theme.downloadURL, /Good%20Theme/);
  assert.match(theme.sha256, /^[a-f0-9]{64}$/);
  assert.ok(theme.fileSize > 0);
  assert.match(fs.readFileSync(path.join(root, 'spaces-themes/index.html'), 'utf8'), /A &lt;theme&gt;/);
  fs.unlinkSync(path.join(themeFolder, 'shot.jpg'));
  assert.equal(build().status, 0);
  assert.deepEqual(JSON.parse(catalog()).themes, [], 'missing preview excludes theme');
  fs.writeFileSync(path.join(themeFolder, 'shot.jpg'), 'preview');
  fs.writeFileSync(path.join(themeFolder, 'Good Theme.launchmetheme'), 'corrupt');
  assert.notEqual(build().status, 0, 'corrupt package must fail build');
  console.log('PASS: catalog generation, deterministic output, normalized credits, encoded URLs, escaped descriptions, missing assets and corrupt packages');
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
