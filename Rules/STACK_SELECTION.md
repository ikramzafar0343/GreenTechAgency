# Stack selection

**Owner:** Ikram Zafar  
**Updated:** 14 October 2026  
**Authority:** [BACKEND_DATABASE_PRODUCTION_RULES.md](./BACKEND_DATABASE_PRODUCTION_RULES.md)

Record chosen technologies here before installing infrastructure. Do not invent unlisted choices.

## Selected

| Decision | Choice | Notes |
| --- | --- | --- |
| Frontend | Next.js App Router (`Frontend/`) | Marketing storefront + **admin CMS UI** (`/admin`). Proxies `/api/auth/*` and `/api/backend/*` to the Backend. Explicit scope expansion beyond storefront-only: CMS forms live in Frontend; Backend owns all privileged writes. |
| Admin CMS content | Services, Subservices, Blog, Portfolio + section settings | Persisted in PostgreSQL via Backend public/admin APIs. Draft/publish with optimistic `version`. |
| **Backend runtime** | **Node.js** (`Backend/`) | Standalone Express 5 HTTP service. Owns DB access, Better Auth, and future API routes. |
| Backend HTTP framework | **Express 5** | Mounted with `better-auth/node` `toNodeHandler`. |
| Backend deployment mode | **Hostinger VPS** (production) | Local: `http://localhost:4000`. Prod: Node process on Hostinger VPS behind Nginx (`/api`, `/media`). See `Rules/HOSTINGER_VPS_DEPLOY.md`. |
| Media storage | **VPS disk** (`MEDIA_ROOT`) | Uploads via `POST /api/admin/media/upload`; served at `GET /media/*`. Public base: `MEDIA_PUBLIC_BASE_URL`. |
| Rate limits | **Process-local memory** (default) | `RATE_LIMIT_MODE=memory` for single VPS process. Optional `RATE_LIMIT_MODE=redis` + `RATE_LIMIT_REDIS_URL` for multi-process. |
| Database | **PostgreSQL 18** | Neon supplies the latest supported **minor** for major 18 (do not change major). |
| ORM / driver | **Drizzle ORM** + **`node-postgres` (`pg`)** + **Drizzle Kit** | Versions recorded in `Backend/package.json` and lockfile. |
| Frontend hosting | **Vercel** | Region: **`iad1`** (US East / N. Virginia). |
| Database hosting | **Neon** | Region: **`aws-us-east-1`** (same region as app functions when possible). |
| Authentication | **Better Auth** + Drizzle PostgreSQL adapter | Database-backed sessions; secure HttpOnly cookies; permissions enforced on every protected operation. **No public registration**. Frontend same-origin proxy preserves cookies on the site origin. |
| Application pool (per runtime instance) | `max: 5`, `min: 0`, connection timeout **5s**, idle timeout **10s** | Starting settings; reuse pool for process lifetime. Requires load validation. |
| Connection URLs | Pooled URL for app traffic; separate **direct** URL + migration credentials for migrations | Both server-side only on the Backend (`DATABASE_URL`, `DATABASE_URL_DIRECT`). |

## Package versions (Backend)

Recorded at install; **lockfile is authoritative** (stable only, no beta/RC/canary):

| Package | Version |
| --- | --- |
| `express` | 5.3.0 |
| `cors` | 2.8.6 |
| `drizzle-orm` | 0.45.4 |
| `drizzle-kit` | 0.31.11 |
| `pg` | 8.23.1 |
| `@types/pg` | 8.23.1 |
| `better-auth` | 1.7.7 |
| `@better-auth/drizzle-adapter` | 1.7.7 |
| `dotenv` | 17.4.2 |
| `tsx` (dev) | 4.23.15 |
| `vitest` (tests) | 3.2.4 |

## Connection and concurrency budget

- Instance pool **max 5** is **not** the global database connection limit.
- Global budget = Neon compute connection limit − reserved headroom (migrations, admin, monitoring, failover) − other workloads, divided across Backend process instances.
- **Production-release blockers until measured and recorded:**
  - Backend production host platform and max instance count
  - Neon project compute size and documented max connections
  - Calculated global pool ceiling and alert thresholds
  - Load-test evidence for p95/p99 against Section 13 gates in the backend rules

## Environment variables

### Backend (`Backend/.env.local`) — server-only

