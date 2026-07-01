# AGENTS.md

## Cursor Cloud specific instructions

This is a single-service **Vite + React 19 + TypeScript** app — the "MindGraph"
local-first knowledge-graph note tool. It is a fully client-side SPA: no backend server,
database, or auth (the `express` / `dotenv` deps are unused template scaffolding).
Standard commands live in `package.json` `scripts`.

### App architecture
- **Routing** is hash-based (`src/hooks/useHashRoute.ts`): `#/` = marketing landing
  (`src/pages/Landing.tsx`), `#/app` = the workspace (`src/pages/Workspace.tsx`).
  `src/App.tsx` is just the router.
- **Persistence** is `localStorage` only (`src/lib/storage.ts`, keys prefixed
  `mindgraph.`). First run seeds example thoughts; there is no server-side state.
- **Connections** between thoughts are computed offline via a keyword overlap
  coefficient in `src/lib/connections.ts` (no API key needed). The force-directed graph
  layout in `src/components/Graph.tsx` is deterministic (seeded per thought id).
- **AI is Bring-Your-Own-Key** (`src/lib/gemini.ts`, dynamically imported): users paste a
  Gemini API key in Settings; it is stored only in localStorage. Insights work without a
  key via a local heuristic (`src/lib/insights.ts`) — the Gemini path is optional.
  `GEMINI_API_KEY` from the env is NOT used by the app; keys are entered in the UI.
- Voice capture uses the Web Speech API (`src/hooks/useSpeech.ts`) and is only offered in
  browsers that support it (Chrome). The mic button is hidden otherwise.
- **Types note:** React 19 ships no bundled types, so `@types/react` /
  `@types/react-dom` are required dev deps for `npm run lint` (`tsc --noEmit`) to pass.

### PWA & deployment
- The app is an installable, offline-capable **PWA** via `vite-plugin-pwa` (config in
  `vite.config.ts`). The build emits `manifest.webmanifest` + a Workbox `sw.js`. Icons live
  in `public/` (generated from `public/icon.svg`; no build-time image tooling is needed
  since the PNGs are committed).
- The service worker only runs on a production build, **not** in `npm run dev`. To test PWA
  behavior (install prompt, offline), use `npm run build` then `npm run preview` and load
  the preview URL (default port 4173).
- **Gotcha when testing UI changes:** `registerType: 'autoUpdate'` means an old `preview`
  session's service worker will serve the **previously cached** build on first load, so your
  latest changes may not appear at `:4173`. Test iterative UI/code changes against the dev
  server (`npm run dev`, port 3000, no service worker), or hard-reload / clear site data on
  the preview to pick up a fresh build.
- The interactive graph (`src/components/Graph.tsx`) is touch-first: it uses pointer events
  for pan, pinch-zoom, wheel-zoom, and node dragging, with `touch-action: none` on the SVG.
  The `Workspace` shows a Graph/List segmented toggle below the `lg` breakpoint and both
  panels side-by-side at `lg`+. Animations use the `motion` package (`motion/react`).
- `vite.config.ts` uses `base: './'` (relative) so the static build works from any path —
  a root domain, a subfolder, or a GitHub Pages project site — with no server rewrites
  (routing is hash-based). Deploy `dist/` to any static host. A GitHub Pages workflow is
  provided at `.github/workflows/deploy.yml` (enable Pages → Source: GitHub Actions).

- **Run (dev):** `npm run dev` serves on `http://localhost:3000` (bound to `0.0.0.0`, port
  is hard-coded via `--port=3000` in the script).
- **Lint / typecheck:** `npm run lint` (runs `tsc --noEmit`).
- **Build:** `npm run build` (outputs to `dist/`); preview a build with `npm run preview`.
- **Env:** No real secrets are required to run or test the current app. `vite.config.ts`
  wires `GEMINI_API_KEY` into `process.env.GEMINI_API_KEY`, but no source code reads it.
  `.env.local` is gitignored; copy `.env.example` to `.env.local` if you want to set it.
- **Gotcha:** Setting `DISABLE_HMR=true` disables Vite HMR (see `vite.config.ts`). Leave it
  unset for normal development so hot reload works.
