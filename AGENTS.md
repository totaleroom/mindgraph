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

- **Run (dev):** `npm run dev` serves on `http://localhost:3000` (bound to `0.0.0.0`, port
  is hard-coded via `--port=3000` in the script).
- **Lint / typecheck:** `npm run lint` (runs `tsc --noEmit`).
- **Build:** `npm run build` (outputs to `dist/`); preview a build with `npm run preview`.
- **Env:** No real secrets are required to run or test the current app. `vite.config.ts`
  wires `GEMINI_API_KEY` into `process.env.GEMINI_API_KEY`, but no source code reads it.
  `.env.local` is gitignored; copy `.env.example` to `.env.local` if you want to set it.
- **Gotcha:** Setting `DISABLE_HMR=true` disables Vite HMR (see `vite.config.ts`). Leave it
  unset for normal development so hot reload works.
