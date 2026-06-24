/**
 * Fixed .lp-header: hide while scrolling down, show on any upward scroll.
 * Sticky headers can scroll off-screen on long pages; fixed + direction fixes that.
 */
(function () {
  var header = document.querySelector('.lp-header');
  if (!header) return;

  // Skip auto-hide when the user prefers reduced motion — keep the bar visible.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var lastY = window.scrollY || 0;
  var ticking = false;
  // Minimum scroll delta (px) before we treat direction as intentional.
  var DELTA = 6;
  // Always show the bar when this close to the top of the page.
  var TOP_ZONE = 72;

  function setHidden(hidden) {
    header.classList.toggle('is-hidden', hidden);
    if (hidden) header.dispatchEvent(new CustomEvent('lp-header:close-menu'));
  }

  function onScrollFrame() {
    var y = window.scrollY || 0;
    var delta = y - lastY;

    if (y <= TOP_ZONE) {
      setHidden(false);
    } else if (delta > DELTA) {
      // Scrolling down — tuck the header away.
      setHidden(true);
    } else if (delta < -DELTA) {
      // Scrolling up anywhere on the page — bring it back immediately.
      setHidden(false);
    }

    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScrollFrame);
    }
  }, { passive: true });
})();
