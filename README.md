# roan-cv-portfolio

My portfolio, live at **[roan-cv-portfolio.vercel.app](https://roan-cv-portfolio.vercel.app)**.

One page, hand-built: semantic HTML, CSS custom properties and vanilla JavaScript. No framework,
no build step, no dependencies. Open `index.html` from disk and it works.

## What is in it

- **A split layout.** The identity column stays still while the work column scrolls; a scroll-spy
  marks the section you are reading. On phones the column folds into a normal header.
- **A click-to-enter intro.** The portrait starts centred and moves into the rail with a FLIP
  transform. It skips itself for deep links, inside iframes and on short screens, and never traps
  anyone: Escape, a Skip button and a tap all release it.
- **A custom cursor.** A dot and a trailing ring, `requestAnimationFrame` plus linear interpolation,
  transforms only. Over a link the ring snaps to the link's box. It switches off on touch screens and
  on the first Tab press.
- **Two tuned themes.** Every text colour is measured against WCAG AA in both, on the page and on
  every surface it can sit on. The first visit opens dark.
- **`prefers-reduced-motion`** turns off every animation.
- **A second page**, [`landing-pages.html`](https://roan-cv-portfolio.vercel.app/landing-pages.html):
  Shopify landing pages I built, shown at phone width.

## Files

```
index.html           the portfolio
landing-pages.html   Shopify landing pages
styles.css           tokens, layout, both themes
script.js            theme, scroll-spy, reveals, intro, cursor
assets/              CV, portrait, project screenshots
```

## Run it

Open `index.html`, or `python -m http.server 8000` and visit `localhost:8000`.

## Contact

[roanuson.work@gmail.com](mailto:roanuson.work@gmail.com) ·
[LinkedIn](https://www.linkedin.com/in/roan-andrei-uson)
