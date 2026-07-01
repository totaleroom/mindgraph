# Contributing to MindGraph

Thanks for your interest in improving MindGraph! This guide covers everything you need to
get productive quickly.

## Code of Conduct

Be kind and constructive. Assume good intent, keep discussions focused on the work, and help
newcomers.

## Development setup

**Prerequisites:** Node.js 18+ (20/22 recommended) and npm.

```bash
git clone https://github.com/totaleroom/mindgraph.git
cd mindgraph
npm install
npm run dev        # http://localhost:3000
```

No API key or environment configuration is required to run the app.

## Project layout

See the [Project structure](README.md#-project-structure) section of the README and
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for how the pieces fit together. In short:

- `src/pages/` – top‑level screens (`Landing`, `Workspace`)
- `src/components/` – UI building blocks
- `src/hooks/` – stateful logic (thoughts, settings, routing, speech)
- `src/lib/` – pure logic (storage, connection engine, insights, Gemini client)

## Coding conventions

- **TypeScript everywhere.** Avoid `any`; prefer precise types from `src/types.ts`.
- **Keep logic out of components.** Pure, testable logic belongs in `src/lib/`; hooks wire it
  into React.
- **Local‑first & private.** Never introduce a hard dependency on a backend or send user data
  anywhere. AI stays opt‑in and Bring‑Your‑Own‑Key.
- **Match the design language.** Reuse the Tailwind theme tokens and the `hard-shadow-*` /
  `lift-interaction` utilities defined in `src/index.css`.
- Prefer small, focused components and clear names over cleverness.

## Before you open a PR

Run these locally and make sure they pass:

```bash
npm run lint     # tsc --noEmit (type checking)
npm run build    # production build must succeed
```

For any UI change, please also verify it manually in the browser (and offline via
`npm run build && npm run preview` if it could affect the PWA).

## Pull request process

1. Fork the repo and create a descriptive branch (e.g. `feat/export-thoughts`).
2. Make your change with clear, atomic commits.
3. Ensure `npm run lint` and `npm run build` pass.
4. Open a pull request against `main`, filling out the PR template. Include screenshots or a
   short clip for UI changes.
5. A maintainer will review. Please respond to feedback and keep the branch up to date.

## Reporting bugs & requesting features

Use the [issue templates](.github/ISSUE_TEMPLATE) — they prompt for the details we need to
help quickly.

Thank you for contributing! 💛
