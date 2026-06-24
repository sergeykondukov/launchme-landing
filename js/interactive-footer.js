/*
  Interactive reveal layer (hero scene + footer backdrop).
  For every [data-interactive] element: layer-2 is the CSS background, and a <canvas>
  paints a fluid "liquid" reveal of layer-1 in a blob that follows the cursor and fades
  out over ~2.6s. Self-contained and idempotent: safe to load on any page and more than once.
*/
(function () {
  function initInteractiveLayer(root) {
    if (root.__revealInit) return;          // never double-init the same element
    root.__revealInit = true;

    var canvas = root.querySelector('canvas');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');

    // Top layer doubles as the element background, so it shows even if JS is off
    // or reduced-motion is on. The canvas only paints the revealed (layer-1) blobs.
    root.style.backgroundImage = "url('" + root.getAttribute('data-layer-top') + "')";

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var imgReveal = new Image();
    imgReveal.src = root.getAttribute('data-layer-reveal');

    // Off-screen mask: alpha field that says where layer-1 shows through.
    var mask = document.createElement('canvas');
    var mctx = mask.getContext('2d');

    var cw = 0, ch = 0, dpr = 1;
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var rect = root.getBoundingClientRect();
      if (!rect.width) return;
      cw = Math.round(rect.width * dpr);
      ch = Math.round(rect.height * dpr);
      canvas.width = cw; canvas.height = ch;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      mask.width = cw; mask.height = ch;
    }
    resize();
    window.addEventListener('resize', resize);

    function baseR() { return Math.max(30 * dpr, ch * 0.25); }

    // --- Liquid "drops" -------------------------------------------------
    // Each cursor sample spawns a drop. A drop is rendered as a few wobbling
    // lobes (so the shape is organic, not a round spot) and lives ~LIFE ms:
    // it holds briefly, then fades out — revealed areas dissolve gradually.
    var LIFE = 2600;   // total lifetime (ms) ≈ "disappears in 2-3 seconds"
    var HOLD = 450;    // stay fully revealed before starting to fade
    var MAX_DROPS = 110;
    var drops = [];

    function addDrop(x, y) {
      var r = baseR();
      drops.push({
        x: x, y: y,
        r: r * (0.42 + Math.random() * 0.4),
        born: performance.now(),
        seed: Math.random() * 1000,
        lobes: 2 + (Math.random() * 3 | 0)
      });
      if (drops.length > MAX_DROPS) drops.shift();
    }

    // Interpolate along the cursor path so quick moves leave a continuous trail.
    var last = null;
    function trail(x, y) {
      if (last) {
        var dx = x - last.x, dy = y - last.y;
        var dist = Math.hypot(dx, dy);
        var gap = baseR() * 0.18;
        var steps = Math.max(1, Math.floor(dist / gap));
        for (var i = 1; i <= steps; i++) addDrop(last.x + dx * i / steps, last.y + dy * i / steps);
      } else {
        addDrop(x, y);
      }
      last = { x: x, y: y };
      start();
    }
    function toCanvas(e) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / rect.width * cw,
        y: (e.clientY - rect.top) / rect.height * ch
      };
    }
    root.addEventListener('pointermove', function (e) {
      if (!cw) return;
      var c = toCanvas(e);
      trail(c.x, c.y);
    });
    root.addEventListener('pointerleave', function () { last = null; });

    function blob(x, y, r, a) {
      var g = mctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(255,255,255,' + a + ')');
      g.addColorStop(0.6, 'rgba(255,255,255,' + (a * 0.45) + ')');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      mctx.fillStyle = g;
      mctx.beginPath();
      mctx.arc(x, y, r, 0, Math.PI * 2);
      mctx.fill();
    }

    var running = false;
    function frame() {
      if (!running) return;
      var now = performance.now();

      mctx.clearRect(0, 0, cw, ch);
      mctx.globalCompositeOperation = 'lighter'; // additive: lobes merge into liquid
      for (var i = drops.length - 1; i >= 0; i--) {
        var d = drops[i];
        var age = now - d.born;
        if (age >= LIFE) { drops.splice(i, 1); continue; }
        // opacity: hold, then ease-out fade to 0
        var op = age < HOLD ? 1 : 1 - (age - HOLD) / (LIFE - HOLD);
        op = op * op;
        var wob = 1 + Math.sin(now / 620 + d.seed) * 0.07;
        // off-centre wobbling lobes give the uneven, fluid outline
        for (var l = 0; l < d.lobes; l++) {
          var ang = d.seed + l * (6.2832 / d.lobes) + now / 1300;
          var lr = d.r * (0.5 + 0.28 * Math.sin(now / 540 + d.seed + l));
          blob(d.x + Math.cos(ang) * d.r * 0.34, d.y + Math.sin(ang) * d.r * 0.34, lr * wob, op * 0.55);
        }
        blob(d.x, d.y, d.r * wob, op * 0.8);
      }
      mctx.globalCompositeOperation = 'source-over';

      // Composite layer-1 clipped to the mask, over the CSS top-layer background.
      // A blur on the mask fuses the lobes into one smooth gooey surface.
      ctx.clearRect(0, 0, cw, ch);
      ctx.globalCompositeOperation = 'source-over';
      ctx.filter = 'blur(' + (5 * dpr) + 'px)';
      ctx.drawImage(mask, 0, 0);
      ctx.filter = 'none';
      ctx.globalCompositeOperation = 'source-in';
      ctx.drawImage(imgReveal, 0, 0, cw, ch);
      ctx.globalCompositeOperation = 'source-over';

      if (drops.length) requestAnimationFrame(frame);
      else { running = false; ctx.clearRect(0, 0, cw, ch); }
    }
    function start() {
      if (running || onscreen === false) return;
      running = true;
      requestAnimationFrame(frame);
    }

    // Only animate while the scene is on screen.
    var onscreen = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          onscreen = en.isIntersecting;
          if (!onscreen) running = false;
        });
      }, { threshold: 0 }).observe(root);
    }
  }

  function initAll() {
    [].forEach.call(document.querySelectorAll('[data-interactive]'), initInteractiveLayer);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
