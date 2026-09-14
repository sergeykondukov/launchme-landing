/*
  Google Analytics 4: count downloads per Spaces theme.

  Same delegated-click pattern as the data-ga handlers in js/main.js, but kept in its own
  file because /spaces-themes/ does not load main.js (gallery/scroll code it has no use for).

  Event name is `file_download` on purpose: GA4 treats it as a recommended event, so
  `file_name` and `file_extension` land in the BUILT-IN "File name" / "File extension"
  dimensions and show up in reports with no admin setup. `theme_name` / `theme_slug` are
  extra custom params — they need to be registered as custom dimensions in GA4 to appear
  in standard reports, but are visible in DebugView / Realtime right away.

  Markup comes from scripts/build-spaces.mjs:
    <a class="space-card__download" href="…" download="…"
       data-ga="space-theme-download" data-ga-area="<slug>" data-theme-name="<name>">

  Disabled cards render a <span>, not an <a>, so a theme with a missing file can never
  be counted as a download.
*/
(function () {
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[data-ga="space-theme-download"]');
    if (!link) return;

    // Stay silent on pages without GA (and if an ad blocker removed it).
    if (typeof gtag !== 'function') return;

    var fileName = link.getAttribute('download') || '';
    var dot = fileName.lastIndexOf('.');

    gtag('event', 'file_download', {
      file_name: fileName,
      file_extension: dot > -1 ? fileName.slice(dot + 1) : '',
      link_url: link.href,
      link_text: (link.textContent || '').trim(),
      theme_name: link.getAttribute('data-theme-name') || '',
      theme_slug: link.getAttribute('data-ga-area') || ''
    });
  });
})();
