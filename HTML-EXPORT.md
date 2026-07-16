# Exporting the site as plain HTML files

This site is a Next.js app configured for **static export** (`output: "export"`
in `next.config.ts`). Running the build turns the whole site into plain,
framework-free HTML/CSS/JS files that can be hosted on any static web host or
opened locally — no Node server required at runtime.

## Generate the HTML

```bash
npm run build
```

This produces the complete static site in the **`out/`** folder.

## What you get in `out/`

Every page becomes a real `.html` file:

| Page            | File                               |
| --------------- | ---------------------------------- |
| Home            | `out/index.html`                   |
| News            | `out/news/index.html`              |
| News article    | `out/news/article/index.html`      |
| Announcements   | `out/announcements/index.html`     |
| Announcement    | `out/announcements/article/index.html` |
| 404             | `out/404.html`                     |

Alongside the HTML:

- `out/_next/` — the CSS and JavaScript bundles (styling + interactivity:
  language switcher, nav, menus, accordions, etc.)
- `out/videos/`, `out/icons/`, `out/logos/`, `out/strengths/` — media assets

> The `out/` folder is git-ignored on purpose — it is a regenerable build
> artifact, and it duplicates the videos already tracked under `public/`.
> Regenerate it any time with `npm run build`.

## Preview the HTML locally

```bash
npx serve out -l 3000
# then open http://localhost:3000
```

(Opening `out/index.html` directly with `file://` mostly works, but a tiny
local server like `serve` avoids browser restrictions on some assets.)

## Host it anywhere

The `out/` folder is a complete static site. To deploy, upload its **contents**
to any static host:

- **Cloudflare Pages:** `npx wrangler pages deploy out --project-name=cointech2u-landing`
  (or `npm run deploy`)
- **Netlify / Vercel / S3 / GitHub Pages / any web server:** upload the `out/`
  folder contents to the site root.

## Portable copy

A zipped copy of a build is on the Desktop: `cointech2u-html-site.zip`. Unzip it
anywhere and it is the full HTML site. Regenerate a fresh zip with:

```bash
npm run build && (cd out && zip -rq ~/Desktop/cointech2u-html-site.zip .)
```
