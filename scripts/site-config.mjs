/**
 * Single source of truth for the LaunchMe Direct DMG used across:
 * - Sparkle appcast (bump manually in updates/appcast.xml to match)
 * - Header partials (via build-headers.mjs)
 * - Hero + article download badges (via build-download-badges.mjs)
 *
 * Bump DMG_FILENAME when you ship a new website-hosted build.
 */
export const DMG_FILENAME = 'LaunchMeDirect-1.112.9.dmg';
export const DMG_PATH = `/updates/${DMG_FILENAME}`;
export const SITE_ORIGIN = 'https://launchmeapp.com';
export const DMG_ABS_URL = `${SITE_ORIGIN}${DMG_PATH}`;

/** Legacy Mac App Store listing — replaced in CTAs with DMG_PATH / DMG_ABS_URL. */
export const LAUNCHME_MAC_APP_STORE_URL =
  'https://apps.apple.com/app/apple-store/id6751939046?pt=128114906&ct=Website&mt=8';
