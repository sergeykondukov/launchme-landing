# Updating the changelog

Edit `changelog/releases.md`. Add a release at the top using this format:

```markdown
# 2.08.0 | 2026-10-20

## New Features
- Describe a new feature here.

## Bug Fixes and Optimizations
- Describe a fix here.
```

Use a version number, an ISO date (`YYYY-MM-DD`), section headings and one plain-text bullet per change. Omit any section you do not need. An optional Markdown image can go between the release heading and the first section, for example `![Release artwork](/images/blog/dock/launchme-dock-article.jpg)`. It is displayed above the notes at the full width of the text column. Releases are displayed newest first. Do not add unreleased changes until they ship.

Run `pnpm run build:changelog` (also included in `pnpm run build`). Commit the updated Markdown and generated `changelog/index.html`. Notes are rendered into HTML at build time and remain readable without JavaScript.
