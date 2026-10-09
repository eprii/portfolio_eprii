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
  const pill = header.querySelector('.nav-pill');
  const currentName = header.querySelector('.nav-current-name');
  const currentIndex = header.querySelector('.nav-current-index');
  let scrollFrame = 0;
  let activeId = '';
  let destination = '';
  let destinationTimer;
  let panelAnimation;
  let labelAnimation;

  function positionIndicators() {
    [pill, panel].forEach(surface => {
      const indicator = surface.querySelector('.nav-indicator');
      const active = surface.querySelector('a.is-active');
      if (!active || !surface.offsetWidth || !active.offsetWidth) {
        indicator.classList.remove('is-positioned');
        surface.classList.remove('has-indicator');
        return;
      }
      indicator.style.setProperty('--indicator-x', `${active.offsetLeft}px`);
      indicator.style.setProperty('--indicator-y', `${active.offsetTop}px`);
      indicator.style.setProperty('--indicator-width', `${active.offsetWidth}px`);
      indicator.style.setProperty('--indicator-height', `${active.offsetHeight}px`);
      indicator.classList.add('is-positioned');
      surface.classList.add('has-indicator');
    });
  }

  function setActive(id) {
    if (id === activeId) return;
    activeId = id;
    links.forEach(link => {
      const active = link.hash === `#${id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const index = sections.findIndex(section => section.id === id);
    currentIndex.textContent = String(index + 1).padStart(2, '0');
    currentName.textContent = id === 'hero' ? 'Home' : header.querySelector(`.nav-list a[href="#${id}"]`).textContent;
    if (mobile.matches && !reduced.matches) {
      labelAnimation?.cancel();
      labelAnimation = currentName.animate([{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'ease-out' });
    }
    positionIndicators();
  }

  function closePanel(restoreFocus = false, immediate = false) {
    if (toggle.getAttribute('aria-expanded') !== 'true' && !immediate) return;
    panelAnimation?.cancel();
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    panel.inert = true;
    if (restoreFocus) toggle.focus();
    if (immediate || reduced.matches || panel.hidden) {
      panel.hidden = true;
      return;
    }
    panelAnimation = panel.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-8px) scale(.98)' }], { duration: 160, easing: 'ease-in' });
    panelAnimation.onfinish = () => { panel.hidden = true; };
  }

  function openPanel() {
    panelAnimation?.cancel();
    panel.hidden = false;
    panel.inert = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    positionIndicators();
    if (!reduced.matches) {
      panelAnimation = panel.animate([{ opacity: 0, transform: 'translateY(-8px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 240, easing: 'cubic-bezier(.22, 1, .36, 1)' });
    }
  }

  function releaseDestination() {
    clearTimeout(destinationTimer);
    destination = '';
    queueScroll();
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
    if (current === destination) releaseDestination();
    setActive(destination || current);
  }

  function queueScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }

  function targetFromHash(hash) {
    try { return document.getElementById(decodeURIComponent(hash.slice(1))); }
    catch { return null; }
  }

  function scrollToTarget(target, smooth = true, focus = false) {
    releaseDestination();
    if (smooth && !reduced.matches) {
      destination = target.closest('section')?.id || 'hero';
      setActive(destination);
      // Keep the selected tab steady while the browser passes intermediate sections.
      destinationTimer = setTimeout(releaseDestination, 1400);
    }
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
    if (toggle.getAttribute('aria-expanded') === 'true') closePanel();
    else openPanel();
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
  mobile.addEventListener('change', () => { closePanel(false, true); positionIndicators(); queueScroll(); });
  reduced.addEventListener('change', () => { closePanel(false, true); labelAnimation?.cancel(); releaseDestination(); });
  backTop.addEventListener('click', () => {
    if (location.hash !== '#hero') history.pushState(null, '', '#hero');
    scrollToTarget(sections[0], true, true);
  });
  window.addEventListener('scroll', queueScroll, { passive: true });
  window.addEventListener('resize', () => { positionIndicators(); queueScroll(); }, { passive: true });
  window.addEventListener('wheel', releaseDestination, { passive: true });
  window.addEventListener('touchstart', releaseDestination, { passive: true });
  window.addEventListener('keydown', releaseDestination);
  window.addEventListener('scrollend', releaseDestination);
  window.addEventListener('hashchange', followHash);
  window.addEventListener('popstate', followHash);
  header.classList.add('nav-ready');
  panel.querySelectorAll('a').forEach(link => {
    link.dataset.sectionIndex = String(sections.findIndex(section => `#${section.id}` === link.hash) + 1).padStart(2, '0');
  });
  closePanel(false, true);
  updateScroll();
  if ('ResizeObserver' in window) new ResizeObserver(positionIndicators).observe(pill);
  document.fonts.ready.then(positionIndicators);
  // Functions are initialized before resolving deep links; wait for final image/font layout.
  if (location.hash) {
    followHash();
    window.addEventListener('load', followHash, { once: true });
  }
})();
