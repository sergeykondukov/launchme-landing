# Dock image delivery

`dock/index.html` starts larger artwork with 480px WebP previews. `js/dock.js`
loads responsive quality-84 WebP replacements within 200px of the viewport and
swaps them in after decoding. Original exports are retained. Without JavaScript,
or with Save-Data / a 2G connection, the previews remain usable.

All six video cards have a screenshot as both an image fallback and a native
video poster. The fallback remains until `playing`, and returns on errors.
Video sources are attached within 400px of the viewport, playback starts when
20% is visible, and pauses off screen. Reduced motion and Save-Data leave the
poster visible without downloading the video.

61 optimized source images: 28.22 MiB originally; largest quality variants total
5.28 MiB (81% smaller). All previews total 0.50 MiB. These are asset totals,
not measured initial page transfers; lazy loading and responsive selection
reduce the assets requested on each visit. Small unchanged assets are excluded.
Video files are unchanged (largest: widgets-and-presets.mp4, 42 MiB).

## Updating artwork

Install Python Pillow if needed, then run:

```sh
pnpm run optimize:dock-images
```

This regenerates WebP derivatives and `images/optimized/dock-manifest.json`,
then rebuilds Dock markup. The ordinary `pnpm run build:dock` reuses these
committed derivatives. New or changed image exports require regeneration.
The two CSS backgrounds also use WebP derivatives.
