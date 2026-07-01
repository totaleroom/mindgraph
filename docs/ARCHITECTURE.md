# Architecture

MindGraph is a client‑only React SPA. There is no backend, database, or authentication —
state lives entirely in the browser. This document explains how the pieces fit together.

## High‑level overview

```
                ┌─────────────────────────────────────────────┐
                │                  App.tsx                      │
                │            (hash router: #/, #/app)           │
                └───────────────┬───────────────┬──────────────┘
                                │               │
                     ┌──────────▼─────┐   ┌─────▼───────────────┐
                     │ pages/Landing  │   │  pages/Workspace     │
                     │  (marketing)   │   │  (the application)   │
                     └────────────────┘   └─────┬───────────────┘
                                                 │
        ┌───────────────┬────────────────┬──────┴───────┬─────────────────┐
        ▼               ▼                ▼              ▼                 ▼
  CaptureBar       ThoughtList         Graph        InsightsPanel     SettingsModal
        │               │                │              │                 │
        └──────── hooks: useThoughts / useSettings / useSpeech ──────────┘
                                     │
                     lib: storage · connections · insights · gemini
                                     │
                              localStorage
```

## Routing

`src/App.tsx` is a tiny router driven by [`useHashRoute`](../src/hooks/useHashRoute.ts). Hash
routing (`#/`, `#/app`) is deliberate: it needs no server configuration, which keeps
deployment to any static host trivial.

## State & persistence

- [`useThoughts`](../src/hooks/useThoughts.ts) owns the thoughts array and exposes
  `add / update / remove / clear`. It hydrates from and persists to `localStorage`.
- [`useSettings`](../src/hooks/useSettings.ts) owns the Gemini API key and model choice.
- [`src/lib/storage.ts`](../src/lib/storage.ts) centralizes `localStorage` access (keys are
  prefixed `mindgraph.`) and provides the first‑run seed data.

All persistence is synchronous and local; there is no network sync layer.

## The connection engine

[`src/lib/connections.ts`](../src/lib/connections.ts) turns free text into a graph:

1. **Tokenize** each thought into a set of lowercased keywords, dropping stop words and short
   tokens.
2. For every pair of thoughts, compute the **overlap coefficient**:
   `shared / min(|A|, |B|)`. This favors short thoughts that share a meaningful keyword
   (Jaccard tends to under‑connect short texts).
3. Emit a connection when the coefficient clears a threshold, recording the shared keywords
   and a normalized weight.

The engine is pure and deterministic, so results are reproducible and require no API key.

## Graph layout & rendering

[`src/components/Graph.tsx`](../src/components/Graph.tsx) runs a small force‑directed
simulation (repulsion between nodes, spring attraction along edges, gentle centering) for a
fixed number of iterations to reach a stable layout. Initial positions are seeded from each
thought's id, so layouts are stable across renders. The result is drawn as plain SVG — no
canvas or heavyweight graph library. Node size encodes degree; selecting a node dims
unrelated nodes and thickens its edges.

## Insights

[`src/lib/insights.ts`](../src/lib/insights.ts) produces the *Weekly Synthesis*:

- **`localSynthesis`** — a deterministic, offline report (topic frequency, type mix,
  connection count, the most‑connected hub, and a worry nudge).
- **`buildSynthesisPrompt`** — assembles a prompt for the optional AI path.

## Optional AI (Bring Your Own Key)

[`src/lib/gemini.ts`](../src/lib/gemini.ts) wraps `@google/genai`. It is **dynamically
imported** only when the user requests an AI synthesis, so:

- the SDK is code‑split out of the main bundle (faster first load),
- any browser incompatibility can't break app startup or offline use,
- users who never use AI never download it eagerly.

The API key is read from settings (localStorage) and used solely to call Google's API.

## PWA layer

`vite-plugin-pwa` (configured in [`vite.config.ts`](../vite.config.ts)) generates the web app
manifest and a Workbox service worker that precaches the app shell for offline use. Icons are
generated from [`public/icon.svg`](../public/icon.svg) and committed as PNGs, so no image
tooling is needed at build time. `registerType: 'autoUpdate'` keeps installed copies current.

## Design system

Design tokens (colors, fonts) and the signature `hard-shadow-*` / `lift-interaction`
utilities live in [`src/index.css`](../src/index.css) via Tailwind v4's `@theme` and
`@utility`. Components consume these tokens rather than hard‑coding values.

## Why no backend?

The product thesis is *local‑first and private by default*. Keeping everything client‑side
means zero infrastructure, instant deploys to static hosting, no data‑handling liability, and
an app that keeps working offline. The trade‑off — no multi‑device sync out of the box — is a
deliberate one (see the roadmap for an encrypted‑sync direction).
