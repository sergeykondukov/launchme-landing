(() => {
  const groups = [...document.querySelectorAll('.direct-group')];

  // Native details and ordinary links keep all navigation usable without JS.
  groups.forEach(group => {
    group.addEventListener('toggle', () => {
      if (group.open) groups.forEach(other => {
        if (other !== group) other.open = false;
      });
    });
  });

  // Preserve links shared before articles received their own URLs.
  // Only the Help Center overview ever used these fragment-based routes.
  if (/^\/help\/direct\/(?:index\.html)?$/.test(location.pathname)) {
    async function followLegacyLink() {
      let id;
      try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
      if (!id.includes('--')) return;
      try {
        const response = await fetch('/help/direct/legacy-links.json');
        if (!response.ok) return;
        const routes = await response.json();
        const url = Object.hasOwn(routes, id) ? routes[id] : null;
        if (typeof url === 'string' && url.startsWith('/help/direct/')) location.replace(url);
      } catch { /* The overview and its article links remain available. */ }
    }
    window.addEventListener('hashchange', followLegacyLink);
    followLegacyLink();
  }
})();
