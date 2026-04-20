/**
 * Bundles the /account Supabase recovery UI into js/account.bundle.js.
 *
 * Why a build step?
 * - The static site has no Next/Vite runtime for env vars in the browser.
 * - We inject NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY at build
 *   time so production keys never live in git (only in CI / host env).
 *
 * Usage: from repo root, with .env or exported vars:
 *   pnpm run build:account
 */
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as esbuild from 'esbuild'

function rootDir() {
  return join(dirname(fileURLToPath(import.meta.url)), '..')
}

const root = rootDir()

// Load .env when present (local dev). CI should export vars instead.
try {
  const dotenv = await import('dotenv')
  dotenv.config({ path: join(root, '.env') })
} catch {
  // dotenv optional if not installed yet
}
const outDir = join(root, 'js')
const outfile = join(outDir, 'account.bundle.js')

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true })
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

await esbuild.build({
  entryPoints: [join(root, 'src', 'account', 'main.js')],
  bundle: true,
  outfile,
  format: 'esm',
  platform: 'browser',
  // Replace at compile time — values are not read from disk in the repo.
  define: {
    'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(url),
    'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(key),
  },
  // Keep readable output so on-page debugging and comments stay useful.
  minify: false,
  sourcemap: false,
})

console.log('Wrote', outfile)
