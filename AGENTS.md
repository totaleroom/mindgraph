# AGENTS.md

## Cursor Cloud specific instructions

This is a single-service **Vite + React 19 + TypeScript** static marketing landing page
(the "MindGraph" AI Studio app). There is no backend server, database, or auth despite
`express` / `@google/genai` / `dotenv` being listed as dependencies — they are unused
template scaffolding. Standard commands live in `package.json` `scripts`.

- **Run (dev):** `npm run dev` serves on `http://localhost:3000` (bound to `0.0.0.0`, port
  is hard-coded via `--port=3000` in the script).
- **Lint / typecheck:** `npm run lint` (runs `tsc --noEmit`).
- **Build:** `npm run build` (outputs to `dist/`); preview a build with `npm run preview`.
- **Env:** No real secrets are required to run or test the current app. `vite.config.ts`
  wires `GEMINI_API_KEY` into `process.env.GEMINI_API_KEY`, but no source code reads it.
  `.env.local` is gitignored; copy `.env.example` to `.env.local` if you want to set it.
- **Gotcha:** Setting `DISABLE_HMR=true` disables Vite HMR (see `vite.config.ts`). Leave it
  unset for normal development so hot reload works.
