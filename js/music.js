(() => {
  const showcase = document.querySelector('.music-showcase');
  const scenes = [...document.querySelectorAll('.music-scene')];
  const hero = document.querySelector('.music-intro__hero');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const sceneButtons = [...document.querySelectorAll('.music-scene-nav button')];
  sceneButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const stage = showcase.querySelector('.music-showcase__stage');
      const distance = showcase.offsetHeight - stage.clientHeight;
      window.scrollTo({ top: window.scrollY + showcase.getBoundingClientRect().top + distance * index / (scenes.length - 1), behavior: reduceMotion.matches ? 'instant' : 'smooth' });
    });
  });
  const videoStates = new WeakMap();
  function syncVideo(scene, visibleRatio) {
    const video = scene.querySelector('video');
    if (!video) return;
    const shouldPlay = !document.hidden && visibleRatio >= .2;
    if (videoStates.get(video) === shouldPlay) return;
    videoStates.set(video, shouldPlay);
    if (shouldPlay) {
      video.play().catch(() => { videoStates.delete(video); });
    } else {
      video.pause();
    }
  }
  let pending = false;
  function renderHero() {
    if (!hero) return;
    if (reduceMotion.matches) {
      hero.style.transform = '';
      hero.style.filter = '';
      hero.style.opacity = '';
      return;
    }
    // Read the untransformed layout height so perspective never changes the scroll range.
    const progress = Math.min(1, Math.max(0, window.scrollY / Math.max(1, hero.offsetHeight * .9)));
    const eased = progress * progress * (3 - 2 * progress);
    hero.style.transform = `perspective(1200px) rotateX(${-48 * eased}deg) scale(${1 - .08 * eased})`;
    hero.style.filter = `blur(${7 * eased}px)`;
    hero.style.opacity = String(1 - .3 * eased);
  }
  function renderScenes() {
    pending = false;
    renderHero();
    if (!showcase.classList.contains('is-enhanced')) {
      scenes.forEach(scene => {
        const bounds = scene.getBoundingClientRect();
        syncVideo(scene, Math.max(0, Math.min(innerHeight, bounds.bottom) - Math.max(0, bounds.top)) / Math.max(1, bounds.height));
      });
      return;
    }
    const rect = showcase.getBoundingClientRect();
    const viewport = showcase.querySelector('.music-showcase__stage').clientHeight;
    // Use only the three transitions, with no extra scroll before or after them.
    const progress = Math.max(0, Math.min(scenes.length - 1, -rect.top / (rect.height - viewport) * (scenes.length - 1)));
    const active = Math.min(scenes.length - 1, Math.floor(progress + .5));
    sceneButtons.forEach((button, index) => button.setAttribute('aria-current', String(index === active)));
    const stageBounds = showcase.querySelector('.music-showcase__stage').getBoundingClientRect();
    const reveals = scenes.map((_, index) => index === 0 ? 0 : Math.max(0, Math.min(100, (index - progress) * 100)));
    scenes.forEach((scene, index) => {
      const reveal = reveals[index];
      // Later scenes cover earlier ones; count only the exposed strip inside the viewport.
      const exposedTop = stageBounds.top + viewport * reveal / 100;
      const exposedBottom = stageBounds.top + viewport * (reveals[index + 1] ?? 100) / 100;
      const visibleHeight = Math.max(0, Math.min(innerHeight, exposedBottom) - Math.max(0, exposedTop));
      syncVideo(scene, visibleHeight / Math.max(1, viewport));
      scene.style.clipPath = `inset(${reveal}% 0 0 0)`;
      const copyOffset = Math.max(-1, Math.min(index === 0 ? 0 : 1, index - progress));
      scene.querySelector('.music-scene__copy').style.transform = `translateY(${copyOffset * viewport}px)`;
    });
  }
  function configureMotion() {
    showcase.classList.toggle('is-enhanced', !reduceMotion.matches);
    scenes.forEach(scene => { scene.style.clipPath = ''; scene.querySelector('.music-scene__copy').style.transform = ''; });
    renderScenes();
  }
  function requestRender() {
    if (!pending) { pending = true; requestAnimationFrame(renderScenes); }
  }
  addEventListener('scroll', requestRender, { passive: true });
  addEventListener('resize', requestRender);
  document.addEventListener('visibilitychange', requestRender);
  hero?.addEventListener('load', requestRender);
  reduceMotion.addEventListener('change', configureMotion);
  configureMotion();

  const track = document.querySelector('.music-styles__track');
  const slides = [...track.children];
  const dots = document.querySelector('.music-styles__dots');
  let current = 0;
  const buttons = slides.map((slide, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `Go to widget style ${index + 1}`);
    button.setAttribute('aria-controls', slide.id);
    button.addEventListener('click', () => go(index));
    dots.append(button);
    return button;
  });
  function offset(slide) {
    return track.scrollLeft + slide.getBoundingClientRect().left - track.getBoundingClientRect().left - parseFloat(getComputedStyle(track).paddingLeft);
  }
  function sync() {
    current = slides.reduce((best, slide, index) => Math.abs(offset(slide) - track.scrollLeft) < Math.abs(offset(slides[best]) - track.scrollLeft) ? index : best, 0);
    if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) current = slides.length - 1;
    buttons.forEach((button, index) => button.setAttribute('aria-current', String(index === current)));
    document.querySelector('[data-music-prev]').disabled = current === 0;
    document.querySelector('[data-music-next]').disabled = current === slides.length - 1;
  }
  function go(index) {
    track.scrollTo({ left: offset(slides[Math.max(0, Math.min(slides.length - 1, index))]), behavior: reduceMotion.matches ? 'instant' : 'smooth' });
  }
  track.addEventListener('scroll', sync, { passive: true });
  document.querySelector('[data-music-prev]').addEventListener('click', () => go(current - 1));
  document.querySelector('[data-music-next]').addEventListener('click', () => go(current + 1));
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); go(current + (event.key === 'ArrowRight' ? 1 : -1)); }
  });
  addEventListener('resize', sync);
  sync();
})();
