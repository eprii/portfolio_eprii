(() => {
  const key = "__efriNav";
  window[key]?.disconnect();

  const header = document.getElementById("site-header");
  const toggle = document.querySelector(".nav-toggle");
  const panel = document.getElementById("nav-panel");
  const progress = document.getElementById("scroll-progress");
  const backTop = document.getElementById("back-top");
  const links = [...document.querySelectorAll(".nav-list a, .nav-panel a")];
  const sections = [...document.querySelectorAll("main section[id]")];
  const ac = new AbortController();
  const { signal } = ac;
  const observers = [];

  const closePanel = () => {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    panel.classList.remove("is-open");
  };

  toggle?.addEventListener(
    "click",
    () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      panel?.classList.toggle("is-open", !open);
    },
    { signal }
  );

  panel?.addEventListener(
    "click",
    (event) => {
      if (event.target instanceof HTMLAnchorElement) closePanel();
    },
    { signal }
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") closePanel();
    },
    { signal }
  );

  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const ratio = max > 0 ? doc.scrollTop / max : 0;
    if (progress) progress.style.width = `${Math.min(1, Math.max(0, ratio)) * 100}%`;
    header?.classList.toggle("is-compact", window.scrollY > 24);
    backTop?.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.7);
  };

  window.addEventListener("scroll", onScroll, { passive: true, signal });
  onScroll();

  backTop?.addEventListener(
    "click",
    () => {
      window.scrollTo({
        top: 0,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    },
    { signal }
  );

  const spy = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible?.target?.id) return;
      links.forEach((link) => {
        const active = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-35% 0px -50% 0px", threshold: [0.1, 0.25, 0.5] }
  );

  sections.forEach((section) => spy.observe(section));
  observers.push(spy);

  window[key] = {
    disconnect() {
      ac.abort();
      observers.forEach((o) => o.disconnect());
    },
  };
})();
