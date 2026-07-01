# Deployment Guide

MindGraph compiles to a **fully static** site. Thanks to a relative asset base
(`base: './'` in `vite.config.ts`) and hash‑based routing, the same build runs from any
path — a root domain, a subfolder, or a GitHub Pages project site — with **no server
rewrites**.

## Build output

```bash
npm run build      # outputs to dist/
npm run preview    # serve dist/ locally to verify (default: http://localhost:4173)
```

`dist/` contains the app plus the PWA files (`manifest.webmanifest`, `sw.js`, Workbox
runtime, and icons). Deploy the **contents of `dist/`**.

> **HTTPS is required** for the service worker (install/offline) to activate. All the managed
> hosts below serve HTTPS automatically. `localhost` is also treated as a secure context.

---

## GitHub Pages (included workflow)

A ready‑to‑use workflow ships at [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).

1. Merge your changes to `main`.
2. Go to **Settings → Pages → Build and deployment** and set **Source: GitHub Actions**.
3. On every push to `main`, the workflow builds and publishes the site. The URL for a project
   site is `https://<user>.github.io/<repo>/` (e.g. `https://totaleroom.github.io/mindgraph/`).

Because the build uses a relative base, no `base` override is needed for the project subpath.

## Netlify

- **Build command:** `npm run build`
- **Publish directory:** `dist`

Or drag‑and‑drop the `dist/` folder into the Netlify UI.

## Vercel

- **Framework preset:** Vite
- **Build command:** `npm run build`
- **Output directory:** `dist`

## Cloudflare Pages

- **Build command:** `npm run build`
- **Build output directory:** `dist`

## Render (static site)

Create a **Static Site** and set:

- **Build command:** `npm run build`
- **Publish directory:** `dist`

## Any static host / self‑hosted

```bash
npm run build
# copy the contents of dist/ to your web root (nginx, Apache, S3+CloudFront, etc.)
```

No special routing rules are required because the app uses hash routing (`/#/app`). If you
prefer, you can still add an SPA fallback to `index.html`; it isn't necessary.

## Notes on updates

The service worker uses `registerType: 'autoUpdate'`, so returning visitors automatically
pick up the latest deploy on their next visit (a refresh may be needed to activate a freshly
downloaded version).
