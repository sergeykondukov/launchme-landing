# Spaces themes — how to add a new one

The `/spaces-themes/` page is generated from **this folder**. One theme = one subfolder.

```
spaces/
  _template/                    ← copy this folder, rename it, fill it in
  light-minimalist/
    theme.json                  ← everything the card shows
    screenshot.jpg              ← card screenshot
    Light Minimalist.launchmetheme   ← the file the Download button serves
```

## Steps

1. Copy `_template/` → `spaces/<my-theme-slug>/` (lowercase, dashes; the slug is not shown anywhere,
   it only has to be unique).
2. Drop the screenshot and the `.launchmetheme` file into that folder.
3. Fill in `theme.json`.
4. Run `pnpm run build:spaces` (or just `pnpm run build`) and reload the page.
   Pushing to `main` runs the build on GitHub Actions, so production regenerates on its own.

Folders whose name starts with `_` or `.` are ignored — that is why `_template/` never shows up
on the site.

## theme.json

```json
{
  "name": "Light Minimalist",
  "order": 10,
  "screenshot": "screenshot.jpg",
  "file": "Light Minimalist.launchmetheme",
  "author":    { "name": "LaunchMe", "url": "https://launchmeapp.com" },
  "wallpaper": { "name": "Aurora Live", "url": "https://example.com/aurora", "type": "live" },
  "widgets":   [{ "name": "Weather", "url": "https://example.com" }, { "name": "Clock" }],
  "icons":     [{ "name": "-" }]
}
```

| Field        | Required | Notes |
|--------------|----------|-------|
| `name`       | yes      | Card title. |
| `screenshot` | yes      | File name inside the theme folder, or a site-absolute path like `/images/spaces/x.jpg`. |
| `file`       | yes      | File name inside the theme folder that the Download button serves. |
| `order`      | no       | Lower shows first. Default `100`; ties break alphabetically by `name`. |
| `author`, `wallpaper`, `widgets`, `icons` | no | See below. |

### Wallpaper type

`wallpaper.type` is printed in the card label itself. Accepted values (case-insensitive):

| `"type"` | label on the card |
|---|---|
| `"regular"` | `WALLPAPER (REGULAR)` |
| `"dynamic"` | `WALLPAPER (DYNAMIC)` |
| `"live"` | `WALLPAPER (LIVE)` |
| missing or unrecognised | `WALLPAPER (REGULAR/DYNAMIC/LIVE)` |

A value outside the three prints a warning during the build and falls back to the generic
label, so a typo never ships a nonsense word into the card. The type is independent of the
name — `{ "name": "-", "type": "dynamic" }` renders `WALLPAPER (DYNAMIC)` with `—` under it.

### Credit fields (`author`, `wallpaper`, `widgets`, `icons`)

Each accepts a plain string, one object, or an array of either:

```json
"author":  "LaunchMe",
"author":  { "name": "LaunchMe", "url": "https://launchmeapp.com" },
"widgets": ["Weather", { "name": "Clock", "url": "https://example.com" }]
```

Rendering rules:

- **name + url** → clickable, opens in a new tab.
- **name, no url** → plain text, not clickable.
- **missing, empty, or `"-"`** → renders as `—` and is not clickable.

Only `http://`, `https://` and site-absolute (`/…`) URLs become links; anything else is
rendered as plain text.

## If something does not show up

`pnpm run build:spaces` prints a warning line for every theme it skipped or every missing file
it found (a missing `.launchmetheme` renders the button as disabled instead of a broken link).
