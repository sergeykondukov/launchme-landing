(() => {
  const showcase = document.querySelector('.music-showcase');
  const scenes = [...document.querySelectorAll('.music-scene')];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const sceneButtons = [...document.querySelectorAll('.music-scene-nav button')];
  sceneButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const stage = showcase.querySelector('.music-showcase__stage');
      const distance = showcase.offsetHeight - stage.clientHeight;
      window.scrollTo({ top: window.scrollY + showcase.getBoundingClientRect().top + distance * index / (scenes.length - 1), behavior: reduceMotion.matches ? 'instant' : 'smooth' });
    });
  });
  let pending = false;
  function renderScenes() {
    pending = false;
    if (!showcase.classList.contains('is-enhanced')) return;
    const rect = showcase.getBoundingClientRect();
    const viewport = showcase.querySelector('.music-showcase__stage').clientHeight;
    // Use only the three transitions, with no extra scroll before or after them.
    const progress = Math.max(0, Math.min(scenes.length - 1, -rect.top / (rect.height - viewport) * (scenes.length - 1)));
    const active = Math.min(scenes.length - 1, Math.floor(progress + .5));
    sceneButtons.forEach((button, index) => button.setAttribute('aria-current', String(index === active)));
    scenes.forEach((scene, index) => {
      const reveal = index === 0 ? 0 : Math.max(0, Math.min(100, (index - progress) * 100));
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