| Variable | Purpose |
| --- | --- |
| `PORT` | HTTP listen port (default `4000`) |
| `FRONTEND_ORIGIN` | Allowed CORS origin(s), comma-separated |
| `DATABASE_URL` | Pooled Postgres URL for application traffic |
| `DATABASE_URL_DIRECT` | Direct Postgres URL for Drizzle Kit migrations |
| `BETTER_AUTH_SECRET` | Auth signing/encryption secret |
| `BETTER_AUTH_URL` | Canonical **Frontend** origin for Better Auth (e.g. `http://localhost:3000`) |
| `MEDIA_ROOT` | Absolute path for VPS disk uploads (local: `./.data/media`) |
| `MEDIA_PUBLIC_BASE_URL` | Public base for media URLs (e.g. `http://localhost:4000/media` or `https://api.example.com/media`) |
| `RATE_LIMIT_MODE` | `memory` (default, single VPS process) or `redis` |
| `RATE_LIMIT_REDIS_URL` | Required only when `RATE_LIMIT_MODE=redis` |

### Frontend (`Frontend/.env.local`)

| Variable | Purpose |
| --- | --- |
| `BACKEND_URL` | Backend base URL for RSC reads and `/api/auth` + `/api/backend` proxies |

Optional public origin for browser clients only when required: `NEXT_PUBLIC_APP_URL` (never secrets).

## Implementation locations

| Concern | Path |
| --- | --- |
| Env validation + pool constants | `Backend/src/config/env.ts` |
| `pg` pool | `Backend/src/db/pool.ts` |
| Drizzle client | `Backend/src/db/client.ts` |
| Schema | `Backend/src/db/schema/` |
| Migrations | `Backend/database/migrations/` |
| Better Auth | `Backend/src/auth/auth.ts` |
| Session guards | `Backend/src/auth/requireSession.ts` |
| HTTP app + auth mount | `Backend/src/http/app.ts` |
| Process entry | `Backend/src/index.ts` |
| Create admin script | `Backend/src/scripts/create-admin.ts` |
| Content import | `Backend/src/scripts/import-site-content.ts` + `data/import/*` |
| Frontend auth / API proxies | `Frontend/src/app/api/auth/[...all]/route.ts`, `Frontend/src/app/api/backend/[...path]/route.ts` |
| Frontend Backend client | `Frontend/src/server/backend/` |
| Env templates | `Backend/.env.example`, `Frontend/.env.example` |

**Backend commands:** `npm run dev` · `npm run build` · `npm start` · `npm run db:migrate` · `npm run auth:create-admin` · `npm run content:import` · `npm test`

**Frontend commands:** `npm run dev` · `npm run build` · `npm start` · `npm run typecheck`

**Admin URLs:** `/admin/login`, `/admin/services`, `/admin/blog`, `/admin/portfolio`, `/admin/faqs`, `/admin/site-sections`, `/admin/contact` (enquiries)

**Migrations:** `0000_better_auth_core.sql`, `0001_lying_blade.sql` (CMS), `0002_brown_tattoo.sql` (FAQ/testimonials/stats/site/enquiries)

## Verification status

| Check | Status |
| --- | --- |
| Unit: env validation + pool settings | Run in `Backend/` (`npm test`) |
| Unit: migration SQL contains auth tables/FKs | Run in `Backend/` |
| Integration: live Postgres 18 + migrated tables | **Unverified** — requires credentials below |
| `drizzle-kit migrate` against Neon | **Unverified** — needs `DATABASE_URL_DIRECT` |
| Better Auth sign-in / session cookie E2E | **Unverified** — needs migrated DB + admin user + both processes |
| Backend production host + global connection budget | **Production-release blocker** — not yet chosen/measured |
| Section 13 load gates (p95/p99) | **Production-release blocker** — not yet run |

### Required variables (missing locally until you set them)

1. In `Backend/.env.local`: `DATABASE_URL`, `DATABASE_URL_DIRECT`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `FRONTEND_ORIGIN`
2. In `Frontend/.env.local`: `BACKEND_URL=http://localhost:4000`

Provision Neon as **PostgreSQL 18** in `aws-us-east-1`. Then from `Backend/`: `npm run db:migrate`, then `npm run auth:create-admin -- --email … --name … --password …`.

## Rules that apply

- Lowercase `snake_case` SQL identifiers mapped to camelCase in app contracts.
- Parameterized queries; DB constraints; bounded queries; reviewed migrations (expand-and-contract on live systems).
- PostgreSQL-labeled and Node.js-labeled sections in the backend production rules apply.
