(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.dock-hero');
  if (!hero) return;
  const slides = [...hero.querySelectorAll('.dock-hero__slide')];
  const dots = [...hero.querySelectorAll('[data-dock-slide]')];
  const play = hero.querySelector('.dock-hero__play');
  let active = 0;
  let playing = !motion.matches;
  let visible = true;
  let timer;

  function select(index) {
    active = index;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === active));
    dots.forEach((dot, i) => {
      dot.setAttribute('aria-pressed', String(i === active));
      dot.classList.toggle('is-active', i === active);
    });
  }
  function syncPlayback() {
    clearInterval(timer);
    play.setAttribute('aria-pressed', String(playing));
    play.setAttribute('aria-label', playing ? 'Pause Dock slideshow' : 'Play Dock slideshow');
    play.classList.toggle('is-paused', !playing);
    if (playing && visible && !document.hidden) {
      timer = setInterval(() => select((active + 1) % slides.length), 2000);
    }
  }
  dots.forEach((dot, index) => dot.addEventListener('click', () => {
    select(index);
    syncPlayback();
  }));
  play.addEventListener('click', () => { playing = !playing; syncPlayback(); });
  document.addEventListener('visibilitychange', syncPlayback);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }).observe(hero);
  }
  syncPlayback();

  // Cards start far apart and converge on their centered flex layout as it enters view.
  const collage = document.querySelector('.dock-pick__collage');
  const rows = [...collage.querySelectorAll('.dock-pick__row')];
  const pickItems = rows.map(row => [...row.querySelectorAll('.dock-pick__item')]);
  let frame;
  function renderRows() {
    frame = null;
    const rect = collage.getBoundingClientRect();
    const viewport = window.innerHeight;
    const progress = Math.max(0, Math.min(1, (viewport * .95 - rect.top) / (viewport * .65)));
    const remaining = motion.matches ? 0 : Math.pow(1 - progress, 2);
    const extraGap = Math.min(180, window.innerWidth * .14) * remaining;
    pickItems.forEach(items => {
      const center = (items.length - 1) / 2;
      items.forEach((item, index) => {
        item.style.transform = `translateX(${(index - center) * extraGap}px)`;
        item.classList.toggle('is-moving', !motion.matches && progress > 0 && progress < 1);
      });
    });
  }
  function scheduleRows() {
    if (!frame) frame = requestAnimationFrame(renderRows);
  }
  window.addEventListener('scroll', scheduleRows, { passive: true });
  window.addEventListener('resize', scheduleRows);
  motion.addEventListener('change', () => {
    if (motion.matches) playing = false;
    syncPlayback();
    scheduleRows();
  });
  renderRows();

  const preview = document.querySelector('[data-dock-asset="dock-together"]');
  document.querySelectorAll('[data-workspace]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-workspace]').forEach(other => {
        other.setAttribute('aria-pressed', String(other === button));
      });
      preview.dataset.workspace = button.dataset.workspace;
      preview.style.backgroundColor = button.dataset.workspace === 'dock' ? '' : '#e3e3e7';
    });
  });
})();

(() => {
  const track = document.querySelector('.dock-gallery__track');
  if (!track) return;
  const group = track.querySelector('.dock-gallery__group');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const before = group.cloneNode(true);
  const after = group.cloneNode(true);
  [before, after].forEach(copy => {
    copy.setAttribute('aria-hidden', 'true');
    copy.inert = true;
  });
  track.prepend(before);
  track.append(after);

  let period = 0;
  let pointer = null;
  let previousX = 0;
  let touching = false;
  let resumeAt = 0;
  let visible = false;
  let lastTime = 0;
  let frame = null;

  function wrap() {
    if (!period) return;
    if (track.scrollLeft < period || track.scrollLeft >= period * 2) {
      track.scrollLeft = period + ((track.scrollLeft - period) % period + period) % period;
    }
  }
  function measure() {
    const previousPeriod = period;
    const offset = previousPeriod ? (track.scrollLeft - previousPeriod) / previousPeriod : 0;
    period = group.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).gap) || 0);
    track.scrollLeft = period + offset * period;
    wrap();
  }
  function pause() { resumeAt = performance.now() + 1800; }
  function tick(time) {
    frame = null;
    const elapsed = lastTime ? Math.min(time - lastTime, 50) : 0;
    lastTime = time;
    if (pointer === null && !touching && time >= resumeAt) {
      // Increasing scrollLeft carries the images from right to left at 36px/s.
      track.scrollLeft += elapsed * .036;
      wrap();
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    lastTime = 0;
    if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(tick);
  }
  track.addEventListener('pointerdown', event => {
    pause();
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    pointer = event.pointerId;
    previousX = event.clientX;
    track.setPointerCapture(pointer);
    track.classList.add('is-dragging');
    event.preventDefault();
  });
  track.addEventListener('pointermove', event => {
    if (event.pointerId !== pointer) return;
    track.scrollLeft += previousX - event.clientX;
    previousX = event.clientX;
    wrap();
  });
  function release(event) {
    if (event.pointerId !== pointer) return;
    pointer = null;
    track.classList.remove('is-dragging');
    pause();
  }
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(name => track.addEventListener(name, release));
  track.addEventListener('scroll', wrap, { passive: true });
  track.addEventListener('wheel', pause, { passive: true });
  track.addEventListener('touchstart', () => { touching = true; pause(); }, { passive: true });
  track.addEventListener('touchmove', pause, { passive: true });
  ['touchend', 'touchcancel'].forEach(name => track.addEventListener(name, () => { touching = false; pause(); }, { passive: true }));
  track.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    pause();
    track.scrollLeft += (event.key === 'ArrowRight' ? 1 : -1) * (track.clientWidth * .65);
    wrap();
  });
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { rootMargin: '100px' }).observe(track);
  } else {
    visible = true;
  }
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(track);
  else window.addEventListener('resize', measure);
  measure();
  sync();
})();
