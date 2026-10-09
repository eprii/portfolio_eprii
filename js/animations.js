(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('is-pending');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.04 });

  document.querySelectorAll('.reveal').forEach(element => {
    // Already-visible content stays visible, including when arriving through a deep link.
    if (element.getBoundingClientRect().top < innerHeight) return;
    element.classList.add('is-pending');
    observer.observe(element);
  });
  reduced.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    document.querySelectorAll('.is-pending').forEach(element => element.classList.remove('is-pending'));
  });
})();
