// Main interactions for LaunchMe landing
// Keep code simple and well commented as requested.

// Smooth scroll for internal anchor links
document.addEventListener('click', function (e) {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href');
  const target = document.querySelector(id);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Accessible accordion for FAQ
(function enableAccordion() {
  const root = document.querySelector('[data-accordion]');
  if (!root) return; // if FAQ not on page
  root.querySelectorAll('.accordion-item').forEach(function (item) {
    const btn = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    if (!btn || !panel) return;

    btn.addEventListener('click', function () {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // close all others for a clean UX
      root.querySelectorAll('.accordion-trigger').forEach(function (b) {
        b.setAttribute('aria-expanded', 'false');
      });
      root.querySelectorAll('.accordion-panel').forEach(function (p) {
        p.hidden = true;
      });

      // toggle current
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded; // hide if already open, show otherwise
    });
  });
})();

// Ensure card sizes: square cards keep 1:1; wide card matches square height
(function syncCardHeights() {
  function applyHeights() {
    // For each section/container, sync heights so the wide card matches local square size
    document.querySelectorAll('.section').forEach(function (section) {
      const container = section.querySelector('.container') || section;
      const squares = Array.from(container.querySelectorAll('.lm-card--square'));
      if (squares.length === 0) return;
      const size = squares[0].getBoundingClientRect().width;
      squares.forEach(function (sq) {
        sq.style.height = size + 'px';
      });
      container.querySelectorAll('.lm-card--wide').forEach(function (wide) {
        wide.style.height = size + 'px';
      });
    });
  }
  window.addEventListener('load', applyHeights);
  window.addEventListener('resize', applyHeights);
})();

// Scroll observer for gallery stage animation
(function galleryScrollAnim() {
  const stage = document.querySelector('[data-gallery-stage]');
  if (!stage) return;
  const img = stage.querySelector('.gallery-stage__image');
  const overlay = stage.querySelector('.gallery-stage__overlay');
  const label = stage.querySelector('.gallery-stage__label');
  const scrubContainer = document.querySelector('[data-gallery-scrub]');

  function update() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const top = scrubContainer.offsetTop;                 // section start Y
    const pin = stage.offsetHeight;                       // sticky height (~100vh)
    const buffer = 0.2 * vh;                              // extra scroll after animation (~20% of viewport)
    const effectiveRange = (scrubContainer.offsetHeight - pin - buffer);
    const end = top + effectiveRange;                     // end Y for animation; buffer remains after

    // progress 0..1 while the stage is pinned; scrubs in both directions
    const y = window.scrollY;
    const t = Math.max(0, Math.min(1, (y - top) / (end - top)));

    // Interpolate scale and blur based on t
    // End scale should make image width = 120% of wide card width
    const wideRef = document.querySelector('.lm-card--wide');
    const wideWidth = wideRef ? wideRef.getBoundingClientRect().width : 1100;
    const targetEndScale = Math.min(1, (1.2 * wideWidth) / (window.innerWidth || 1));
    const startScale = 1.8;
    const scale = startScale - (startScale - targetEndScale) * t; // ease linear with scroll
    const blur  = 24  * (1 - t);      // 24px -> 0px (stronger blur)
    img.style.transform = 'scale(' + scale.toFixed(3) + ')';
    img.style.filter = 'blur(' + blur.toFixed(2) + 'px)';

    // Overlay and label fade out with progress
    const overlayOpacity = 0.4 * (1 - t);
    overlay.style.opacity = overlayOpacity.toFixed(3);
    label.style.opacity = (1 - t).toFixed(3);

    // The 200vh container height naturally forces one extra viewport of scroll here
    // before moving on. No explicit scroll locking required.
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
})();


