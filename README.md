# Ben 10 — Omnitrix Experience

An interactive, scroll-driven fan site about Ben 10's Omnitrix. Scroll to activate the watch, watch it open like it does in the show, then turn the dial through the ten original aliens.

## What it does

- **Scroll intro** — Ben stands beside the title; one scroll flashes to a close-up of the Omnitrix.
- **The Omnitrix opens** — the hourglass face slides into a cross, a green diamond grows out of the middle and lights up with the alien's DNA silhouette. The face is a single SVG shape driven by scroll position, so it plays backwards just as smoothly.
- **One alien per dial click** — on desktop the showcase locks in place; each wheel or swipe turns the dial exactly one alien, with a transformation flash, a click of the bezel and a new silhouette. Trackpad momentum is absorbed so one flick never skips an alien.
- **Alien profiles** — artwork, species, home planet, quote, powers and animated stat bars for all ten.
- **Dial Wheel** — a pop-up selector to jump straight to any alien.
- **Extras** — themed canvas particle effects per alien, synthesized sound effects (no audio files), and a normal-scrolling layout on phones.

## Built with

- HTML, CSS and vanilla JavaScript (ES modules, no build step)
- [GSAP](https://gsap.com/) with ScrollTrigger, ScrollToPlugin and Observer
- SVG for the Omnitrix, Canvas 2D for particles, Web Audio API for sound

## Run locally

Any static file server works. From the project folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. (Opening `index.html` directly from disk won't work, because the scripts are ES modules.)

## Project structure

```
index.html      page structure and the SVG Omnitrix
style.css       layout, theme and responsive rules
main.js         scroll timeline, dial animation, alien navigation
aliensData.js   the ten aliens' details and stats
particles.js    canvas particle engine
audio.js        synthesized sound effects
assets/         alien artwork and the intro frame
```

## Disclaimer

Non-commercial fan project made for a portfolio. Ben 10 and all related characters and artwork are owned by Cartoon Network. The alien character renders are official artwork sourced from the [Ben 10 Wiki](https://ben10.fandom.com/).
