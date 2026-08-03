# big-counter

A big (countdown) counter for timing performances.

This is _just_ a countdown timer with big numbers that fill the screen. It's
now written in pure HTML/CSS/JavaScript — no libraries, no build step — and
published to GitHub Pages.

## Usage

The app has one URL parameter, `seconds`, which sets the length of time to
count down (default is 120).

e.g., `?seconds=180`

This is a very simple countdown timer:

- Click/tap the **start/stop** button (or press <kbd>Space</kbd>) to start or
  stop the timer.
- Press **reset** (or the <kbd>R</kbd> key) to go back to the total time.
- The background changes to red at the end of the time.

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
