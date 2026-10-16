# Complete Dynamic Integration Repair — Cursor Implementation Specification

**Suggested repository location:** `Rules/fullDynamicIntegrationFixDesign.md`  
**Target:** Existing Next.js Frontend + standalone Node.js/TypeScript Backend + PostgreSQL + protected admin.  
**Purpose:** Find and repair every missing connection between editable content, admin forms, Backend endpoints, persisted records, and public rendering.

**Evidence boundary:** The supplied attachment is the earlier implementation prompt. No repository, running application, database, or Cursor completion report was supplied for this document. The failure patterns below are checks to perform, not claims about defects already verified.

**Instruction to Cursor:** Inspect the actual repository, implement the repairs, and produce evidence. This is an implementation task; an audit report alone does not complete it.

## 1. Non-negotiable outcome

An authorized administrator can change every existing business-content field, save it durably, publish it when required, and see the correct result everywhere that content is used. Changes survive reloads and service restarts. New published detail pages work without creating source files or rebuilding the website.

“Dynamic” means content is managed through admin and read from the authoritative Backend/database. It does not require putting structural JSX, CSS, animation settings, ordinary interface labels, or decorative geometry in PostgreSQL. Preserve those design elements unless an existing approved setting already controls them.

The website must keep its present appearance, section structure, fonts, colors, media framing, responsiveness, animations, hover behavior, and public URLs. Make the data and controls functional. Preserve genuine existing content until its replacement is verified.

## 2. Read the rules and respect the actual stack

- Read all applicable `AGENTS.md`, `.cursor/rules/`, `.cursorrules`, `Rules/`, frontend/backend/database production rules, `ADMIN_CONTENT_BACKEND_IMPLEMENTATION.md`, and `Rules/STACK_SELECTION.md` before editing.
- Inspect manifests, lockfiles, actual installed versions, schema, migration history, auth integration, environment examples, storage configuration, and build/deployment scripts. Record the stack actually present.
- Standalone Node.js Backend and PostgreSQL are selected. Frontend owns the Next.js public site and protected admin UI. Apply the newer admin architecture instruction where it explicitly supersedes an older Next.js-Backend suggestion.
- Reuse selected ORM, auth, framework, storage, package manager, and provider. Follow the existing approved framework default only if none is selected. Do not introduce a second auth system, ORM, CMS, router, or parallel endpoint family.
- Follow naming, feature ownership, security, strict typing, and the 300-physical-line cap for hand-authored code/configuration. Do not compress code or weaken checks to pass.
- Resolve routine implementation details autonomously. Continue all independent work when external configuration is unavailable; identify the exact blocked operation. Never invent credentials, provider choices, successful checks, or deployment status.

## 3. Establish a complete inventory before repairing

Enumerate every public route, shared layout, page section, responsive component variant, admin screen, form, content endpoint, and content table/model. Include components reached through imports, not just route filenames. Use `rg`/`rg --files` and follow the real dependency graph.

Search for hardcoded arrays, inline business copy, JSON imports, localStorage/sessionStorage content stores, fixture imports, stub handlers, fabricated success responses, catch-and-return-static fallbacks, duplicated desktop/mobile data, disabled buttons, and unfinished callbacks. Classify matches; static code is not automatically a defect.

For every displayed business field, assign one classification: admin-managed content, derived published value, or fixed interface/design constant. Record a reason for fixed classifications. Titles, descriptions, FAQs, contact details, CTA destinations, content images, nav content, and SEO values must not be silently classified as design constants.

Create `docs/dynamicIntegrationAudit.md` and maintain one row per field or coherent repeated-field group with columns: Surface, Content field, Admin control, Write path, Persistence, Read path, Render path, Freshness, Evidence/status.

## 4–18. (Operational sections)

Follow environment alignment, authoritative integration path (Next Server Component → server-only Backend client → Node public route → PostgreSQL), endpoint chain repair, coverage checklist (header, homepage, services, blog, portfolio, about/contact, footer, forms, metadata), admin editing behavior, persistence, publication, remove frontend disconnections, new pages after deployment, content freshness, media/forms, failure investigation, implementation slices, acceptance evidence, and completion gate as specified in the source prompt dated 14 October 2026.

Verification artifacts:

- `docs/dynamicIntegrationAudit.md`
- `docs/dynamicIntegrationVerification.md`

Do not mark the website fully dynamic until every mapped admin-to-database-to-public-page flow is verified.
