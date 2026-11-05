// Shared scroll animation for the Music page and home teaser.
(() => {
  const hero = document.querySelector('.music-intro__hero');
  if (!hero) return;
  const intro = hero.closest('.music-intro');
  const mobileMotion = matchMedia('(max-width: 767px)');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let lastProgress = null;
  let pending = false;

  function render() {
    pending = false;
    if (reduceMotion.matches) {
      hero.style.transform = '';
      hero.style.filter = '';
      hero.style.opacity = '';
      return;
    }
    // On home, start when the Music section reaches the top of the viewport.
    // Use the layout height so perspective never changes the scroll range.
    const scrolled = intro.classList.contains('music-home') ? -intro.getBoundingClientRect().top : window.scrollY;
    const progress = Math.min(1, Math.max(0, scrolled / Math.max(1, hero.offsetHeight * .9)));
    if (progress === lastProgress) return;
    lastProgress = progress;
    const eased = progress * progress * (3 - 2 * progress);
    hero.style.transform = `perspective(1200px) rotateX(${-(mobileMotion.matches ? 28 : 48) * eased}deg) scale(${1 - .08 * eased})`;
    hero.style.filter = mobileMotion.matches ? 'none' : `blur(${7 * eased}px)`;
    hero.style.opacity = String(1 - .3 * eased);
  }
  function requestRender() {
    if (!pending) { pending = true; requestAnimationFrame(render); }
  }
  function reset() {
    lastProgress = null;
    requestRender();
  }
  addEventListener('scroll', requestRender, { passive: true });
  addEventListener('resize', reset);
  hero.addEventListener('load', reset);
  reduceMotion.addEventListener('change', reset);
  mobileMotion.addEventListener('change', reset);
  render();
})();
