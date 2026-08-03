// Big Counter — a big countdown timer for timing performances.
// Pure JS/CSS, no dependencies.

(function () {
  "use strict";

  const DEFAULT_SECONDS = 120;

  const app = document.getElementById("app");
  const timeEl = document.getElementById("time");
  const startStopBtn = document.getElementById("startStop");
  const resetBtn = document.getElementById("reset");

  // Read the optional `?seconds=` URL parameter.
  function getResetTime() {
    const params = new URLSearchParams(window.location.search);
    const raw = parseFloat(params.get("seconds"));
    if (Number.isFinite(raw) && raw > 0) {
      return raw;
    }
    return DEFAULT_SECONDS;
  }

  let resetTime = getResetTime();
  let remaining = resetTime; // seconds left on the clock
  let running = false;
  let lastTick = 0; // performance.now() timestamp of the previous frame

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

  function frame(now) {
    if (running) {
      const delta = (now - lastTick) / 1000;
      remaining -= delta;
      if (remaining <= 0) {
        remaining = 0;
        running = false;
      }
    }
    lastTick = now;
    render();
    requestAnimationFrame(frame);
  }

  startStopBtn.addEventListener("click", function () {
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

  // Spacebar toggles start/stop, "r" resets — handy for live performances.
  document.addEventListener("keydown", function (event) {
    if (event.target instanceof HTMLButtonElement) {
      return;
    }
    if (event.code === "Space") {
      event.preventDefault();
      startStopBtn.click();
    } else if (event.key === "r" || event.key === "R") {
      resetBtn.click();
    }
  });

  render();
  requestAnimationFrame(frame);
})();
