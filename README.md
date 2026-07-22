# CoinTech2u — Static HTML Version

This folder is a **complete, independent static website** — the exact HTML/CSS/JS
export of the Next.js project in the parent directory.

- **Source of truth:** the Next.js app (`../app`, `../public`). This folder is
  generated from it and should not be edited by hand — regenerate instead.
- **Visual fidelity:** identical to the Next.js site. Same stylesheets
  (gradients, glassmorphism, glow, blur, layered backgrounds) and same
  JavaScript (nav scroll behavior, scroll reveals, language switcher,
  particle/canvas effects).

## Pages

| Page          | File                              |
| ------------- | --------------------------------- |
| Home          | `index.html`                      |
| News          | `news/index.html`                 |
| News article  | `news/article/index.html`         |
| Announcements | `announcements/index.html`        |
| Announcement  | `announcements/article/index.html`|
| 404           | `404.html`                        |

Assets: `_next/` (CSS + JS bundles), `videos/`, `icons/`, `logos/`, `strengths/`.

## Run it locally

```bash
npx serve . -l 3001
# open http://localhost:3001
```

(Any static file server works. Avoid opening index.html via file:// — asset
paths are root-relative and need a server.)

## Host it

Upload this folder's contents to any static host (Cloudflare Pages, Netlify,
S3, GitHub Pages, any web server). No Node.js needed at runtime.

## Regenerate after changing the Next.js app

```bash
cd ..
npm run build            # stop `npm run dev` first
rm -rf html-version && mkdir html-version && cp -R out/. html-version/
```
