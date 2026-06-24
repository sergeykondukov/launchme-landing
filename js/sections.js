    (function () {
        // Position of an element's centre within the track's scroll space.
        function centerOffset(track, el) {
            var t = track.getBoundingClientRect(), e = el.getBoundingClientRect();
            return track.scrollLeft + (e.left - t.left) - (track.clientWidth - e.width) / 2;
        }
        function gapOf(track) {
            return parseInt(getComputedStyle(track).columnGap || getComputedStyle(track).gap || '24', 10) || 24;
        }

        // ---- 1) "Explore" big-card carousel: dots + play/pause ----
        [].slice.call(document.querySelectorAll('[data-explore]')).forEach(function (root) {
            var track = root.querySelector('[data-explore-track]');
            var slides = [].slice.call(root.querySelectorAll('[data-explore-slide]'));
            var section = root.closest('.ai-explore');
            var dotsWrap = section.querySelector('[data-explore-dots]');
            var playBtn = section.querySelector('[data-explore-play]');
            if (!track || !slides.length) return;

            var dots = slides.map(function (s, i) {
                var b = document.createElement('button');
                b.className = 'ai-dot' + (i === 0 ? ' is-active' : '');
                b.type = 'button';
                b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
                b.addEventListener('click', function () { stopAuto(); goTo(i); });
                dotsWrap.appendChild(b);
                return b;
            });

            function snapPad() {
                // Some engines report scroll-padding as the raw max()/calc() string
                // (parseFloat → NaN), so fall back to padding-left, which equals it here.
                var cs = getComputedStyle(track);
                return parseFloat(cs.scrollPaddingLeft) || parseFloat(cs.paddingLeft) || 0;
            }
            function targetFor(i) {
                var t = track.getBoundingClientRect(), e = slides[i].getBoundingClientRect();
                return track.scrollLeft + (e.left - t.left) - snapPad();
            }
            function activeIndex() {
                var refX = track.getBoundingClientRect().left + snapPad(), best = 0, bestD = Infinity;
                slides.forEach(function (s, i) {
                    var d = Math.abs(s.getBoundingClientRect().left - refX);
                    if (d < bestD) { bestD = d; best = i; }
                });
                return best;
            }

            // Soft eased scroll (decelerates into place; no snap-fight = no end jerk).
            var animId = null;
            function animateTo(target) {
                if (animId) cancelAnimationFrame(animId);
                var start = track.scrollLeft, dist = target - start;
                if (Math.abs(dist) < 1) return;
                // Turn off snapping for the duration: otherwise the browser keeps
                // yanking scrollLeft to the nearest snap point each frame, which
                // overrides the eased motion and makes the switch look jumpy.
                track.style.scrollSnapType = 'none';
                var dur = 800, t0 = null;
                function ease(p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
                function frame(ts) {
                    if (t0 === null) t0 = ts;
                    var p = Math.min(1, (ts - t0) / dur);
                    track.scrollLeft = start + dist * ease(p);
                    if (p < 1) { animId = requestAnimationFrame(frame); }
                    else { animId = null; track.style.scrollSnapType = ''; } // re-enable snap
                }
                animId = requestAnimationFrame(frame);
            }
            function goTo(i) { animateTo(targetFor(Math.max(0, Math.min(slides.length - 1, i)))); }
            function syncDots() {
                var a = activeIndex();
                dots.forEach(function (d, i) { d.classList.toggle('is-active', i === a); });
            }
            track.addEventListener('scroll', function () { window.requestAnimationFrame(syncDots); }, { passive: true });

            var timer = null;
            function startAuto() {
                stopAuto();
                timer = setInterval(function () { goTo((activeIndex() + 1) % slides.length); }, 5000);
                if (playBtn) playBtn.classList.remove('is-paused');
            }
            function stopAuto() {
                if (timer) { clearInterval(timer); timer = null; }
                if (playBtn) playBtn.classList.add('is-paused');
            }
            if (playBtn) playBtn.addEventListener('click', function () { timer ? stopAuto() : startAuto(); });
            // Auto-pause the moment the user starts scrolling the cards themselves.
            ['wheel', 'touchstart', 'pointerdown'].forEach(function (ev) {
                track.addEventListener(ev, function () { if (timer) stopAuto(); }, { passive: true });
            });
            stopAuto();   // start paused — autoplay only when the user presses play
        });

        // ---- 2) "Visual Intelligence" full-bleed slider: arrows ----
        [].slice.call(document.querySelectorAll('.ai-vi')).forEach(function (section) {
            var track = section.querySelector('[data-vi-track]');
            if (!track) return;
            function step() {
                var card = track.querySelector('.vi-card');
                if (!card) return track.clientWidth * 0.7;
                return card.getBoundingClientRect().width + gapOf(track);
            }
            var next = section.querySelector('[data-vi-next]');
            var prev = section.querySelector('[data-vi-prev]');
            // The track has CSS scroll-behavior: smooth, so a plain scrollBy animates.
            if (next) next.addEventListener('click', function () { track.scrollBy(step(), 0); });
            if (prev) prev.addEventListener('click', function () { track.scrollBy(-step(), 0); });
        });

        // ---- 3) Apple-style scroll reveal: fade + slide up on enter ----
        (function () {
            var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            var sel = '.eyebrow, .section-kicker, .section-title, .section-sub, .lm-card,'
                + ' .lm-feature-tile, .language-item, .accordion-item, .guides-list li, .cta-pill,'
                + ' .ai-explore__title, .ai-vi__eyebrow, .ai-vi__title, .ai-vi__sub, .vi-card';
            var els = [].slice.call(document.querySelectorAll(sel));
            if (!els.length) return;
            // Add the hook class from JS so content stays visible if JS/anim is off.
            var groups = new Map();
            els.forEach(function (el) {
                el.classList.add('reveal');
                var p = el.parentElement, arr = groups.get(p) || [];
                arr.push(el); groups.set(p, arr);
            });
            // Light stagger for items that share a parent (rows, grids).
            groups.forEach(function (arr) {
                if (arr.length > 1) arr.forEach(function (el, i) { el.style.transitionDelay = Math.min(i * 70, 350) + 'ms'; });
            });
            if (reduce || !('IntersectionObserver' in window)) {
                els.forEach(function (el) { el.classList.add('is-in'); });
                return;
            }
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (e) {
                    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
            els.forEach(function (el) { io.observe(el); });
        })();
    })();
    
