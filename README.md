# LaunchMe landing (`launchmeapp.com`)

Static site: HTML, CSS, and a small amount of JavaScript served from the repository root (no Next.js or Astro). GitHub Pages–friendly paths. Netlify `_redirects` normalizes `/account` → `/account/` in production; the local `serve` package already serves both `/account` and `/account/` without extra config.

## Account page and Supabase password reset

LaunchMe **(Direct)** uses Supabase Auth. Forgot-password emails redirect to **`https://launchmeapp.com/account/`** (see Supabase **Site URL** / **Redirect URLs**). Tokens arrive in the URL **hash** (`#…&type=recovery…`). The UI is implemented in `src/account/main.js`, bundled to `js/account.bundle.js` so secrets are not committed.

Official references:

- [Password-based Auth](https://supabase.com/docs/guides/auth/passwords)
- [JavaScript `updateUser`](https://supabase.com/docs/reference/javascript/auth-updateuser)

### Environment variables

Copy `env.example` to `.env` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Use the same names in Netlify, Vercel, or GitHub Actions. The anon key is public by design but must not be hard-coded in git; inject it at build time.

### GitHub Pages (build on GitHub Actions)

This repo includes `.github/workflows/deploy-github-pages.yml`. It runs on every push to **`main`**: `pnpm install`, `pnpm run build` (injects Supabase env into `js/account.bundle.js`), then publishes the static tree to Pages.

**One-time setup in GitHub (web UI):**

1. **Settings → Secrets and variables → Actions** — add repository secrets `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (you already did this).
2. **Settings → Pages → Build and deployment** — set **Source** to **GitHub Actions** (not “Deploy from a branch”). If you previously published from `main` / `/root`, switch to Actions or the workflow will not deploy.
3. Push to `main` (or open **Actions → Deploy GitHub Pages → Run workflow**). The first deploy may ask you to **approve** the `github-pages` environment once.
4. After a green run, open your Pages URL and test `/account/` and password recovery.

Custom domain (`launchmeapp.com`) stays under **Settings → Pages** as today; the workflow only replaces how the **files** are built and uploaded.

### Build the account bundle

```bash
pnpm install
pnpm run build:account
```

This writes `js/account.bundle.js` (gitignored). Production deploys should run `pnpm run build` (or `build:account`) with the variables above exported or present in `.env`.

### Local verification (password reset)

1. Set `.env` with your project URL and anon key, then run `pnpm run build:account` and `pnpm start`.
2. Open the site (e.g. `http://localhost:3000/account/`).
3. Trigger a reset from LaunchMe (Direct) **Forgot password** or from Supabase Auth (test user).
4. Open the link from the email in a browser (same machine is fine). You should land on `/account/` with a hash, see **Set a new password**, submit a new password, then see **Password updated**.
5. Open LaunchMe (Direct) and sign in with the same email and the **new** password.

If the link is expired or reused, the page should show a clear error instead of a silent failure.

### Routing note

Supabase may redirect to `https://launchmeapp.com/account` (no trailing slash). Netlify `_redirects` issues a single 301 to `/account/`; browsers keep the **fragment** on that redirect, so recovery still works. If you use another host, add an equivalent rule (avoid redirect rules that also match `/account/` or you can create a redirect loop).
