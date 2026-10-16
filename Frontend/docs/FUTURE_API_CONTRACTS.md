# Backend API contracts (implemented)

Base URL: server-only `BACKEND_URL` (default `http://localhost:4000`). Prefix: `/api`.

The storefront and admin call these routes on the **Node.js Backend**. Do not treat static `model/` files as runtime fallbacks after import.

## Health / auth

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/health` | `{ ok: true, service }` |
| `ALL` | `/api/auth/*` | Better Auth (proxied from Frontend `/api/auth/*`) |

## Public content

| Method | Path |
| --- | --- |
| `GET` | `/api/services`, `/api/services/:slug` |
| `GET` | `/api/services/:serviceSlug/subservices[/:slug]` |
| `GET` | `/api/blog`, `/api/blog/:slug` |
| `GET` | `/api/portfolio`, `/api/portfolio/:slug` |
| `GET` | `/api/sections/:key` (`services` \| `blog` \| `portfolio` \| `faq` \| `testimonials` \| `stats`) |
| `GET` | `/api/faq`, `/api/testimonials`, `/api/stats` |
| `GET` | `/api/site/:key` (`footer` \| `about`) |
| `GET` | `/api/redirects?path=` |
| `POST` | `/api/contact` |

## Admin (Better Auth `role=admin` + CSRF)

| Method | Path |
| --- | --- |
| `GET` | `/api/admin/me` |
| `*` | `/api/admin/services`, `/subservices`, `/blog`, `/portfolio`, `/faq`, `/testimonials`, `/stats` |
| `*` | `/api/admin/sections/:key`, `/api/admin/site/:key`, `/api/admin/media`, `/api/admin/enquiries` |

Publish / unpublish / archive / reorder use non-GET methods under the resource routers.
