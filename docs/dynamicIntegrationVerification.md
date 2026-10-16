# Dynamic integration verification log

**Date:** 14 October 2026  
**Environment:** Local Backend `:4000` + Frontend `:3000` + PostgreSQL (Backend `DATABASE_URL` set; values redacted).  
**Gate:** Do **not** mark the website fully dynamic. Many flows remain IMPLEMENTED–UNVERIFIED or PARTIAL.

## Environment checks

| Check | Result |
| --- | --- |
| `GET http://localhost:4000/health` | `{ ok: true, service: "greentech-backend" }` |
| `GET /api/services` | 16 published items |
| `GET /api/testimonials` | 18 published items |
| `GET /api/stats` | 0 published items (empty catalog; CMS UI now available) |
| `GET /api/site/about` | Published; `team` empty array |
| `GET /api/site/impact` | Published; 3 cards |
| Frontend `BACKEND_URL` | Present in Frontend `.env.local` (redacted) |

## Fixes implemented this pass

| Area | Change | Smoke evidence |
| --- | --- | --- |
| Footer service columns | `buildFooterLinkGroups` uses published catalog from `fetchPublishedServices` | Typecheck; code path wired |
| Service detail impact | `ServiceDetailPage` loads `getPublicImpact()` (no `IMPACT_CONTENT` override) | `GET /services/web-development` 200; impact copy present in HTML |
| About team | Renders `content.team` only; hides carousel when empty (no preview identities) | Code path; public about has empty team |
| About CMS tab | Site sections includes About document editor | Code path |
| Testimonials CMS | `/admin/testimonials` list+editor → `/api/admin/testimonials*` | Routes + forms added; admin round-trip **not** browser-verified this pass |
| Stats CMS | `/admin/stats` list+editor → `/api/admin/stats*` | Routes + forms added; admin round-trip **not** browser-verified this pass |
| Sitemap | Dynamic published services + blog (+ portfolio anchors) | `GET /sitemap.xml` 200; 16 `/services/...` URLs |
| Service editor fields | Principles, related slugs, lead/card media, story CTA fields | Form/save mapping expanded; field round-trip **not** fully verified |
| Subservice editor | `/admin/subservices/[id]` full field editor + panel Edit link | Code path; round-trip **not** browser-verified |
| Blog article body | Renders Backend rich blocks (not excerpt-as-body); removed static fallbacks | `tsc` passed after change |
| Portfolio anchors | Listing items expose `id={slug}` for `/portfolio#slug` sitemap links | No invented detail layout (listing-only design) |
| Nav menu race (prior) | `navigateFromMenu` pushes route before closing menus | Prior session |

## Commands run

```text
# Backend health / catalogs
Invoke-RestMethod http://localhost:4000/health
Invoke-RestMethod http://localhost:4000/api/services
Invoke-RestMethod http://localhost:4000/api/testimonials
Invoke-RestMethod http://localhost:4000/api/stats
Invoke-RestMethod http://localhost:4000/api/site/impact
Invoke-RestMethod http://localhost:4000/api/site/about

# Frontend smoke
Invoke-WebRequest http://localhost:3000/services/web-development
Invoke-WebRequest http://localhost:3000/sitemap.xml

# Types
cd Frontend && npx tsc -p tsconfig.json --noEmit
cd Backend && npx tsc -p tsconfig.json --noEmit
```

## Acceptance gate status (honest)

| Required test | Status |
| --- | --- |
| Field round trip (every mapped field) | **NOT DONE** — only code wiring + limited public smoke |
| Complete module lifecycle per CMS module | **NOT DONE** for new testimonials/stats UIs |
| Published draft isolation | **NOT DONE** this pass |
| Parent visibility (subservices) | **NOT DONE** this pass |
| New route after production build | **NOT DONE** this pass |
| Cross-surface update | **PARTIAL** — footer/impact/sitemap wired; unverified admin→public |
| Persistence across restart | **NOT DONE** this pass |
| Media/forms | Contact/API already present; media library UI still missing |
| Negative / freshness / production gates | **NOT DONE** |

## Remaining blockers / gaps (not fully verified)

1. Admin browser round-trips for testimonials, stats, about JSON, expanded service fields.
2. Portfolio still lacks public `/portfolio/[slug]` case-study route (API exists).
3. Services hub group taxonomy still uses layout seeds (`servicesHubGroupSeeds`).
4. Service photo pairs (`pairA`/`pairB`) still use design media sets (intentional design assets unless Backend fields are added).
5. Brands / mega-menu proof logos remain approved static marks (documented N/A).
6. Privacy/Terms still static templates.
7. Media library admin page missing (upload API exists).
8. Redirects admin UI missing.
9. Contact page chrome still static model (chips live).
10. Full production-mode new-slug proof after build not run.

**Conclusion:** Integration repairs are in progress. The site is **not** fully dynamic under the document’s completion gate.
