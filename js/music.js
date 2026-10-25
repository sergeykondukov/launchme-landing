(() => {
  const showcase = document.querySelector('.music-showcase');
  const scenes = [...document.querySelectorAll('.music-scene')];
  const hero = document.querySelector('.music-intro__hero');
  const mobileMotion = matchMedia('(max-width: 767px)');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const sceneButtons = [...document.querySelectorAll('.music-scene-nav button')];
  sceneButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      const stage = showcase.querySelector('.music-showcase__stage');
      const distance = showcase.offsetHeight - stage.clientHeight;
      window.scrollTo({ top: window.scrollY + showcase.getBoundingClientRect().top + distance * index / (scenes.length - 1), behavior: reduceMotion.matches ? 'instant' : 'smooth' });
    });
  });
  function loadVideo(video) {
    if (document.hidden) return;
    const sources = [...video.querySelectorAll('source[data-src]')];
    if (!sources.length) return;
    sources.forEach(source => {
      source.src = source.dataset.src;
      source.removeAttribute('data-src');
    });
    video.preload = 'auto';
    video.load();
  }
  function isNearViewport(element, margin = 400) {
    const rect = element.getBoundingClientRect();
    return rect.bottom > -margin && rect.top < innerHeight + margin
      && rect.right > -margin && rect.left < innerWidth + margin;
  }
  const videoStates = new WeakMap();
  const pendingVideos = new WeakSet();
  function syncVideo(target, visibleRatio) {
    const video = target.matches('video') ? target : target.querySelector('video');
    if (!video) return;
    const shouldPlay = !document.hidden && visibleRatio >= .2;
    videoStates.set(video, shouldPlay);
    if (shouldPlay) loadVideo(video);
    if (!shouldPlay) {
      video.pause();
    } else if (video.paused && !pendingVideos.has(video) && !video.error) {
      pendingVideos.add(video);
      video.play().then(() => {
        // Scrolling away while play() is pending must not restart a hidden video.
        if (!videoStates.get(video)) video.pause();
      }).catch(() => {}).finally(() => pendingVideos.delete(video));
    }
  }
  document.querySelectorAll('.music-style video, .music-macbook__screen video').forEach(video => {
    const card = video.closest('.music-style, .music-macbook__screen');
    video.addEventListener('playing', () => card.classList.add('is-video-ready'));
    ['emptied', 'error'].forEach(event => video.addEventListener(event, () => card.classList.remove('is-video-ready')));
  });
  const regularVideos = [...document.querySelectorAll('video')].filter(video => !video.closest('.music-scene'));
  function visibleVideoRatio(video, clipTop = 0, clipBottom = innerHeight) {
    const bounds = video.getBoundingClientRect();
    let left = Math.max(0, bounds.left), right = Math.min(innerWidth, bounds.right);
    let top = Math.max(0, clipTop, bounds.top), bottom = Math.min(innerHeight, clipBottom, bounds.bottom);
    // Account for both the horizontal slider and the rounded card's clipped media.
    for (let parent = video.parentElement; parent; parent = parent.parentElement) {
      const style = getComputedStyle(parent);
      const rect = parent.getBoundingClientRect();
      if (/(auto|scroll|hidden|clip)/.test(style.overflowX)) {
        left = Math.max(left, rect.left); right = Math.min(right, rect.right);
      }
      if (/(auto|scroll|hidden|clip)/.test(style.overflowY)) {
        top = Math.max(top, rect.top); bottom = Math.min(bottom, rect.bottom);
      }
    }
    return Math.max(0, right - left) * Math.max(0, bottom - top) / Math.max(1, bounds.width * bounds.height);
  }
  // Native intersection tracking accounts for the carousel's overflow clipping.
  // Avoid walking every video's ancestors on every animation frame.
  const regularVisibility = new Map();
  const playbackObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      regularVisibility.set(entry.target, entry.intersectionRatio);
      syncVideo(entry.target, entry.intersectionRatio);
    });
  }, { threshold: [0, .2, 1] });
  const preloadObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !document.hidden) {
        loadVideo(entry.target);
        preloadObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '400px', threshold: 0 });
  regularVideos.forEach(video => {
    playbackObserver.observe(video);
    preloadObserver.observe(video);
  });
  document.addEventListener('visibilitychange', () => {
    regularVisibility.forEach((ratio, video) => syncVideo(video, ratio));
  });
  let lastHeroProgress = null;
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
    if (progress === lastHeroProgress) return;
    lastHeroProgress = progress;
    const eased = progress * progress * (3 - 2 * progress);
    hero.style.transform = `perspective(1200px) rotateX(${-(mobileMotion.matches ? 28 : 48) * eased}deg) scale(${1 - .08 * eased})`;
    hero.style.filter = mobileMotion.matches ? 'none' : `blur(${7 * eased}px)`;
    hero.style.opacity = String(1 - .3 * eased);
  }
  function renderScenes() {
    pending = false;
    renderHero();
    if (!showcase.classList.contains('is-enhanced')) {
      scenes.forEach(scene => {
        const video = scene.querySelector('video');
        if (video) {
          if (isNearViewport(video)) loadVideo(video);
          syncVideo(video, visibleVideoRatio(video));
        }
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
    const sceneFrames = scenes.map((scene, index) => {
      const reveal = reveals[index];
      // Later scenes cover earlier ones; count only the exposed strip inside the viewport.
      const exposedTop = stageBounds.top + viewport * reveal / 100;
      const exposedBottom = stageBounds.top + viewport * (reveals[index + 1] ?? 100) / 100;
      const video = scene.querySelector('video');
      if (video) {
        // Stacked scenes share the same rectangle, so proximity alone would load all four.
        const nearStage = stageBounds.bottom > -400 && stageBounds.top < innerHeight + 400;
        if (nearStage && Math.abs(index - progress) <= 1) loadVideo(video);
        const bounds = video.getBoundingClientRect();
        const width = Math.max(0, Math.min(innerWidth, bounds.right) - Math.max(0, bounds.left));
        const height = Math.max(0, Math.min(innerHeight, exposedBottom, bounds.bottom) - Math.max(0, exposedTop, bounds.top));
        syncVideo(video, width * height / Math.max(1, bounds.width * bounds.height));
      }
      const copyOffset = Math.max(-1, Math.min(index === 0 ? 0 : 1, index - progress));
      return { scene, reveal, copyOffset, visible: (reveals[index + 1] ?? 100) > reveal };
    });
    // Finish geometry reads before changing styles. Fully covered layers need no painting.
    sceneFrames.forEach(({ scene, reveal, copyOffset, visible }) => {
      scene.style.visibility = visible ? 'visible' : 'hidden';
      scene.style.clipPath = reveal === 0 ? 'none' : `inset(${reveal}% 0 0 0)`;
      scene.style.willChange = visible && reveal > 0 && reveal < 100 ? 'clip-path' : 'auto';
      scene.querySelector('.music-scene__copy').style.transform = `translate3d(0, ${copyOffset * viewport}px, 0)`;
    });
  }
  function configureMotion() {
    showcase.classList.toggle('is-enhanced', !reduceMotion.matches && !mobileMotion.matches);
    lastHeroProgress = null;
    scenes.forEach(scene => { scene.style.visibility = ''; scene.style.willChange = ''; scene.style.clipPath = ''; scene.querySelector('.music-scene__copy').style.transform = ''; });
    renderScenes();
  }
  function requestRender() {
    if (!pending) { pending = true; requestAnimationFrame(renderScenes); }
  }
  // Capture also catches scrolling inside the horizontal carousel.
  document.addEventListener('scroll', requestRender, { passive: true, capture: true });
  document.querySelectorAll('video').forEach(video => video.addEventListener('loadeddata', requestRender));
  addEventListener('resize', requestRender);
  document.addEventListener('visibilitychange', requestRender);
  hero?.addEventListener('load', requestRender);
  reduceMotion.addEventListener('change', configureMotion);
  mobileMotion.addEventListener('change', configureMotion);
  configureMotion();

  const track = document.querySelector('.music-styles__track');
  const slides = [...track.children];
  const dots = document.querySelector('.music-styles__dots');
  let current = 0;
  let slideTimer = null;
  const playButton = document.querySelector('[data-music-play]');
  let slideAnimation = null;
  function stopSlideshow() {
    if (slideAnimation !== null) {
      cancelAnimationFrame(slideAnimation);
      slideAnimation = null;
      track.style.scrollSnapType = '';
    }
    clearInterval(slideTimer);
    slideTimer = null;
    playButton.classList.add('is-paused');
    playButton.setAttribute('aria-label', 'Play slideshow');
  }
  playButton.addEventListener('click', () => {
    if (slideTimer) { stopSlideshow(); return; }
    slideTimer = setInterval(() => { if (!document.hidden) go((current + 1) % slides.length); }, 3000);
    playButton.classList.remove('is-paused');
    playButton.setAttribute('aria-label', 'Pause slideshow');
  });
  ['wheel', 'touchstart', 'pointerdown'].forEach(event => track.addEventListener(event, stopSlideshow, { passive: true }));
  const buttons = slides.map((slide, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ai-dot';
    button.setAttribute('aria-label', `Go to widget style ${index + 1}`);
    button.setAttribute('aria-controls', slide.id);
    button.addEventListener('click', () => { stopSlideshow(); go(index); });
    dots.append(button);
    return button;
  });
  function offset(slide) {
    return track.scrollLeft + slide.getBoundingClientRect().left - track.getBoundingClientRect().left - parseFloat(getComputedStyle(track).paddingLeft);
  }
  function sync() {
    current = slides.reduce((best, slide, index) => Math.abs(offset(slide) - track.scrollLeft) < Math.abs(offset(slides[best]) - track.scrollLeft) ? index : best, 0);
    if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) current = slides.length - 1;
    buttons.forEach((button, index) => {
      button.setAttribute('aria-current', String(index === current));
      button.classList.toggle('is-active', index === current);
    });
  }
  function go(index) {
    if (slideAnimation !== null) cancelAnimationFrame(slideAnimation);
    const target = Math.max(0, Math.min(track.scrollWidth - track.clientWidth, offset(slides[Math.max(0, Math.min(slides.length - 1, index))])));
    if (reduceMotion.matches) {
      track.scrollLeft = target;
      slideAnimation = null;
      track.style.scrollSnapType = '';
      return;
    }
    const start = track.scrollLeft;
    const distance = target - start;
    const duration = 1100;
    let startedAt = null;
    // Disable snapping while animating so it cannot pull the track ahead abruptly.
    track.style.scrollSnapType = 'none';
    function frame(now) {
      if (startedAt === null) startedAt = now;
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
      track.scrollLeft = start + distance * eased;
      if (progress < 1) slideAnimation = requestAnimationFrame(frame);
      else {
        slideAnimation = null;
        track.style.scrollSnapType = '';
      }
    }
    slideAnimation = requestAnimationFrame(frame);
  }
  track.addEventListener('scroll', sync, { passive: true });
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); go(current + (event.key === 'ArrowRight' ? 1 : -1)); }
  });
  addEventListener('resize', sync);
  sync();
})();
