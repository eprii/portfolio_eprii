(() => {
  const key = "__efriAnim";
  window[key]?.disconnect();

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nodes = [...document.querySelectorAll(".reveal")];

  if (reduced) {
    nodes.forEach((el) => el.classList.add("is-in"));
    window[key] = { disconnect() {} };
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  nodes.forEach((el) => {
    if (el.closest(".hero")) {
      requestAnimationFrame(() => el.classList.add("is-in"));
      return;
    }
    io.observe(el);
  });

  window[key] = {
    disconnect() {
      io.disconnect();
    },
  };
})();
