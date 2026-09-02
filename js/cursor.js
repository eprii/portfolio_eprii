(() => {
  const key = "__efriCursor";
  window[key]?.disconnect();

  const cursor = document.getElementById("cursor");
  const label = cursor?.querySelector(".cursor-label");
  const fine = matchMedia("(pointer: fine)").matches && matchMedia("(hover: hover)").matches;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!cursor || !fine || reduced) {
    window[key] = { disconnect() {} };
    return;
  }

  cursor.hidden = false;
  document.body.classList.add("has-custom-cursor");

  const ac = new AbortController();
  const { signal } = ac;
  let x = 0;
  let y = 0;
  let tx = 0;
  let ty = 0;
  let raf = 0;

  const loop = () => {
    x += (tx - x) * 0.28;
    y += (ty - y) * 0.28;
    cursor.style.transform = `translate(${x}px, ${y}px)`;
    raf = requestAnimationFrame(loop);
  };

  const onMove = (event) => {
    tx = event.clientX;
    ty = event.clientY;
    cursor.classList.add("is-on");
    if (!raf) raf = requestAnimationFrame(loop);
  };

  const setMode = (mode) => {
    cursor.classList.remove("is-link", "is-view", "is-star");
    if (label) label.textContent = "";
    if (mode === "view") {
      cursor.classList.add("is-view");
      if (label) label.textContent = "VIEW";
    } else if (mode === "star") {
      cursor.classList.add("is-star");
      if (label) label.textContent = "✦";
    } else if (mode === "link") {
      cursor.classList.add("is-link");
    }
  };

  const modeFrom = (target) => {
    if (!(target instanceof Element)) return "";
    const tagged = target.closest("[data-cursor]");
    if (tagged) return tagged.getAttribute("data-cursor") || "";
    if (target.closest("a, button, [role='button']")) return "link";
    return "";
  };

  document.addEventListener("mousemove", onMove, { passive: true, signal });
  document.addEventListener("mouseover", (event) => setMode(modeFrom(event.target)), {
    passive: true,
    signal,
  });
  document.addEventListener("mouseleave", () => cursor.classList.remove("is-on"), { signal });

  window[key] = {
    disconnect() {
      ac.abort();
      cancelAnimationFrame(raf);
      document.body.classList.remove("has-custom-cursor");
    },
  };
})();
