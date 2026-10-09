(() => {
  const header = document.getElementById('site-header');
  const toggle = document.querySelector('.nav-toggle');
  const panel = document.getElementById('nav-panel');
  const progress = document.getElementById('scroll-progress');
  const backTop = document.getElementById('back-top');
  const links = [...document.querySelectorAll('.nav-brand, .nav-list a, .nav-panel a')];
  const sections = [...document.querySelectorAll('main section[id]')];
  const mobile = matchMedia('(max-width: 980px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let scrollFrame = 0;
  let activeId = '';

  function closePanel(restoreFocus = false) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    panel.hidden = true;
    if (restoreFocus) toggle.focus();
  }

  function clearance() {
    return Math.ceil(header.getBoundingClientRect().bottom + 16);
  }

  function updateScroll() {
    scrollFrame = 0;
    if (document.body.classList.contains('has-open-lightbox')) return;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
    header.classList.toggle('is-compact', scrollY > 24);
    backTop.classList.toggle('is-visible', scrollY > innerHeight * 0.7);
    backTop.tabIndex = scrollY > innerHeight * 0.7 ? 0 : -1;
    const offset = clearance();
    let current = sections[0].id;
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= offset + 48) current = section.id;
    });
    if (max > 0 && scrollY >= max - 2) current = 'contact';
    if (current === activeId) return;
    activeId = current;
    links.forEach(link => {
      const active = link.hash === `#${current}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function queueScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }

  function targetFromHash(hash) {
    try { return document.getElementById(decodeURIComponent(hash.slice(1))); }
    catch { return null; }
  }

  function scrollToTarget(target, smooth = true, focus = false) {
    const top = target.id === 'hero' || target.id === 'main' ? 0 : target.getBoundingClientRect().top + scrollY - clearance();
    window.scrollTo({ top: Math.max(0, top), behavior: smooth && !reduced.matches ? 'smooth' : 'instant' });
    if (focus) {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  }

  function followHash() {
    const target = targetFromHash(location.hash);
    if (target) scrollToTarget(target, false);
    queueScroll();
  }

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    panel.hidden = !open;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) closePanel(true);
  });
  document.addEventListener('click', event => {
    if (!header.contains(event.target)) closePanel();
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const target = targetFromHash(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    closePanel();
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    scrollToTarget(target, true, true);
  });
  document.addEventListener('focusin', event => {
    if (!header.contains(event.target)) closePanel();
  });
  mobile.addEventListener('change', () => { closePanel(); queueScroll(); });
  backTop.addEventListener('click', () => {
    if (location.hash !== '#hero') history.pushState(null, '', '#hero');
    scrollToTarget(sections[0], true, true);
  });
  window.addEventListener('scroll', queueScroll, { passive: true });
  window.addEventListener('resize', queueScroll, { passive: true });
  window.addEventListener('hashchange', followHash);
  window.addEventListener('popstate', followHash);
  header.classList.add('nav-ready');
  closePanel();
  updateScroll();
  // Functions are initialized before resolving deep links; wait for final image/font layout.
  if (location.hash) {
    followHash();
    window.addEventListener('load', followHash, { once: true });
  }
})();
