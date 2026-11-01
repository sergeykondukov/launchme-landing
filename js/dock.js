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
  pickItems.flat().forEach(item => {
    item.addEventListener('pointerenter', () => {
      // Equal 4px expansion per edge, independent of the widget's aspect ratio.
      const width = item.offsetWidth;
      const height = item.offsetHeight;
      if (!width || !height) return;
      item.style.setProperty('--hover-scale-x', (width + 8) / width);
      item.style.setProperty('--hover-scale-y', (height + 8) / height);
    });
  });
  let frame;
  function renderRows() {
    frame = null;
    const rect = collage.getBoundingClientRect();
    const viewport = window.innerHeight;
    const progress = Math.max(0, Math.min(1, (viewport * .95 - rect.top) / (viewport * .65)));
    const remaining = motion.matches ? 0 : Math.pow(1 - progress, 2);
    const extraGap = Math.min(180, window.innerWidth * .14) * remaining;
    collage.classList.toggle('is-settled', motion.matches || progress === 1);
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

  const workspaceButtons = [...document.querySelectorAll('[data-workspace]')];
  const workspacePanels = [...document.querySelectorAll('[data-workspace-panel]')];
  const workspaceCaptions = [...document.querySelectorAll('[data-workspace-caption]')];
  const initialWorkspace = workspaceButtons.find(button => button.getAttribute('aria-pressed') === 'true');
  workspacePanels.forEach(panel => {
    const selected = initialWorkspace && panel.dataset.workspacePanel === initialWorkspace.dataset.workspace;
    panel.classList.toggle('is-active', Boolean(selected));
    panel.setAttribute('aria-hidden', String(!selected));
    panel.hidden = false;
  });
  workspaceButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selected = button.dataset.workspace;
      workspaceButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      workspacePanels.forEach(panel => {
        const active = panel.dataset.workspacePanel === selected;
        panel.classList.toggle('is-active', active);
        panel.setAttribute('aria-hidden', String(!active));
      });
      workspaceCaptions.forEach(caption => { caption.hidden = caption.dataset.workspaceCaption !== selected; });
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

(() => {
  const root = document.querySelector('.dock-workflow');
  if (!root) return;
  const buttons = [...root.querySelectorAll('[data-workflow-select]')];
  const items = [...root.querySelectorAll('[data-workflow-item]')];
  const scenes = [...root.querySelectorAll('[data-workflow-scene]')];
  let active = 0;
  const animations = new Map();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const itemList = root.querySelector('.dock-workflow__items');
  let lastTextWidth = -1;
  function prepareText() {
    const padding = parseFloat(getComputedStyle(itemList).getPropertyValue('--workflow-open-padding')) || 28;
    const width = Math.max(0, itemList.clientWidth - padding * 2);
    // Height changes during expansion must not trigger another round of layout writes.
    if (width === lastTextWidth) return;
    lastTextWidth = width;
    buttons.forEach(button => button.style.setProperty('--workflow-text-width', width + 'px'));
  }
  prepareText();
  if ('ResizeObserver' in window) new ResizeObserver(prepareText).observe(itemList);
  else window.addEventListener('resize', prepareText);
  function select(index) {
    if ((index + buttons.length) % buttons.length === active) return;
    function geometry(button) {
      const rect = button.getBoundingClientRect();
      // A 999px capsule is visually clamped to half its height. Animate that
      // actual radius instead of interpolating hundreds of invisible pixels.
      const radius = Math.min(parseFloat(getComputedStyle(button).borderTopLeftRadius) || 0, rect.width / 2, rect.height / 2);
      return { width: rect.width, height: rect.height, radius };
    }
    const before = buttons.map(geometry);
    animations.forEach(animation => animation.cancel());
    animations.clear();
    active = (index + buttons.length) % buttons.length;
    const key = buttons[active].dataset.workflowSelect;
    buttons.forEach((button, i) => button.setAttribute('aria-expanded', String(i === active)));
    items.forEach(item => {
      const selected = item.dataset.workflowItem === key;
      item.classList.toggle('is-active', selected);

    });
    scenes.forEach(scene => scene.classList.toggle('is-active', scene.dataset.workflowScene === key));
    prepareText();
    const targets = buttons.map(geometry);
    if (!reduce.matches) buttons.forEach((button, i) => {
      if (typeof button.animate !== 'function') return;
      const after = targets[i];
      if (Math.abs(before[i].width - after.width) < 1 && Math.abs(before[i].height - after.height) < 1) return;
      const animation = button.animate([
        { width: before[i].width + 'px', height: before[i].height + 'px', borderRadius: before[i].radius + 'px' },
        { width: after.width + 'px', height: after.height + 'px', borderRadius: after.radius + 'px' }
      ], { duration: 280, easing: 'cubic-bezier(.22,.61,.36,1)' });
      animations.set(button, animation);
      if (i === active) {
        const text = button.querySelector('.dock-workflow__text');
        const fade = text.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 200, fill: 'backwards', easing: 'ease-out'
        });
        animations.set(text, fade);
      }
    });
  }
  buttons.forEach((button, index) => button.addEventListener('click', () => select(index)));
})();

// One moving selection capsule, sized to the active label.
(() => {
  document.querySelectorAll('.dock-switch').forEach(root => {
    function updateCapsule() {
      const active = root.querySelector('button[aria-pressed="true"]');
      if (!active) return;
      root.style.setProperty('--capsule-x', active.offsetLeft + 'px');
      root.style.setProperty('--capsule-width', active.offsetWidth + 'px');
    }
    updateCapsule();
    root.classList.add('has-moving-capsule');
    requestAnimationFrame(() => root.classList.add('capsule-ready'));
    root.addEventListener('click', updateCapsule);
    if ('ResizeObserver' in window) new ResizeObserver(updateCapsule).observe(root);
    else window.addEventListener('resize', updateCapsule);
    if (document.fonts) document.fonts.ready.then(updateCapsule);
  });
})();
