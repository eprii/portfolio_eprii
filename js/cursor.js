(() => {
  const cursor = document.getElementById('cursor');
  const label = cursor.querySelector('.cursor-label');
  const fine = matchMedia('(pointer: fine) and (hover: hover)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let x = 0, y = 0, targetX = 0, targetY = 0;
  let frame = 0;
  let visible = false;

  function hide() {
    cancelAnimationFrame(frame);
    frame = 0;
    visible = false;
    cursor.hidden = true;
    cursor.classList.remove('is-on');
    document.body.classList.remove('has-custom-cursor');
  }
  function move() {
    x += (targetX - x) * .32;
    y += (targetY - y) * .32;
    cursor.style.transform = `translate(${x}px, ${y}px)`;
    frame = Math.abs(targetX - x) + Math.abs(targetY - y) > .3 ? requestAnimationFrame(move) : 0;
  }
  document.addEventListener('pointermove', event => {
    if (!fine.matches || reduced.matches || event.pointerType === 'touch') return;
    targetX = event.clientX; targetY = event.clientY;
    if (!visible) {
      x = targetX; y = targetY;
      visible = true;
      cursor.hidden = false;
      cursor.classList.add('is-on');
      document.body.classList.add('has-custom-cursor');
    }
    if (!frame) frame = requestAnimationFrame(move);
  }, { passive: true });
  document.addEventListener('pointerover', event => {
    const tagged = event.target.closest('[data-cursor]');
    const interactive = event.target.closest('a, button:not(:disabled)');
    const mode = interactive ? (tagged?.dataset.cursor || 'link') : '';
    cursor.classList.toggle('is-link', mode === 'link');
    cursor.classList.toggle('is-view', mode === 'view');
    cursor.classList.toggle('is-star', mode === 'star');
    label.textContent = mode === 'view' ? 'VIEW' : mode === 'star' ? '✦' : '';
  }, { passive: true });
  document.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
  document.addEventListener('keydown', event => { if (event.key === 'Tab') hide(); });
  fine.addEventListener('change', hide);
  reduced.addEventListener('change', hide);
})();
