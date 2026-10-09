(() => {
  const boot = document.getElementById('boot');
  if (!boot || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Durasi dalam milidetik: loading 3 detik, lalu Ready 1,5 detik.
  const BOOT_DURATION = 2200;
  const READY_DURATION = 1000;
  const FADE_DURATION = 160;
  const MAX_WAIT = BOOT_DURATION + READY_DURATION + FADE_DURATION + 2000;
  const startedAt = performance.now();
  let readyTimer;
  let exitTimer;
  let fallback;

  const hide = () => {
    clearTimeout(readyTimer);
    clearTimeout(exitTimer);
    clearTimeout(fallback);
    boot.hidden = true;
    document.removeEventListener('DOMContentLoaded', scheduleReady);
    document.removeEventListener('focusin', hide);
    window.removeEventListener('pagehide', hide);
  };

  const leave = () => {
    boot.classList.add('is-leaving');
    exitTimer = setTimeout(hide, FADE_DURATION);
  };

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
})();
