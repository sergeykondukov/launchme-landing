/**
 * LaunchMe website — Supabase password recovery for LaunchMe (Direct).
 *
 * Flow (matches mobile/mac app + Supabase redirect_to https://launchmeapp.com/account):
 * 1) User taps the link from the recovery email.
 * 2) Supabase redirects here with tokens in the URL *fragment* (hash), including type=recovery.
 * 3) We create a browser Supabase client with detectSessionInUrl so the client reads the hash
 *    and establishes a short-lived recovery session (see Supabase "Reset password" docs).
 * 4) We call auth.updateUser({ password }) while that session is active.
 * 5) We sign out the recovery session and show a success message. User signs in inside the app.
 *
 * If there is no recovery hash, this script only wires basic UI; the static HTML shows normal
 * account / product copy.
 *
 * PKCE note: if your Supabase project ever sends a `?code=` query instead of a hash, you would
 * need `exchangeCodeForSession` (SSR-style). LaunchMe (Direct) + current dashboard use the hash
 * fragment with `type=recovery`, which this page handles.
 */
import { createClient } from '@supabase/supabase-js'

// Injected at build time by scripts/build-account.mjs — never hard-code keys in source.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

/**
 * Parse the current location hash into query-style params.
 * Supabase puts access_token, refresh_token, type, etc. in the fragment, not the query string.
 */
function readHashParams() {
  const raw = window.location.hash || ''
  if (!raw.startsWith('#') || raw.length < 2) {
    return new URLSearchParams()
  }
  return new URLSearchParams(raw.slice(1))
}

/**
 * Recovery emails from Supabase include type=recovery in the hash.
 * We read this once up front so we can choose UX before/after the client consumes the hash.
 */
function isRecoveryInviteFromHash() {
  return readHashParams().get('type') === 'recovery'
}

/**
 * Map Supabase / network errors to short, user-facing English strings.
 * We keep messages generic when we cannot detect a specific cause.
 */
function describeAuthError(err) {
  if (!err) {
    return 'Something went wrong. Please try again.'
  }
  const message = (err.message || '').toLowerCase()
  const status = err.status

  // Network / CORS / offline
  if (message.includes('fetch') || message.includes('network') || err.name === 'TypeError') {
    return 'Network error. Check your connection and try again.'
  }

  // Common Supabase auth messages
  if (message.includes('jwt expired') || message.includes('expired')) {
    return 'This reset link has expired. Request a new one from LaunchMe (Forgot password).'
  }
  if (message.includes('invalid') && (message.includes('token') || message.includes('jwt'))) {
    return 'This reset link is invalid or was already used. Request a new reset email.'
  }
  if (message.includes('password') && message.includes('weak')) {
    return 'Password is too weak. Use a longer password with mixed characters.'
  }
  if (status === 422 || message.includes('same password')) {
    return err.message || 'Password does not meet requirements. Try a stronger password.'
  }

  return err.message || 'Could not update password. Please try again.'
}

function getElements() {
  return {
    missingConfig: document.getElementById('account-config-missing'),
    defaultPanel: document.getElementById('account-default-panel'),
    recoveryPanel: document.getElementById('account-recovery-panel'),
    successPanel: document.getElementById('account-recovery-success'),
    form: document.getElementById('account-recovery-form'),
    password: document.getElementById('account-new-password'),
    passwordConfirm: document.getElementById('account-new-password-confirm'),
    submitBtn: document.getElementById('account-recovery-submit'),
    formError: document.getElementById('account-recovery-error'),
    sessionError: document.getElementById('account-recovery-session-error'),
  }
}

function show(el, visible) {
  if (!el) return
  el.hidden = !visible
}

async function main() {
  const els = getElements()

  // Read recovery flag before we branch on config — even without a client we still want sane UX.
  const recoveryFromEmail = isRecoveryInviteFromHash()

  // No bundled credentials (forgot to run build:account with env, or placeholders only).
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    // Regular visitors without a build still see the static copy. Only recovery flows need JS.
    if (recoveryFromEmail) {
      show(els.missingConfig, true)
      show(els.defaultPanel, false)
    }
    return
  }

  /**
   * detectSessionInUrl (default true in browser): on load, the client parses access_token /
   * refresh_token from the URL hash and stores the session. This is required for the recovery
   * flow described in Supabase "Password-based auth" / "Reset password" documentation.
   *
   * flowType implicit: recovery links from email use a fragment with bearer tokens (not PKCE ?code=).
   */
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      detectSessionInUrl: true,
      flowType: 'implicit',
      persistSession: true,
      autoRefreshToken: true,
    },
  })

  // If this is not a recovery link, leave the default account page visible and exit early.
  if (!recoveryFromEmail) {
    return
  }

  // Recovery UX: hide the generic account blurb, show the password form container.
  show(els.defaultPanel, false)
  show(els.recoveryPanel, true)
  show(els.sessionError, false)
  show(els.formError, false)

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError) {
    show(els.sessionError, true)
    els.sessionError.textContent = describeAuthError(sessionError)
    show(els.form, false)
    return
  }

  if (!session) {
    show(els.sessionError, true)
    els.sessionError.textContent =
      'We could not start a reset session from this link. It may be expired or already used. Request a new email from LaunchMe.'
    show(els.form, false)
    return
  }

  els.form.addEventListener('submit', async (e) => {
    e.preventDefault()
    show(els.formError, false)
    els.formError.textContent = ''

    const pw = els.password.value || ''
    const pw2 = els.passwordConfirm.value || ''

    if (pw.length < 8) {
      show(els.formError, true)
      els.formError.textContent = 'Use at least 8 characters for your new password.'
      return
    }
    if (pw !== pw2) {
      show(els.formError, true)
      els.formError.textContent = 'Passwords do not match.'
      return
    }

    els.submitBtn.disabled = true

    // Official API for changing password while a recovery session is active.
    const { error: updateError } = await supabase.auth.updateUser({ password: pw })

    els.submitBtn.disabled = false

    if (updateError) {
      show(els.formError, true)
      els.formError.textContent = describeAuthError(updateError)
      return
    }

    // End the recovery session in the browser so the next open is clean.
    await supabase.auth.signOut()

    show(els.recoveryPanel, false)
    show(els.successPanel, true)

    // Remove tokens from the address bar without reloading (better for bookmarks / screenshots).
    window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.search}`)
  })
}

main().catch((err) => {
  // Last-resort logging for unexpected bugs in this small page.
  console.error(err)
  const els = getElements()
  if (els.formError) {
    els.formError.hidden = false
    els.formError.textContent = describeAuthError(err)
  }
})
