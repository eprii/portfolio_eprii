(() => {
  const key = "__efriMain";
  window[key]?.disconnect();

  const ac = new AbortController();
  const { signal } = ac;
  const skeleton = document.getElementById("skeleton");
  let skeletonTimer = 0;

  const dismissSkeleton = () => {
    if (!skeleton || skeleton.classList.contains("is-done")) return;
    skeleton.classList.add("is-done");
    skeletonTimer = window.setTimeout(() => skeleton.remove(), 420);
  };

  if (document.readyState === "complete") dismissSkeleton();
  else window.addEventListener("load", dismissSkeleton, { once: true, signal });
  window.setTimeout(dismissSkeleton, 400);

  document.body.classList.add("is-ready");

  const cleanups = [];

  document.querySelectorAll("[data-viewer]").forEach((viewer) => {
    const slides = [...viewer.querySelectorAll(".viewer-stage img")];
    const indexEl = viewer.querySelector(".viewer-index");
    const prev = viewer.querySelector("[data-prev]");
    const next = viewer.querySelector("[data-next]");
    let i = 0;
    let startX = 0;

    const paint = () => {
      slides.forEach((img, n) => img.classList.toggle("is-active", n === i));
      if (indexEl) {
        indexEl.textContent = `${String(i + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
      }
    };

    const go = (dir) => {
      i = (i + dir + slides.length) % slides.length;
      paint();
    };

    prev?.addEventListener("click", () => go(-1), { signal });
    next?.addEventListener("click", () => go(1), { signal });
    viewer.addEventListener(
      "touchstart",
      (event) => {
        startX = event.changedTouches[0]?.clientX ?? 0;
      },
      { passive: true, signal }
    );
    viewer.addEventListener(
      "touchend",
      (event) => {
        const endX = event.changedTouches[0]?.clientX ?? startX;
        const delta = endX - startX;
        if (Math.abs(delta) > 40) go(delta < 0 ? 1 : -1);
      },
      { passive: true, signal }
    );
    viewer.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "ArrowLeft") go(-1);
        if (event.key === "ArrowRight") go(1);
      },
      { signal }
    );

    viewer.setAttribute("tabindex", "0");
    paint();
    cleanups.push(() => viewer.removeAttribute("tabindex"));
  });

  document.querySelectorAll(".skill-block").forEach((block) => {
    const btn = block.querySelector(".skill-toggle");
    btn?.addEventListener(
      "click",
      () => {
        const open = block.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(open));
      },
      { signal }
    );
  });

  window[key] = {
    disconnect() {
      ac.abort();
      window.clearTimeout(skeletonTimer);
      cleanups.forEach((fn) => fn());
    },
  };
})();
