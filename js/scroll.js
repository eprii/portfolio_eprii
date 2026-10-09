(() => {
  const ENABLED = true;
  const WHEEL_SPEED = .72;
  const EASE_MS = 85;
  const desktop = matchMedia('(min-width: 981px) and (hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!ENABLED) return;

  let frame = 0;
  let position = 0;
  let target = 0;
  let lastTime = 0;
  let direction = 0;

  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    direction = 0;
  }

  function animate(time) {
    if (Math.abs(scrollY - position) > 3 || document.body.classList.contains('has-open-lightbox')) {
      stop();
      return;
    }
    const step = 1 - Math.exp(-Math.min(time - lastTime, 50) / EASE_MS);
    lastTime = time;
    position += (target - position) * step;
    if (Math.abs(target - position) < .5) {
      window.scrollTo({ top: target, behavior: 'instant' });
      stop();
      return;
    }
    window.scrollTo({ top: position, behavior: 'instant' });
    frame = requestAnimationFrame(animate);
  }

  function insideScroller(node) {
    for (let element = node; element && element !== document.body; element = element.parentElement) {
      if (element.matches('dialog, .nav-panel, input, textarea, select, [contenteditable="true"]')) return true;
      if (element.scrollHeight > element.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(element).overflowY)) return true;
    }
    return false;
  }

  window.addEventListener('wheel', event => {
    if (!desktop.matches || reduced.matches || event.defaultPrevented || !event.cancelable || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    if (!event.deltaY || Math.abs(event.deltaX) >= Math.abs(event.deltaY) || document.body.classList.contains('has-open-lightbox') || insideScroller(event.target)) return;

    // Preserve pixel precision; normalize mouse wheels that report lines or pages.
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
    const delta = event.deltaY * unit * WHEEL_SPEED;
    const nextDirection = Math.sign(delta);
    const max = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    if (!frame || nextDirection !== direction) {
      position = scrollY;
      target = position;
      window.scrollTo({ top: position, behavior: 'instant' });
    }
    direction = nextDirection;
    const ahead = Math.min(innerHeight * .85, 700);
    target = Math.max(0, Math.min(max, Math.max(position - ahead, Math.min(position + ahead, target + delta))));
    event.preventDefault();
    if (!frame) {
      lastTime = performance.now();
      frame = requestAnimationFrame(animate);
    }
  }, { passive: false });

  // Give native navigation, the scrollbar, keyboard, touch and dialogs control immediately.
  ['pointerdown', 'touchstart', 'keydown', 'hashchange', 'popstate', 'resize', 'pagehide'].forEach(type => window.addEventListener(type, stop, { passive: true }));
  document.addEventListener('visibilitychange', stop);
  desktop.addEventListener('change', stop);
  reduced.addEventListener('change', stop);
})();
