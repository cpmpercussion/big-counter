# big-counter

A big (countdown) counter for timing performances.

This is _just_ a countdown timer with big numbers that fill the screen. It's
now written in pure HTML/CSS/JavaScript — no libraries, no build step — and
published to GitHub Pages.

## Usage

This is a very simple countdown timer (default is 3 minutes):

- Click/tap the **start/stop** button (or press <kbd>Space</kbd>) to start or
  stop the timer.
- Press **reset** (or the <kbd>R</kbd> key) to go back to the total time.
- The background changes to red at the end of the time.

### Settings

Tap the **⚙ gear** in the top corner to open settings:

- **Duration** — pick a preset (1, 2, 3, 5 or 10 minutes) or type a custom
  number of seconds.
- **Sound at end** — play a beep when the timer reaches zero (off by default).

Your chosen duration and sound preference are remembered in the browser.

The `seconds` URL parameter still sets the starting duration and takes
precedence on load, e.g. `?seconds=180`.

## Running locally

Because it's plain static files, just open `index.html` in a browser, or serve
the folder with any static file server, e.g.:

```sh
python3 -m http.server
```

## Deploying

The site is deployed to GitHub Pages by the workflow in
`.github/workflows/pages.yml` on every push to `main`. To enable it, set
**Settings → Pages → Build and deployment → Source** to **GitHub Actions**.
