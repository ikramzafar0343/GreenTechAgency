# GreenTech Agency — Storefront Frontend

Next.js App Router storefront for GreenTech Agency. This phase ships the **customer-facing layout** with approved static content. A separate backend, database, and admin CMS will be built later.

## Requirements

- Node.js compatible with the Next.js version in `package.json`
- npm (lockfile committed)

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

Feature-based layout under `src/` per `../Rules/NEXTJS_FRONTEND_PRODUCTION_RULES.md`:

- `src/app` — routes
- `src/features/*` — section UI, models, static content, server readers
- `src/shared` — shared UI and config
- `src/styles` — global styles

CMS-shaped TypeScript models live in each feature’s `model/`. Intended future API shapes are documented in `docs/FUTURE_API_CONTRACTS.md`. Live HTTP to a backend is **not** wired in this phase.

## Blockers (honest)

- Contact form validates input but **does not persist** enquiries until a backend endpoint exists.
