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
  const videoHost = stage.querySelector('.gallery-stage__video-box') || stage.querySelector('.gallery-stage__video');
  const overlay = stage.querySelector('.gallery-stage__overlay');
  const label = stage.querySelector('.gallery-stage__label');
  const scrubContainer = document.querySelector('[data-gallery-scrub]');

  // If on mobile (<= 767px), show a simple static frame without scroll-driven animation
  function applyMobileStatic() {
    if (!img || !videoHost) return;
    img.style.transform = 'scale(1) translateY(0)';
    img.style.filter = 'none';
    const host = stage.querySelector('.gallery-stage__video');
    if (host) {
      host.style.transform = 'scale(1) translateY(0)';
      host.style.filter = 'none';
    }
    const videoEl = stage.querySelector('.gallery-stage__video-box video');
    if (videoEl) videoEl.style.filter = 'none';
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.backdropFilter = 'none';
    }
    if (label) label.style.display = 'none';
  }

  // Defer mobile static mode until after video is mounted

  // Inject video if data attributes are present on the stage or its container
  // Usage example (HTML):
  // <div class="gallery-stage" data-gallery-stage data-video-src="videos/demo.mp4" data-video-poster="images/poster.jpg"></div>
  (function mountOverlayVideo() {
    if (!videoHost) return;
    const src = stage.getAttribute('data-video-src') || scrubContainer.getAttribute('data-video-src');
    if (!src) return;
    const poster = stage.getAttribute('data-video-poster') || scrubContainer.getAttribute('data-video-poster') || '';
    const loop = (stage.getAttribute('data-video-loop') || 'true') === 'true';
    const muted = (stage.getAttribute('data-video-muted') || 'true') === 'true';
    const autoplay = (stage.getAttribute('data-video-autoplay') || 'true') === 'true';
    const video = document.createElement('video');
    video.src = src;
    if (poster) video.poster = poster;
    video.loop = loop;
    video.muted = muted;
    video.autoplay = autoplay;
    video.playsInline = true;
    video.preload = 'auto';
    video.controls = false;
    // Start playback when can play to avoid jank
    video.addEventListener('canplay', function () {
      if (autoplay) video.play().catch(function () {});
    });
    videoHost.appendChild(video);
  })();

  if (window.matchMedia && window.matchMedia('(max-width: 767px)').matches) {
    applyMobileStatic();
    return; // skip binding scroll handlers on mobile
  }

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
    // Base end scale derived from reference width vs viewport
    let targetEndScale = (1.2 * wideWidth) / (window.innerWidth || 1);
    // Optional desktop-only boost to make the final state larger
    const styleVars = getComputedStyle(stage);
    const boost = parseFloat(styleVars.getPropertyValue('--final-scale-boost')) || 1;
    targetEndScale = targetEndScale * boost;
    // Clamp to avoid excessive growth on very large boosts
    targetEndScale = Math.min(targetEndScale, 1.8);
    const startScale = 1.89; // Increased initial zoom by ~5% for a tighter starting view
    const scale = startScale - (startScale - targetEndScale) * t; // ease linear with scroll
    const blur  = 24  * (1 - t);      // 24px -> 0px (stronger blur)
    // Vertical motion: small start overshoot, and center the frame at the end
    const styles = getComputedStyle(stage);
    const startOvershootRaw = styles.getPropertyValue('--stage-start-overshoot').trim() || '0';
    let startOvershoot;
    if (startOvershootRaw.endsWith('vh')) {
      const num = parseFloat(startOvershootRaw);
      startOvershoot = (window.innerHeight || document.documentElement.clientHeight) * (num / 100);
    } else if (startOvershootRaw.endsWith('px')) {
      startOvershoot = parseFloat(startOvershootRaw);
    } else {
      startOvershoot = parseFloat(startOvershootRaw) || 0;
    }
    // Ease overshoot from -startOvershoot at t=0 to 0 at t=1 (ease-out)
    const overshootY = -(1 - t) * startOvershoot;
    // Centering: compute the scaled frame height and center it vertically at the end
    const frameWidthPx = img.offsetWidth || 0; // equals --frame-w
    let imageAspect = 0;
    if (img.naturalWidth && img.naturalHeight) {
      imageAspect = img.naturalHeight / img.naturalWidth;
    } else {
      const rect = img.getBoundingClientRect();
      imageAspect = rect.height > 0 && frameWidthPx > 0 ? (rect.height / Math.max(scale, 0.0001)) / frameWidthPx : 0.62;
    }
    const scaledHeight = frameWidthPx * imageAspect * scale;
    const centerY = (vh - scaledHeight) / 2; // where the top should end up at t=1
    const shiftY = overshootY + centerY * (t * t); // smoothly approach center as t->1
    img.style.transform = 'translateY(' + shiftY.toFixed(2) + 'px) scale(' + scale.toFixed(3) + ')';
    // Apply half-strength blur to the laptop image only
    img.style.filter = 'blur(' + (blur / 2).toFixed(2) + 'px)';

    // Keep overlay video visually glued to the image scale for realism
    if (videoHost) {
      const host = stage.querySelector('.gallery-stage__video');
      if (host) {
        // Slightly overscale video at start to avoid gaps between frame and video
        const videoBoost = parseFloat(styles.getPropertyValue('--video-start-boost')) || 1.05; // 5% at t=0
        const boostFactor = 1 + (videoBoost - 1) * (1 - t); // -> 1 at t=1
        const videoScale = scale * boostFactor;
        host.style.transform = 'translateY(' + shiftY.toFixed(2) + 'px) scale(' + videoScale.toFixed(3) + ')';
        // Apply same blur to the video container so its edges blur uniformly with the image
        host.style.filter = 'blur(' + blur.toFixed(2) + 'px)';
      }
      const videoEl = videoHost.querySelector('video');
      if (videoEl) {
        // Also apply to the video element for browsers that ignore container filter on children
        videoEl.style.filter = 'blur(' + blur.toFixed(2) + 'px)';
      }
    }

    // Overlay and label fade out with progress
    const overlayOpacity = 0.4 * (1 - t);
    overlay.style.opacity = overlayOpacity.toFixed(3);
    // Apply matching blur via backdrop-filter so content behind (image + video) blurs together
    overlay.style.backdropFilter = 'blur(' + blur.toFixed(2) + 'px)';
    label.style.opacity = (1 - t).toFixed(3);

    // The 200vh container height naturally forces one extra viewport of scroll here
    // before moving on. No explicit scroll locking required.
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
})();


