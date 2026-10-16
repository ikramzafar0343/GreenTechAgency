# Admin-Managed Services, Subservices, Blog, and Portfolio

**Suggested project location:** Rules/ADMIN_CONTENT_BACKEND_IMPLEMENTATION.md  
**Purpose:** Implementation instructions for Cursor in the actual project repository.  
**Documentation reviewed:** 13 October 2026. This specification is not a claim that the project has been implemented or tested.

## 1. Required outcome

Implement a working admin content system for Services, Subservices, Blog, and Portfolio using the existing Backend and PostgreSQL. An authorized administrator must be able to edit real content, manage images, control display order, and publish changes without editing source files. The storefront must render that published content from the Backend.

Preserve the existing public design, responsive behavior, animations, and URLs unless a functional change is necessary. Keep existing content until it has been imported and verified. Complete all four modules and their storefront integration; authentication, database tables, or a dashboard shell alone do not satisfy this task.

This document extends the frontend and backend rules already in the project. The 300-line limit, feature architecture, and coding conventions are project policies, not requirements imposed by Next.js or PostgreSQL. Follow official documentation that matches the installed versions.

## 2. Inspect the project before changing it

- Read Rules/STACK_SELECTION.md, the existing frontend/backend production rules, applicable AGENTS.md files, package manifests, lockfiles, migrations, auth configuration, and environment examples.
- Inspect current service cards, subservice pages, blog pages, portfolio pages, navigation, homepage sections, shared components, and any existing admin interface.
- Treat PostgreSQL as selected. Reuse the actual recorded ORM, auth library, package manager, and hosting integrations. Use Drizzle, Better Auth, or Neon only where the project has selected them; do not assume an earlier recommendation proves installation.
- Map existing fields and public routes to the admin controls before implementation. Reuse working code and components. Install a dependency only for a concrete requirement the current stack cannot meet.
- Record unresolved external configuration accurately. Continue all implementable work; report the exact credentials or provider decision needed for verification without inventing values or substituting mock services.

## 3. Ownership and admin placement

