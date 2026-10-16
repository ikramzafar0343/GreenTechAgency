# Dynamic integration audit

**Stack (recorded):** Next.js App Router (`Frontend/`) + Express 5 Backend (`Backend/`) + PostgreSQL via Drizzle + Better Auth. Media: VPS `MEDIA_ROOT`. Admin CMS UI in Frontend; all writes on Backend.

**Environment (local, 14 Oct 2026):** Backend `/health` OK; `GET /api/services` returns 16 published items. Env keys present: `PORT`, `FRONTEND_ORIGIN`, `DATABASE_URL`, `BETTER_AUTH_URL` (values redacted).

**Status key:** `NOT AUDITED` · `BROKEN` · `IMPLEMENTED–UNVERIFIED` · `VERIFIED` · `BLOCKED` · `N/A` (design constant)

| Surface | Content field | Admin control | Write path | Persistence | Read path | Render path | Freshness | Evidence/status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` hero | headline, body, CTAs, media | `/admin/site-sections` Hero | `PATCH/POST /api/admin/site/hero` | `site_document.hero` | `GET /api/site/hero` | `HeroSection` | dynamic RSC | IMPLEMENTED–UNVERIFIED |
| `/` brands | logo rows | — | — | static assets | — | `BrandFamilySection` ← `BRAND_ROWS` | n/a | N/A — brand assets treated as design/approved static marks pending dedicated CMS (not silently business copy) |
| `/` services strip | hub + cards | site-sections Services; `/admin/services` | sections + services admin | `section_setting` + `service` | `/api/sections/services` + `/api/services` | `ServicesSection` | dynamic | IMPLEMENTED–UNVERIFIED |
| `/` why choose | intro, cards, media | site-sections Why choose | `/api/admin/site/why_choose` | `site_document.why_choose` | `/api/site/why_choose` | `WhyChooseUsSection` | dynamic | IMPLEMENTED–UNVERIFIED |
| `/` portfolio strip | hub + projects | site-sections Portfolio; `/admin/portfolio` | sections + portfolio | `section_setting` + `portfolio_project` | sections + `/api/portfolio` | `PortfolioSection` | dynamic | IMPLEMENTED–UNVERIFIED |
| `/` how we work | intro + stages | site-sections How we work | `/api/admin/site/how_we_work` | `site_document.how_we_work` | `/api/site/how_we_work` | `HowWeWorkSection` | dynamic | IMPLEMENTED–UNVERIFIED |
| `/` stats | hub + metrics | site-sections Stats hub; `/admin/stats` | sections + `/api/admin/stats*` | `section_setting` + `stat_metric` | `/api/sections/stats` + `/api/stats` | `StatsSection` | dynamic | IMPLEMENTED–UNVERIFIED |
| `/` testimonials | hub + items | site-sections hub; `/admin/testimonials` | sections + `/api/admin/testimonials*` | `section_setting` + `testimonial` | sections + `/api/testimonials` | `TestimonialsSection` | dynamic | IMPLEMENTED–UNVERIFIED |
| `/` FAQ | hub + Q&A | site-sections FAQ; `/admin/faqs` | sections + `/api/admin/faq*` | `section_setting` + `faq_item` | sections + `/api/faq` | `FaqSection` | dynamic | IMPLEMENTED–UNVERIFIED |
| `/` insights strip | hub + posts | site-sections Blog; `/admin/blog` | sections + blog | `section_setting` + `blog_post` | sections + `/api/blog` | `InsightsSection` | dynamic | IMPLEMENTED–UNVERIFIED |
| Closing CTA | copy/media | site-sections Closing CTA | `/api/admin/site/cta` | `site_document.cta` | `/api/site/cta` | `AstronautCtaSection` | dynamic | IMPLEMENTED–UNVERIFIED |
| Impact block | eyebrow/heading/cards | site-sections Impact | `/api/admin/site/impact` | `site_document.impact` | `/api/site/impact` | `ServiceDetailPage` ← `getPublicImpact` | dynamic | IMPLEMENTED–UNVERIFIED (static override removed) |
| Header nav labels | About/Services/Insights/Contact | — | — | — | — | `NAV_LINKS` | n/a | N/A — chrome IA labels (destinations fixed site routes) |
| Mega menu services | titles/hrefs | `/admin/services` (publish) | services admin | `service` | `/api/services` | `getMegaMenuPanels` | dynamic | IMPLEMENTED–UNVERIFIED |
| Mega menu logos | proof logos | — | — | static | — | `BRAND_ROWS` | n/a | N/A — same brand marks as homepage |
| Footer settings | contact/social/legal | site-sections Footer | `/api/admin/site/footer` | `site_document.footer` | `/api/site/footer` | `SiteFooter` | dynamic | IMPLEMENTED–UNVERIFIED |
| Footer service columns | service links | services publish | — | `service` | `/api/services` | `buildFooterLinkGroups(catalog)` | dynamic | IMPLEMENTED–UNVERIFIED |
| `/about` page body | seo/hero/manifesto/… | site-sections About tab | `/api/admin/site/about` | `site_document.about` | `/api/site/about` | `AboutPage` | dynamic | IMPLEMENTED–UNVERIFIED |
| `/about` team | team members | About doc `team[]` | site about PATCH | `site_document.about.team` | `/api/site/about` | `content.team` → carousel (hidden if empty) | dynamic | IMPLEMENTED–UNVERIFIED |
| `/contact` chrome | prompts/budgets | — | — | static model | — | `contactPageContent` | n/a | N/A pending dedicated contact doc (chips live) |
| Contact chips | service list | `/admin/services` | publish | `service` | `/api/services` | contact page | dynamic | IMPLEMENTED–UNVERIFIED |
| Contact form | enquiry fields | `/admin/contact` inbox | `POST /api/contact` | `enquiry` | admin enquiries | contact flow | dynamic | IMPLEMENTED–UNVERIFIED |
| `/services` hub | intro + showcase | sections + services; group seeds | services | `service` + seeds | hub fetchers | `ServicesHubPage` | dynamic+seeds | PARTIAL — taxonomy seeds are layout templates |
| `/services/[serviceSlug]` | detail fields | `/admin/services/[slug]` (expanded form) | `/api/admin/services*` | `service` | `/api/services/:slug` | `ServiceDetailPage` | dynamic | IMPLEMENTED–UNVERIFIED |
| Subservices | nested detail | panel + `/admin/subservices/[id]` | `/api/admin/subservices*` | `subservice` | nested public API | subservice page | dynamic | IMPLEMENTED–UNVERIFIED |
| `/insights` + `/blog/[slug]` | posts | `/admin/blog` | `/api/admin/blog*` | `blog_post` | `/api/blog*` | insights/article | dynamic | IMPLEMENTED–UNVERIFIED |
| `/portfolio` | projects | `/admin/portfolio` | `/api/admin/portfolio*` | `portfolio_project` | `/api/portfolio*` | portfolio page | dynamic | PARTIAL — no public case-study detail route |
| Privacy/Terms | legal copy | — | — | static JSX | — | pages | n/a | N/A — legal templates (no CMS yet) |
| Sitemap | URL list | derived | — | published catalogs | public list APIs | dynamic `sitemap.ts` | dynamic | IMPLEMENTED–UNVERIFIED |
| Media | uploads | no library page | `/api/admin/media/*` | `media_asset` + disk | `/media/*` | resolveMediaUrl | runtime | PARTIAL — API only |
| Redirects | from→to | missing UI | import/scripts | `content_redirect` | `/api/redirects` | `redirectOrNotFound` | runtime | PARTIAL |

**Counts (pre-verification):** VERIFIED 0 · IMPLEMENTED–UNVERIFIED majority · BROKEN/PARTIAL under repair · BLOCKED 0 (local Backend healthy) · N/A justified for chrome/brand/legal where noted.

**Do not claim fully dynamic** until rows are VERIFIED in `docs/dynamicIntegrationVerification.md`.
