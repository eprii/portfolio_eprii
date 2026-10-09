(() => {
  const boot = document.getElementById('boot');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (!boot || reduced.matches) return;

  // Milidetik. Durasi loading dan Ready mengikuti ZIP terbaru.
  const BOOT_DURATION = 2200;
  const READY_DURATION = 1000;
  const ENTER_DURATION = 600;
  const FADE_DURATION = 650;
  const MAX_WAIT = BOOT_DURATION + READY_DURATION + FADE_DURATION + 2000;
  const startedAt = performance.now();
  let readyTimer;
  let exitTimer;
  let fallback;
  let contentAnimation;

  const hide = () => {
    clearTimeout(readyTimer);
    clearTimeout(exitTimer);
    clearTimeout(fallback);
    contentAnimation?.cancel();
    boot.hidden = true;
    document.removeEventListener('DOMContentLoaded', scheduleReady);
    document.removeEventListener('focusin', hide);
    window.removeEventListener('pagehide', hide);
    reduced.removeEventListener('change', hide);
    boot.removeEventListener('wheel', stopWheel);
  };

  const leave = () => {
    boot.classList.add('is-leaving');
    const visibleSection = [...document.querySelectorAll('main > section')].find(section => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= innerHeight / 2 && bounds.bottom > innerHeight / 2;
    });
    const content = visibleSection?.querySelector('.hero-inner, .wrap');
    if (content && !reduced.matches) {
      contentAnimation = content.animate([
        { opacity: .6, transform: 'translateY(8px) scale(.985)', filter: 'blur(3px)' },
        { opacity: 1, transform: 'none', filter: 'blur(0px)' }
      ], { duration: FADE_DURATION, easing: 'cubic-bezier(.22, 1, .36, 1)' });
    }
    exitTimer = setTimeout(hide, FADE_DURATION);
  };

  const stopWheel = event => { if (event.cancelable) event.preventDefault(); };

  const scheduleReady = () => {
    const remaining = Math.max(0, BOOT_DURATION - (performance.now() - startedAt));
    readyTimer = setTimeout(() => {
      boot.querySelector('#boot-status').textContent = 'Ready.';
      boot.classList.add('is-ready');
      exitTimer = setTimeout(leave, READY_DURATION);
    }, remaining);
  };

  boot.style.setProperty('--boot-failsafe-duration', `${MAX_WAIT}ms`);
  boot.style.setProperty('--boot-fade-duration', `${FADE_DURATION}ms`);
  boot.style.setProperty('--boot-enter-duration', `${ENTER_DURATION}ms`);
  boot.hidden = false;
  fallback = setTimeout(hide, MAX_WAIT);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleReady, { once: true });
  } else {
    scheduleReady();
  }
  window.addEventListener('pagehide', hide, { once: true });
  // Keyboard users can reach the page without focusing content behind the overlay.
  document.addEventListener('focusin', hide, { once: true });
  reduced.addEventListener('change', hide, { once: true });
  boot.addEventListener('wheel', stopWheel, { passive: false });
})();
