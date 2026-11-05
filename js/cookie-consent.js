(() => {
  if (window.launchMeCookieConsent) return;
  const KEY = 'launchme-cookie-consent';
  const VERSION = 1;
  const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  const GA_ID = 'G-0FCPNZRQH0';
  const ahrefsKey = document.currentScript?.dataset.ahrefsKey;
  let loaded = false;
  let returnFocus = null;
  let preference = readPreference();

  function readPreference() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY));
      if (value?.version === VERSION && typeof value.analytics === 'boolean' &&
          Number.isFinite(value.savedAt) && Date.now() - value.savedAt >= 0 && Date.now() - value.savedAt < MAX_AGE) return value;
    } catch (_) { /* Storage may be unavailable; the default remains no analytics. */ }
    return null;
  }
  function loadAnalytics() {
    if (loaded || preference?.analytics !== true) return;
    loaded = true;
    window[`ga-disable-${GA_ID}`] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted', ad_storage: 'denied',
      ad_user_data: 'denied', ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    const google = document.createElement('script');
    google.async = true;
    google.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(google);
    // Ahrefs is also gated, so no optional analytics runs before a choice.
    if (ahrefsKey) {
      const ahrefs = document.createElement('script');
      ahrefs.async = true;
      ahrefs.src = 'https://analytics.ahrefs.com/analytics.js';
      ahrefs.dataset.key = ahrefsKey;
      document.head.appendChild(ahrefs);
    }
  }
  function clearAnalyticsCookies() {
    const names = document.cookie.split(';').map(value => value.trim().split('=')[0])
      .filter(name => /^_ga(?:_|$)|^_gid$|^_gat(?:_|$)/.test(name));
    const parts = location.hostname.split('.');
    const domains = [''];
    for (let i = 0; i < parts.length - 1; i++) {
      domains.push(parts.slice(i).join('.'), '.' + parts.slice(i).join('.'));
    }
    names.forEach(name => domains.forEach(domain => {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax${domain ? '; domain=' + domain : ''}`;
    }));
  }

  const banner = document.createElement('section');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie preferences');
  banner.hidden = true;
  banner.innerHTML = `<h2 class="cookie-banner__title">A little about cookies</h2>
    <p class="cookie-banner__text">We use optional analytics to understand how our website is used. You can accept or reject analytics cookies.</p>
    <a class="cookie-banner__policy" href="/privacy/#website-cookies">Privacy Policy</a>
    <div class="cookie-banner__actions">
      <button type="button" data-consent-reject>Reject analytics</button>
      <button type="button" data-consent-accept>Accept analytics</button>
    </div>`;
  document.body.appendChild(banner);
  function openPreferences(trigger) {
    returnFocus = trigger || null;
    banner.hidden = false;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && banner.animate) {
      banner.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 180, easing: 'ease-out' });
    }
    if (trigger) banner.querySelector('button').focus();
  }
  function choose(analytics) {
    preference = { version: VERSION, analytics, savedAt: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(preference)); } catch (_) { /* Keep the choice for this page. */ }
    banner.hidden = true;
    if (returnFocus?.isConnected) returnFocus.focus();
    if (analytics) loadAnalytics();
    else {
      window[`ga-disable-${GA_ID}`] = true;
      clearAnalyticsCookies();
      // Reload after withdrawal to stop already loaded third-party analytics code.
      if (loaded) location.reload();
    }
  }
  banner.querySelector('[data-consent-accept]').addEventListener('click', () => choose(true));
  banner.querySelector('[data-consent-reject]').addEventListener('click', () => choose(false));
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-cookie-settings]');
    if (!trigger) return;
    event.preventDefault();
    openPreferences(trigger);
  });
  if (!document.querySelector('[data-cookie-settings]')) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cookie-settings cookie-settings--floating';
    button.setAttribute('data-cookie-settings', '');
    button.textContent = 'Cookie settings';
    document.body.appendChild(button);
  }
  window.addEventListener('storage', event => {
    if (event.key !== KEY && event.key !== null) return;
    preference = readPreference();
    if (preference?.analytics) { banner.hidden = true; loadAnalytics(); }
    else if (loaded) { window[`ga-disable-${GA_ID}`] = true; clearAnalyticsCookies(); location.reload(); }
    else if (!preference) openPreferences();
    else banner.hidden = true;
  });
  window.launchMeCookieConsent = { open: () => openPreferences() };
  if (!preference) { clearAnalyticsCookies(); openPreferences(); }
  else if (preference.analytics) loadAnalytics();
  else clearAnalyticsCookies();
})();
