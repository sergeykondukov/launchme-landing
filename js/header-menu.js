/**
 * Mobile header: burger toggles nav links stacked below the bar.
 * Download stays on desktop only (hidden in CSS on narrow screens).
 */
(function () {
  var header = document.querySelector('.lp-header');
  var toggle = header && header.querySelector('.lp-nav-toggle');
  var nav = header && header.querySelector('.lp-nav');
  if (!header || !toggle || !nav) return;

  function closeMenu() {
    header.classList.remove('is-menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  toggle.addEventListener('click', function () {
    var open = header.classList.toggle('is-menu-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  // Close after navigation so the next page starts with a collapsed bar.
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Let header-scroll.js collapse the menu when the bar hides on scroll down.
  header.addEventListener('lp-header:close-menu', closeMenu);
})();
