(() => {
  const content = document.getElementById('direct-content');
  const articles = [...content.querySelectorAll('.direct-article')];
  const groups = [...document.querySelectorAll('.direct-group')];
  const links = [...document.querySelectorAll('.direct-subtopic')];
  const remembered = new Map();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  function resolve(hash) {
    let id;
    try { id = decodeURIComponent(hash.replace(/^#/, '')); } catch { return null; }
    const target = document.getElementById(id);
    const article = target?.closest('.direct-article');
    return article ? { target, article } : null;
  }

  function show(hash, { scroll = false, focus = false } = {}) {
    const resolved = resolve(hash) || { target: articles[0], article: articles[0] };
    const { target, article } = resolved;
    articles.forEach(item => { item.hidden = item !== article; });
    groups.forEach(group => {
      const active = group.dataset.group === article.dataset.group;
      group.open = active;
      group.classList.toggle('is-active', active);
    });
    links.forEach(link => {
      if (link.hash === '#' + article.id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    remembered.set(article.dataset.group, article.id);
    document.title = `${article.querySelector('h2').textContent} — LaunchMe Help Center`;
    if (focus) article.querySelector('h2').focus({ preventScroll: true });
    if (scroll) target.scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }

  function navigate(hash, options) {
    if (location.hash !== hash) history.pushState(null, '', hash);
    show(hash, options);
  }

  groups.forEach(group => {
    group.querySelector('summary').addEventListener('click', event => {
      event.preventDefault();
      if (group.open) { group.open = false; return; }
      const id = remembered.get(group.dataset.group) || group.querySelector('a').hash.slice(1);
      navigate('#' + id);
    });
  });

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href^="#"]');
    if (!link || !resolve(link.hash)) return;
    event.preventDefault();
    navigate(link.hash, { scroll: true, focus: true });
  });

  // Back/forward and shared links also select the correct topic and article.
  window.addEventListener('popstate', () => show(location.hash, { scroll: true }));
  window.addEventListener('hashchange', () => show(location.hash, { scroll: true }));
  show(location.hash);
  if (resolve(location.hash)) requestAnimationFrame(() => show(location.hash, { scroll: true }));
})();
