// Big Counter — a big countdown timer for timing performances.
// Pure JS/CSS, no dependencies.

(function () {
  "use strict";

  const DEFAULT_SECONDS = 180; // 3 minutes
  const STORE_DURATION = "bigcounter.duration";
  const STORE_SOUND = "bigcounter.sound";

  const app = document.getElementById("app");
  const timeEl = document.getElementById("time");
  const startStopBtn = document.getElementById("startStop");
  const resetBtn = document.getElementById("reset");

  const settingsToggle = document.getElementById("settingsToggle");
  const settings = document.getElementById("settings");
  const settingsClose = document.getElementById("settingsClose");
  const presets = document.getElementById("presets");
  const customForm = document.getElementById("customForm");
  const customSeconds = document.getElementById("customSeconds");
  const soundToggle = document.getElementById("soundToggle");

  // Small localStorage helpers that tolerate private-mode / disabled storage.
  function storeGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }
  function storeSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      /* ignore */
    }
  }

  // Resolve the starting duration: URL param wins, then saved value, then default.
  function initialDuration() {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = parseFloat(params.get("seconds"));
    if (Number.isFinite(fromUrl) && fromUrl > 0) {
      return fromUrl;
    }
    const saved = parseFloat(storeGet(STORE_DURATION));
    if (Number.isFinite(saved) && saved > 0) {
      return saved;
    }
    return DEFAULT_SECONDS;
  }

  let resetTime = initialDuration();
  let remaining = resetTime; // seconds left on the clock
  let running = false;
  let lastTick = 0; // performance.now() timestamp of the previous frame
  let soundEnabled = storeGet(STORE_SOUND) === "on";

  soundToggle.checked = soundEnabled;

  // --- Sound (Web Audio, generated on the fly) ---

  let audioCtx = null;

  // Lazily create/resume the AudioContext. Must run from a user gesture.
  function ensureAudio() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) {
      return null;
    }
    if (!audioCtx) {
      audioCtx = new Ctx();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playEndSound() {
    const ctx = ensureAudio();
    if (!ctx) {
      return;
    }
    const start = ctx.currentTime;
    // Three short beeps.
    for (let i = 0; i < 3; i++) {
      const t = start + i * 0.25;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.01);
      gain.gain.linearRampToValueAtTime(0, t + 0.18);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    }
  }

  // --- Rendering ---

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function render() {
    const clamped = Math.max(0, remaining);
    const minutes = Math.floor(clamped / 60);
    const seconds = Math.floor(clamped % 60);
    const hundredths = Math.floor((clamped % 1) * 100);

    timeEl.textContent =
      pad(minutes) + ":" + pad(seconds) + ":" + pad(hundredths);

    app.classList.toggle("finished", clamped === 0);
    startStopBtn.classList.toggle("active", running);
  }

  function markActivePreset() {
    const buttons = presets.querySelectorAll(".preset");
    buttons.forEach(function (btn) {
      const secs = parseFloat(btn.getAttribute("data-seconds"));
      btn.classList.toggle("active", secs === resetTime);
    });
  }

  function frame(now) {
    if (running) {
      const delta = (now - lastTick) / 1000;
      remaining -= delta;
      if (remaining <= 0) {
        remaining = 0;
        running = false;
        if (soundEnabled) {
          playEndSound();
        }
      }
    }
    lastTick = now;
    render();
    requestAnimationFrame(frame);
  }

  // --- Duration control ---

  function setDuration(seconds) {
    if (!Number.isFinite(seconds) || seconds <= 0) {
      return;
    }
    resetTime = seconds;
    remaining = seconds;
    running = false;
    storeSet(STORE_DURATION, String(seconds));
    markActivePreset();
    render();
  }

  // --- Controls ---

  startStopBtn.addEventListener("click", function () {
    // Warm up audio while we have the user gesture, so the end beep can fire.
    if (soundEnabled) {
      ensureAudio();
    }
    // Nothing to start once the clock has run out.
    if (!running && remaining <= 0) {
      return;
    }
    running = !running;
    lastTick = performance.now();
    render();
  });

  resetBtn.addEventListener("click", function () {
    running = false;
    remaining = resetTime;
    render();
  });

  // --- Settings panel ---

  function openSettings() {
    customSeconds.value = "";
    markActivePreset();
    settings.hidden = false;
  }

  function closeSettings() {
    settings.hidden = true;
  }

  settingsToggle.addEventListener("click", openSettings);
  settingsClose.addEventListener("click", closeSettings);

  // Click on the dimmed backdrop (but not the panel) closes the panel.
  settings.addEventListener("click", function (event) {
    if (event.target === settings) {
      closeSettings();
    }
  });

  presets.addEventListener("click", function (event) {
    const btn = event.target.closest(".preset");
    if (!btn) {
      return;
    }
    setDuration(parseFloat(btn.getAttribute("data-seconds")));
  });

  customForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const value = parseFloat(customSeconds.value);
    if (Number.isFinite(value) && value > 0) {
      setDuration(value);
      customSeconds.value = "";
    }
  });

  soundToggle.addEventListener("change", function () {
    soundEnabled = soundToggle.checked;
    storeSet(STORE_SOUND, soundEnabled ? "on" : "off");
    if (soundEnabled) {
      ensureAudio();
    }
  });

  // --- Keyboard: Space = start/stop, R = reset. Ignore while typing. ---

  document.addEventListener("keydown", function (event) {
    const tag = event.target && event.target.tagName;
    if (tag === "INPUT" || tag === "BUTTON" || tag === "TEXTAREA") {
      return;
    }
    if (event.key === "Escape" && !settings.hidden) {
      closeSettings();
      return;
    }
    if (!settings.hidden) {
      return;
    }
    if (event.code === "Space") {
      event.preventDefault();
      startStopBtn.click();
    } else if (event.key === "r" || event.key === "R") {
      resetBtn.click();
    }
  });

  markActivePreset();
  render();
  requestAnimationFrame(frame);
})();
