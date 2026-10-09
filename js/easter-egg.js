(() => {
  // Keep the existing audio asset; playback only follows an explicit click.
  const key = "__efriEgg";
  window[key]?.disconnect();

  const trigger = document.querySelector("[data-egg]");
  if (!trigger) {
    window[key] = { disconnect() {} };
    return;
  }

  
  const AUDIO_SRC = "assets/audio/over_the_rainbow.mp3";
  const DURATION = 13000;
  const ac = new AbortController();
  let timer = 0;
  let audio = null;

  const fallbackChime = () => {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0.08;
    master.connect(ctx.destination);
    [392, 493.88, 587.33].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = now + i * 0.28;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.9, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.6);
      osc.connect(gain);
      gain.connect(master);
      osc.start(start);
      osc.stop(start + 1.7);
    });
    setTimeout(() => ctx.close(), 2400);
  };

  const play = async () => {
    try {
      if (!audio) audio = new Audio(AUDIO_SRC);
      audio.currentTime = 0;
      await audio.play();
    } catch {
      fallbackChime();
    }
  };

  trigger.addEventListener(
    "click",
    () => {
      if (document.body.classList.contains("egg-active")) {
        window.clearTimeout(timer);
        document.body.classList.remove("egg-active");
        trigger.setAttribute("aria-pressed", "false");
        trigger.setAttribute("aria-label", "Play a small musical surprise");
        if (audio) { audio.pause(); audio.currentTime = 0; }
        return;
      }
      trigger.setAttribute("aria-pressed", "true");
      trigger.setAttribute("aria-label", "Stop the musical surprise");
      document.body.classList.add("egg-active");
      play();
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        document.body.classList.remove("egg-active");
        trigger.setAttribute("aria-pressed", "false");
        trigger.setAttribute("aria-label", "Play a small musical surprise");
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      }, DURATION);
    },
    { signal: ac.signal }
  );

  window[key] = {
    disconnect() {
      ac.abort();
      window.clearTimeout(timer);
      document.body.classList.remove("egg-active");
    },
  };
})();
