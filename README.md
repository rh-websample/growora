# growora — websites that work as hard as you do.

A premium, highly-animated SaaS-style marketing site for **growora**, a web design subscription company. Built with plain HTML, CSS and JavaScript — no build step, no dependencies to install. Push it to a repo and it's ready for GitHub Pages, Netlify, or Vercel.

**Pages**
- `index.html` — Home (hero, why growora, how it works, features, portfolio, testimonials, FAQ, CTA)
- `subscription.html` — Subscription (comparison, what's included, how requests work, pricing, FAQ, CTA)

## Stack

- Semantic HTML5
- CSS3 (custom properties / design tokens, no framework)
- Vanilla JavaScript (`assets/js/main.js`) — scroll reveals, magnetic buttons, animated counters, timeline progress, FAQ accordion, dark mode, mobile nav
- [Lucide Icons](https://lucide.dev) via CDN
- [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts

No bundler, no `node_modules`, no build pipeline — open `index.html` directly in a browser or serve the folder as-is.

## Local preview

```bash
# any static server works, e.g.
npx serve .
# or
python3 -m http.server 5500
```

Then open `http://localhost:5500`.

## Deploy to GitHub Pages

1. Push this folder to a new GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Save — your site will be live at `https://<username>.github.io/<repo>/`.

## Deploy to Vercel / Netlify

Drag-and-drop the folder (or connect the repo) — no build command needed, output directory is the project root.

## Project structure

```
growora/
├── index.html            # Home page
├── subscription.html     # Subscription page
├── assets/
│   ├── css/style.css      # Design tokens + all component styles
│   ├── js/main.js         # All interactivity
│   └── img/logo.png       # Brand mark
└── README.md
```

## Customizing

- **Colors & tokens** — edit the `:root` block at the top of `assets/css/style.css`. Dark mode overrides live in `html.dark`.
- **Copy** — all text lives directly in the HTML files; no CMS or data layer.
- **Pricing** — the single plan card is in `subscription.html` under `#pricing`.
- **Icons** — swap any `data-lucide="name"` attribute for another icon from the [Lucide icon set](https://lucide.dev/icons).

## Notes

- Respects `prefers-reduced-motion`.
- Dark mode toggle persists via `localStorage` and respects system preference on first visit.
- All animation is CSS + small vanilla JS (`IntersectionObserver`, `requestAnimationFrame`) — nothing to install.

---

© 2026 growora.
