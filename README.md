# CoinTech2u — Next.js

SEO-friendly Next.js (App Router + TypeScript) port of the original static React/Babel landing page.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
npm run start
```

## SEO

- Server-rendered content for every section (only timer, tabs, accordion, form, and scroll-listener nav are client components).
- `metadata` API in `app/layout.tsx` (title, description, OG, Twitter, canonical, robots).
- JSON-LD: `Organization`, `WebSite` (layout), `FAQPage` (page).
- `app/sitemap.ts` and `app/robots.ts`.
- `next/font` for Inter / Inter Tight / JetBrains Mono with `display: swap`.

Set `NEXT_PUBLIC_SITE_URL` to the production origin so the sitemap, canonical, and OG URLs resolve.