| Area | Responsibility |
| --- | --- |
| Backend/ | Database access, migrations, authoritative validation, authentication, authorization, publishing, media permissions, and all content writes. Preserve /health and /api/auth/*. |
| Frontend/ | Public storefront rendering. Its server code reads Backend APIs using server-only BACKEND_URL. It must never import a database client or use database credentials. Preserve the existing auth proxy. |
| Admin interface | Reuse the existing admin surface. If none exists and Backend is already a Next.js app with UI support, add protected /admin routes there. |
| API-only Backend | If Backend cannot host UI, place protected /admin UI in Frontend and document this explicit expansion of its previous storefront-only scope. Backend still owns every privileged operation; do not create a third application merely to host forms. |

Keep one authoritative auth system. For admin UI hosted with Backend, use its existing same-origin session flow. For admin UI hosted with Frontend, use the existing approved auth proxy/session design and validate the delegated identity in Backend. Forward only necessary headers and preserve cookie behavior deliberately.

Interactive editors and upload progress may run in the browser. Permissions, publication decisions, validation, and database operations must run on the server. Hiding an admin button or redirecting an admin page is not authorization for the underlying operation. [S1, S6]

## 4. Admin capabilities

All four modules must provide a real list, create form, edit form, save result, draft/publish controls, and removal flow. Include bounded search, pagination, status filters, and module-specific filters where useful. Every displayed control must work against persistent Backend data.

| Module | Editable content |
| --- | --- |
| Services | Title, slug, short description, detailed content, card/hero media, media descriptions, supported icon, CTA label/link, featured selection, display order, and SEO fields. Expose existing benefits, process steps, or FAQs where the current service design uses them. |
| Subservices | Required parent service, title, slug, summary, detailed content, existing media/CTA/SEO fields, publication state, and order within the parent. Allow reassignment only with valid parent checks and deliberate URL handling. |
| Blog | Title, slug, excerpt, rich content, cover image, image description, public author display, publication date, SEO title/description, and featured selection. Reuse categories/tags if present; do not build unused taxonomy management. |
| Portfolio | Project title, slug, summary, case-study content, cover image, ordered gallery, image descriptions, featured selection, display order, and SEO fields. Expose existing category, client, date, project link, or related-service fields when applicable. |

Optional information must remain optional. Do not invent client names, project results, reviews, service claims, authors, metrics, or images to make forms or cards look complete. Define required publication fields from the existing design and validate them consistently.

Provide accessible labels, field errors, pending states, and clear save/publish outcomes. Preserve unsaved input after recoverable validation failures. Prevent duplicate submissions and warn before abandoning unsaved edits. Support keyboard operation, including an alternative to drag-only reordering.

## 5. Section-level customization

- Provide editable settings for the existing Services, Blog, and Portfolio sections: heading, introduction, visibility, existing CTA label/destination, and the records shown.
- Support deterministic ordering and explicit selection of featured items where the current layout needs curated cards. Keep the current layout and section order as the initial configuration.
- A service's subservice list must use its real parent relationship, publication visibility, and saved order. Do not maintain a second hardcoded list.
- Validate section item limits on the server and cap selections to the layout's supported bounds. A section setting must not expose unpublished records.
- If a section is deliberately disabled or has no published records, apply a defined empty-content presentation or hide it. A failed Backend request must produce an honest error state, not be treated as an intentionally empty section.
- Allow content customization through typed fields and approved presentation options. Do not allow admin input to execute JavaScript, JSX, SQL, CSS, or arbitrary component names. Use an allowlist for selectable icons.

## 6. Publishing, drafts, and content integrity

1. New content begins as a draft. Public APIs, public pages, navigation, search, related-content lists, metadata, and sitemaps expose only published content.
2. Saving changes to an already-published item must not accidentally publish them. Preserve the last published version until the administrator explicitly publishes the working draft. Reuse an existing revision design; otherwise implement only the draft and published representations needed for this behavior.
3. Publish is a Backend transaction that validates required fields and relationships and atomically selects the public version. Do not add scheduling, approval chains, or unlimited revision history unless already required by the project.
4. Distinguish first publication time from update time. Do not accept a future publication date as an implied schedule when scheduling is not implemented.
5. A subservice may become publicly visible only when its parent service is also published. Unpublishing a parent must hide its children in every public query and direct route without deleting their saved content. Preserve each child's own publication state.
6. A stale editor must not silently overwrite another administrator's work. Use an atomic version check and return a conflict that lets the user reload or review their changes.
7. Preserve existing slugs and URLs during migration. Enforce uniqueness at the database level using the real route scope. Slug changes to published content must preserve old links through tested redirects, including affected nested subservice paths.
8. Validate redirect destinations, prevent loops, and reserve historical paths against accidental reuse. Resolve redirects only to currently visible content; unpublished destinations must not leak drafts.
9. Use archive/unpublish for removal from the website. Permit permanent deletion of drafts or archived records only through an explicit confirmation and Backend reference checks. Do not cascade-delete a service's subservices or shared media without an intentional supported workflow.
10. Make publication status and public visibility clear in the admin. A saved draft and a published change are different outcomes. If a supported preview exists, authenticate it, prevent caching/indexing, and never use a public query parameter alone to grant draft access.

## 7. PostgreSQL model and migrations

- Use feature-owned tables for services, subservices, blog posts, and portfolio projects. Add only the media, section settings, relationships, publication representations, and redirect records the implemented UI needs.
- Store stable IDs, validated slugs, the required content fields, publication metadata, and a concurrency version. Use the project's existing ID strategy; use timezone-aware timestamps and server-controlled audit fields.
- Enforce the subservice parent with a non-null foreign key. Use explicit junction tables for real many-to-many relationships and explicit ordered rows for galleries or section selections where appropriate.
- Use relational columns for IDs, status, slug, sort keys, and fields queried or constrained. Typed, validated JSONB may hold rich-text documents or bounded presentation blocks; do not put the entire domain into an unvalidated JSON blob.
- Use primary keys, foreign keys, unique constraints, and applicable check/not-null constraints. Application validation improves errors; it does not replace database integrity. Add justified indexes on referencing columns used by joins or deletion checks. [S4]
- Derive public metadata and media references from the published representation. Draft changes to a slug, cover, relationship, or SEO field must not leak through a public projection.
- Keep multi-row publish, reorder, and relationship changes atomic. Avoid remote HTTP or object-storage calls inside a database transaction.
- Generate and review versioned migrations using the selected tooling. Apply migrations as a controlled deployment step, never automatically from a user request. Do not use destructive schema reset or uncontrolled production schema push.
- Import the site's existing genuine content with a reviewed, repeatable import that preserves URLs and avoids duplicates. Do not rerun an import in a way that overwrites later admin edits.
- Test migrations and imports against a disposable PostgreSQL environment before production use. Synthetic test records belong only in isolated test environments and must never become shipped demo content.

## 8. Backend API contract

Reuse an established API prefix and error format. If none exists, use the following route structure. Adapt parameter names to the existing router without adding duplicate endpoint families.

| Audience | Route family | Purpose |
| --- | --- | --- |
| Public | GET /api/services and GET /api/services/:slug | Bounded published list and published detail. |
| Public | GET /api/services/:serviceSlug/subservices and GET /api/services/:serviceSlug/subservices/:slug | Published subservices with published-parent checks. |
| Public | GET /api/blog and GET /api/blog/:slug | Published post list and detail. |
| Public | GET /api/portfolio and GET /api/portfolio/:slug | Published project list and detail. |
| Public | GET /api/sections/:key | Allowed section configuration and bounded published selections. |
| Admin | /api/admin/services, /api/admin/subservices, /api/admin/blog, /api/admin/portfolio | Authorized list/create and item read/update/delete operations using stable IDs. |
| Admin | Explicit publish, unpublish, archive, and reorder operations beneath the relevant resource | Validated state transitions; use non-GET methods. |
| Admin | /api/admin/sections/:key and /api/admin/media | Authorized settings and media operations. |

- Treat these as real contracts: define request schemas, response DTOs, pagination, limits, allowed sort keys, and errors. Do not create unused endpoints or duplicate a same-process operation solely to make an HTTP round trip.
- Route handlers/controllers stay thin: parse the request, call authorized feature logic, and map the result to the response. Same-process Server Actions may invoke that logic directly; independently authenticate and authorize every callable entry point.
- Public DTOs contain only published display fields. Admin DTOs expose only what an authorized editor needs. Never serialize entire database records, session objects, storage credentials, or internal audit details to the storefront.
- A missing or unpublished public resource returns 404. A Backend outage is not 404. Distinguish validation, missing session, insufficient permission, conflict, rate limit, and unexpected failure using the project's HTTP/error conventions.
- Validate IDs, slugs, query parameters, content size, array bounds, URL schemes, and transition requests on the server. Allowlist writable fields to prevent role, owner, status, or audit-field mass assignment.
- Parameterize database values. Allowlist dynamic sort columns and directions; do not interpolate untrusted text into SQL identifiers.

## 9. Authentication and security

- Reuse the selected auth library and trusted session verification. Require the existing admin permission for every admin read, mutation, upload authorization, and preview operation; deny by default. Check resource scope where the project has ownership or tenancy. [S6]
- Provide a documented, authenticated or operator-controlled way to assign the initial administrator. Never ship a default password, public admin registration, hardcoded admin email bypass, or a role accepted from the browser.
- Protect cookie-authenticated mutations against CSRF using the selected framework/auth library's supported mechanism and validated origins. Apply this to custom Route Handlers too; do not assume Server Action protection covers every endpoint.
- Configure production session cookies and allowed origins for the actual domains and proxy layout. Do not use wildcard credentialed CORS, arbitrary header forwarding, or a client-supplied role as a trust boundary.
- Keep database URLs, auth secrets, media credentials, and invalidation secrets server-only. Keep secrets out of public environment variables, bundles, request logs, error responses, and source control.
- Enforce operation-specific rate limits for authentication, admin writes, upload initiation, and expensive public searches. Reuse a distributed limiter supported by the deployment; process-local counters are not a shared limit across instances.
- Bound request size and work before expensive parsing or processing. Return a real rate-limit response and retry guidance; do not silently disable enforcement when its dependency fails.
- Store rich content in a constrained format and render through an allowlisted renderer. Sanitize any allowed HTML on the server using a maintained compatible library; validate links and reject executable schemes, scripts, event attributes, and unapproved embeds. Preview requires the same protection. [S7]
- Record actor, operation, content ID, time, and result for privileged changes using the existing audit mechanism. Do not log tokens, full private drafts, or unnecessary personal data.
- Preserve existing security headers and ensure the editor does not require broad unsafe script policies. Test denied requests against Backend endpoints directly, not only through admin navigation.

## 10. Media that works in production

- Reuse the selected durable media storage. If storage is undecided, implement the validated storage boundary and identify the provider configuration needed; do not claim uploads are complete or persist production uploads to ephemeral server files.
- Store object keys and validated media metadata in PostgreSQL. Persist the bytes in the selected storage. Browser object URLs, base64 fields, and localStorage are not persistent production media storage.
- Limit uploads to formats the design needs. Default to supported raster images; reject SVG/HTML and other active formats unless a separately reviewed requirement provides safe handling.
- Authorize upload initiation and finalization. Validate actual format, size, dimensions, and object ownership on the server; do not trust an extension, client MIME header, or a browser-supplied storage key. Generate storage names and bound processing work. [S8]
- For direct signed uploads, keep bucket credentials on the server, scope grants to a generated object key, limit lifetime and size, and verify the stored object before attaching it to content.
- Store informative alt text for content images and permit an explicit decorative designation. Preserve width/height or aspect ratio for stable rendering. Use the project's image optimization and explicit allowed media hosts.
- Keep draft-only media private. When publishing makes an asset public, disclose that unpublishing the page cannot erase copies already downloaded. Do not promise retroactive secrecy for previously public assets.
- Reject deletion of assets still referenced by drafts or published content. Replace references deliberately, and clean abandoned uploads through a bounded existing mechanism; do not delete shared objects on an individual form failure.
- Handle database/storage partial failures explicitly. Do not report success before upload verification and reference persistence. Do not fabricate a working image URL when storage is unavailable.

## 11. Connect the storefront and control freshness

- Replace hardcoded content arrays for these modules with Backend-backed reads. The one-time import is not a runtime fallback. No mock API, localStorage CMS, temporary JSON database, or silent return to static records on an error.
- Fetch Backend data from Frontend Server Components or its server-only feature client. Avoid Server Components calling Frontend's own Route Handlers, which adds an unnecessary network hop. Client interactions may use an existing narrowly scoped proxy when genuinely needed. [S2]
- Keep route files thin and use existing Next.js file-based routes. If absent, add service, nested subservice, blog, and portfolio detail routes using the current App Router conventions; dynamic [slug] segments are real routes, not placeholder pages.
- Reuse existing card and detail components. Fetch only the fields each view needs, use bounded list endpoints, and start independent requests together. Share repeated reads within a request when appropriate.
- Use an explicit cache policy. Without an existing reliable public-content invalidation mechanism, use dynamic rendering and uncached content reads first; do not add persistent caching that breaks admin publishing.
- If the project already caches public content or measurement justifies it, implement and test invalidation in the Frontend deployment itself. Backend cache calls alone do not clear a separate Frontend deployment. Use a narrowly scoped authenticated callback, allowlisted resource-to-route mapping, and a durable retry mechanism for failed delivery.
- For persistent caching, record a finite freshness bound and separate “database saved” from “storefront refresh pending.” Invalidate applicable list/detail routes, homepage selections, metadata, sitemap, parent-child dependencies, and old/new slug destinations. Do not assume stale-while-revalidate is immediate removal. [S3]
- Keep admin data, drafts, sessions, and preview responses out of shared public caches. Where immediate removal is required, public visibility checks must bypass stale shared content before serving the page or API response.
- Generate public SEO metadata and sitemap entries from published content only. A missing SEO title may intentionally derive from the published title; do not create unrelated filler metadata.
- Publishing must update the live site without rebuilding source files. Verify browser navigation and fresh requests after publish, unpublish, reorder, and slug changes. Never claim an already-open browser tab is remotely refreshed unless that behavior was actually implemented.

## 12. Performance and maintainable architecture

- Group code by services, subservices, blog, portfolio, media, and sectionSettings where each has real responsibilities. Feature folders own their schemas, authorized use cases, queries, DTOs, and relevant UI.
- Keep routing as the framework entry layer. Reuse the Backend's database/auth infrastructure and a small shared error/pagination contract. Do not create a generic CMS engine, one universal content table, or abstractions with a single trivial use.
- Apply SOLID where it improves responsibilities and boundaries, DRY to genuinely repeated logic, and KISS to the implementation. Share stable behavior; keep different publishing rules in their owning features.
- Use camelCase for variables, functions, hooks, and ordinary TypeScript modules; PascalCase for React components, classes, and types. Preserve framework names such as page.tsx, layout.tsx, and route.ts and the existing database naming convention.
- Every handwritten source file must remain at or below 300 physical lines, including comments and blank lines. Split by responsibility before reaching the limit; do not compress code or add empty wrapper files to evade it. Handle tool-generated artifacts according to the existing project rules.
- Bound every list, search, gallery, relation expansion, and reorder payload. Prefer keyset pagination for growing public feeds with a deterministic tie-breaker; reuse an appropriate bounded existing strategy elsewhere.
- Avoid one query per card, author, image, or subservice. Use joins or bounded batched queries with explicit columns. Do not fetch full rich bodies for summary cards or perform independent reads sequentially.
- Derive indexes from actual filters and sort order, including parent-scoped subservice access and published list queries. Do not create an index for every column or demand index scans when a small-table sequential scan is optimal.
- Reuse the configured database pool. Set acquisition, statement, transaction, and upstream request time limits appropriate to the existing deployment. Budget connections across all instances, admin jobs, migrations, and reserved capacity.
- Validate important query plans with EXPLAIN (ANALYZE, BUFFERS) on representative staging data. Remember that ANALYZE executes the statement; use safe reads or an appropriately isolated test environment. [S5]
- Measure list/detail latency, query counts, pool wait, and publishing under representative concurrency. Use the existing performance budget or document provisional targets and test conditions. A tiny fixture or unit test does not establish “no slow queries” or “no bottlenecks.”

## 13. Implementation and verification sequence

1. Inventory real routes, content fields, selected dependencies, auth, and deployment boundaries. Record the field-to-form-to-public-view mapping.
2. Add reviewed schema migrations, constraints, justified indexes, and the repeatable real-content import.
3. Implement authorized feature logic, publication visibility, API contracts, media persistence, and useful errors.
4. Build the working admin lists/forms for all four modules, section settings, and the required media controls.
5. Connect all existing storefront sections and detail routes to published Backend data; verify URL continuity, SEO, and the selected freshness policy.
6. Run the project's lint, typecheck, production builds, and relevant existing tests. Add focused integration/security tests for the new persistence and publishing boundaries, and verify the completed UI flows.
7. Report what changed, the actual test results, required environment configuration, and remaining external blockers. Do not call skipped database integration tests passing or mark the system production-ready on unit tests alone.

## 14. Acceptance checklist

- [ ] An authorized administrator can create, edit, reload, publish, unpublish, archive, and safely remove eligible records in all four modules; data survives application restarts.
- [ ] Existing genuine content and public URLs survive import. Repeating the import creates no duplicates and does not overwrite later edits.
- [ ] A draft stays private; draft edits to an already-published item leave its current public version unchanged until publish.
- [ ] Parent/child rules hold for public lists, direct subservice URLs, related content, sitemap, and cached paths after parent unpublish.
- [ ] Titles, summaries, images, section settings, featured selections, and ordering reach the relevant storefront views through the Backend.
- [ ] Duplicate slugs, bad relationships, invalid transitions, stale versions, oversized payloads, and unauthorized writes produce useful failures without corrupting data.
- [ ] Direct requests without permission fail even when bypassing the UI; public DTOs, pages, and caches contain no draft or session fields.
- [ ] Rich-text and preview XSS attempts are rejected or rendered safely; cookie-based writes enforce the selected CSRF protection.
- [ ] Media uploads persist, invalid uploads fail, private draft assets remain protected, and deleting referenced assets is prevented.
- [ ] Publish/unpublish and slug-change tests cover both deployments and the selected cache policy; failed invalidation is visible and recoverable.
- [ ] Queries are bounded, repeated relations avoid N+1 behavior, and relevant query plans and representative latency have been reviewed.
- [ ] Production builds, types, lint, and focused database/integration tests pass against configured services; any unavailable environment is explicitly reported as unverified.
- [ ] No inactive controls, fake metrics, demo records, runtime placeholder content, hardcoded admin access, or silent static-data fallback remains.
- [ ] New source files obey the 300-line rule and the existing feature, naming, and server-only boundaries.

## 15. Required completion report

Provide a concise list of the files changed, admin URLs, API contracts, migration/import commands, required environment variable names without secret values, initial-admin procedure, media storage configuration, and test results. Identify any exact deployment or credential blocker. Use the real repository paths and implemented commands; do not invent successful deployment or verification.

Do not stop at a plan, mockup, schema, API shell, or “ready to connect” status. Implement and connect the authorized scope in the repository. Only actual unavailable services or credentials may remain explicitly blocked.

## 16. Official references

Use installed-version documentation before copying APIs. These sources support the security, integrity, and platform guidance; feature scope and numerical project policies are defined by this document and the existing project rules.

- [S1] Next.js: Data security
- [S2] Next.js: Backend for Frontend
- [S3] Next.js: revalidatePath
- [S4] PostgreSQL: Constraints
- [S5] PostgreSQL: Using EXPLAIN
- [S6] OWASP: Authorization Cheat Sheet
- [S7] OWASP: Cross Site Scripting Prevention Cheat Sheet
- [S8] OWASP: File Upload Cheat Sheet
