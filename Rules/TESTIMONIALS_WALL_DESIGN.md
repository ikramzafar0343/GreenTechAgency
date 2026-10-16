# Testimonials Wall — PremierCS-Inspired Production Design Specification

**Target:** Jump If Zero agency homepage · **Reference:** https://premiercs.com/ · **Version:** 1.0 · **Date:** 2026-10-08

> **Cursor instruction:** Implement this as a real, production-ready section in the EXISTING application. The supplied `reference.png` is a visual reference only. Follow the repository rules, especially `NEXTJS_FRONTEND_PRODUCTION_RULES.md` if present. Do NOT copy PremierCS brand assets, testimonials, font files, CSS, scripts, or content. Do NOT change unrelated sections.

## 01 — Source audit and fidelity boundary

- The supplied desktop screenshot shows **five near-black vertical card stacks** forming a downward-at-the-edges / upward-in-the-center wave: columns 1 and 5 start low; columns 2 and 4 begin higher; column 3 starts highest.
- Approximate screenshot geometry at 1600 × 900: card widths **259 px**, horizontal gaps **28 px**, ordinary card heights **298–300 px**, vertical gaps **28–30 px**, and card radii about **12–14 px**. These are measurement targets, not required hardcoded values.
- Relative top offsets observed in screenshot, from highest center column: **[+258, +92, 0, +92, +258] px**. The first visible cards begin around x = 90, 378, 664, 949, 1237 px. The wall—not Premier's page header or browser controls—is the reference.
- Default faces: dark card surface, top-aligned company logo, centered company name/location, compact reviewer avatar/name/title row near bottom. Surrounding section is darker than cards; typography is quiet and clean.
- The live page publishes associated client quotes, company names, reviewer names/roles, and photos. A **contrasting quote-reveal face** is the specified interaction, but exact original hover timing and implementation were **not verified**; animation numbers below are implementation targets, not claims about Premier's code.
- Desired result: reference-level composition and polish **with Jump If Zero's own palette, fonts, approved assets and content**. No imitation of Premier's navigation, footer, CTA, browser toolbar, customer identities, or proprietary design files.

## 02 — Non-negotiable repository-first workflow

1. Read `AGENTS.md`, `.cursor/rules/`, `.cursorrules`, existing `design.md`, `NEXTJS_FRONTEND_PRODUCTION_RULES.md` **where present**; read the project package manifest, App Router routes, homepage section composition, testimonials implementation, admin/database/media conventions, and current styles/tokens.
2. Identify and document the real **primary font, secondary font (if any), colors, spacing tokens, border radius, page container, buttons, image components, animation engine, and review-source contract** before making changes. Use those exact assets; **do not invent a new palette or font**.
3. If an existing testimonials wall already exists, **refactor it in place**; preserve approved data, record IDs, featured/published flags, order and admin workflow. Do not create a competing second testimonial wall.
4. Treat **existing project design tokens as the source of truth**. On a dark page, use existing background/surface/foreground/muted/accent tokens. If the site isn't dark, adapt contrast using its established theme instead of hardcoding Premier's black.
5. Do not silently assume this repository uses any specific animation package, ORM, admin framework, asset path or Tailwind version. Inspect first; reuse installed tooling. Do not create unverified `public/` paths or seed fake data.
6. Keep the homepage server-rendered wherever possible, with **only the interactive wall as a small Client Component**. Preserve routing, metadata, structured data, other homepage blocks and global typography.

## 03 — Target composition

```text
Full-bleed section background (existing theme token)
  Existing site-width heading container
    [Eyebrow: existing style, admin-editable if supported]
    H2: What Our Clients Say  [reuse current heading/copy if present]
    Optional short supporting text / existing CTA

  Wide testimonials wall container (not a nested narrow content column)
        COL 1           COL 2           COL 3           COL 4           COL 5
                                         ┌────────┐
                                         │ card 1 │
                        ┌────────┐       └────────┘       ┌────────┐
                        │ card 2 │       ┌────────┐       │ card 4 │
                        └────────┘       │ card 6 │       └────────┘
      ┌────────┐        ┌────────┐       └────────┘       ┌────────┐      ┌────────┐
      │ card 3 │        │ card 7 │       ┌────────┐       │ card 8 │      │ card 5 │
      └────────┘        └────────┘       │ card 9 │       └────────┘      └────────┘
        ...               ...            └────────┘          ...            ...

  Section bottom space sufficient for visually offset outermost cards
```

**Illustrative labels only.** Actual DOM records and placement use existing real testimonials. Do not create dummy reviews to fill five columns. When fewer genuine reviews exist, show fewer columns / a balanced arrangement.

### Layout and measurements

| Token / condition | Production target |
|---|---|
| Background | Existing page background token; continuous full viewport width |
| Main wall container | `width: min(100% - 2 × responsive gutter, 1440px)`, centered |
| Desktop gutter | Existing site's gutter, visually close to `clamp(20px, 5.5vw, 90px)` if no equivalent exists |
| Section block padding | Existing section rhythm, approximately `clamp(72px, 7vw, 120px)`; no artificial 100vh minimum |
| Heading-to-wall spacing | 40–56 px, adjusted to existing heading scale |
| Column gap | 24–28 px desktop; 20–24 px tablet; 16 px mobile |
| Card radius | Existing card radius, visually ~12–14 px |
| Card base min-height | ~300–320 px; let real quote content increase intrinsic height |
| Card inner padding | 28–32 px desktop, 24–28 px tablet/mobile |
| Card width | Prefer **≥260 px** for multiple columns; NEVER scale cards down to fake five columns |
| Logo region | ~140 × 54 px contained image box; reserve height, no distorted aspect ratio |
| Reviewer image | 46–50 px circular; `object-fit: cover`, intentional focal position |
| Main company name | Current heading font, approx. 20–22 px / line-height 1.3 |
| Location and reviewer role | Existing small text tokens; readable with WCAG-appropriate contrast |
| Quote typography | Approx. 18–20 px / 1.45–1.55; **never below 17 px** to fit a long review |

**Do not use:** `zoom`, wall/card-wide `scale`, fixed card heights that clip text, `100vw` together with added horizontal padding, a nested 900px max-width, excessive empty top/bottom spacers, or global CSS overrides to fake the reference.

### Column count from actual wall width (container-aware)

| Available content width | Columns | Vertical start offsets |
|---|---:|---|
| ≥1400 px | 5 | `[258, 92, 0, 92, 258]px` |
| 1110–1399 px | 4 | `[88, 22, 22, 88]px` |
| 820–1109 px | 3 | `[60, 0, 60]px` |
| 540–819 px | 2 | `[24, 0]px` |
| <540 px | 1 | `[0]` |

Use CSS container queries where consistent with the repository; equivalent responsive breakpoints are acceptable. **Five columns are not mandatory on a 1440px screen if the inner container would make cards too narrow.** Scale offset intensity down when viewport height is small. Reserve max-offset space *in wall/section geometry*, so translated last cards never overlap the next section.

**DOM / layout strategy:** Prefer a single CSS Grid in **row-major data order** with CSS custom properties for column-specific visual offsets, keeping one real DOM copy per review and keyboard/screen-reader order predictable. With unequal natural heights, accept deliberate row alignment rather than shipping fragile JS masonry. If the repo already has a stable accessible masonry solution, it may be reused after verifying focus order and responsive reflow. Do not introduce a new masonry dependency solely for this section. Do not separately render five desktop columns plus a duplicate mobile list.

## 04 — Individual card: identity face (default)

- Whole card uses the existing dark elevated-surface token, a subtle distinguishable boundary, no gaudy drop shadow or gradient. Maintain clean edges at rest.
- Use flex-column layout with an actual top/logo group and bottom reviewer group; distribute vertical room with `margin-top: auto` or a simple grid—not absolute positioning for critical text.
- Company **logo:** centered in reserved image box, `object-fit: contain`, never `object-fit: cover`; keep brand colors as approved. Missing logo → present text only, balanced; do not fabricate a logo.
- **Company name:** centered, natural wrap for long names; optional location below. Do not clamp legal company names to two lines with ellipses.
- **Reviewer row:** 46–50 px avatar; name + job title stacked next to it, left-aligned inside the row; center the row as a group. If portrait missing, omit image and align attribution properly; never use a generated person's face.
- Reserve real image aspect ratios/sizes to avoid layout shifts. Keep standard section heading, cards and typography on the site's current fonts.
- Card has a semantic `article`; the company identity is NOT a link to Premier or to an invented external URL.

## 05 — Active card: full quote reveal

- Fine pointer hover previews quote. Click/tap or explicit accessible control **pins/unpins** it. Keyboard Enter/Space acts through the real button. Only one card is pinned at once; hover previews must not override a pinned/focused card.
- Transition between identity face and quote face in the **same outer box**. Use a CSS grid overlay with both faces occupying the same grid cell so the taller content determines stable card height before hover. Do not use `position:absolute` for the entire quote's measurement.
- Quote face: use the website's existing **inverse/high-contrast surface** and appropriate foreground token (light face for a dark-theme page when available), not an arbitrary new accent. Outer corners match identity face.
- Hierarchy: optional genuine rating → exact approved quotation in semantic `blockquote` → reviewer attribution → optional working original-review link. No placeholder star ratings, invented praise, or generated logos.
- Use **real normal line wrapping** (`overflow-wrap: break-word` only for extreme tokens); never `word-break: break-all`, line-clamp, forced `<br>`, horizontal clipping, tiny text or nested tiny scrollbars.
- If quote is long, **increase card height at rest** by intrinsic sizing. Same-row cards may stretch to stable row height; that is preferable to a jump on reveal.
- Fade the front to fully invisible **before quote becomes fully opaque**; prevent both text layers being simultaneously legible. Active face background must be opaque. Toggle state handles visibility, inert/focusability and accessible names. Keep focused controls visible throughout.
- Optional animated emphasis: highlight only an exact substring of approved quote; otherwise keep full quote plain. No highlighted fabricated metrics.

### Animation timing and interaction state machine

| Event | Result |
|---|---|
| Initial SSR | Identity visible; full approved quote exists in server-rendered document |
| `pointerenter` on `(hover: hover) and (pointer: fine)` | Preview quote unless another review is pinned |
| `pointerleave` | Close preview unless pinned or focus is within card |
| Click/tap card's reveal control | Pin selected card; clicking another replaces current pinned card |
| Keyboard Tab | Focusable **Read review** button with visible focus; no card-order traps |
| Enter / Space | Toggle selected quote face; `aria-expanded` reflects actual state |
| Escape / Close button | Close pinned face; restore sensible focus to reveal control |
| Focus enters quote face | Keep quote open while interacting with its valid source link |
| Click outside | Optionally dismiss pinned face without unexpected focus jumps |
| `prefers-reduced-motion: reduce` | Instant or minimal-opacity reveal, no wall/quote movement |
| No JavaScript | Make full review obtainable with semantic markup / `noscript` CSS fallback; no content loss |

**Suggested motion:** front fades out over 120–160 ms; quote face fades in over 180–220 ms with up to 4–6 px translation; reverse smoothly in 200–280 ms total. Use ease-out/ease-in-out consistent with the site. Avoid card flips, spin, rotating 3D layers, scale-up hover that collides with adjacent columns, or involuntary horizontal layout shifts.

Avoid building a second state system when CSS `:hover` and existing component state already cover the contract. Use one stable active `id` plus a pinned `id` only where necessary. On rapid cursor moves cancel stale transitions. Source links and Close controls must not trigger article activation through bubbling.

## 06 — Optional subtle scroll depth (do not compromise layout)

- Screenshot *proves staggered placement*, **not** any specific parallax behavior. Implement scroll-linked movement only if the current homepage motion system and visual direction support it; otherwise the static stagger is the required result.
- If used, limit additional movement to approximately **±12–22 px** in alternating column directions; existing stagger remains the main visual character. Animate transform/`translate` only, no layout-driven top/height changes.
- No infinite marquee, cloning, autoplay scroll, pinned wheel capture, horizontal scroll interception, or second Lenis/GSAP/Framer setup.
- Pause motion while hovered, pinned, or keyboard-focused; suspend observers while offscreen; disconnect/cleanup on unmount. Do not recalculate every card's bounds on each frame.
- Completely disable parallax on touch, narrow layouts and reduced-motion preference. Never make quote text drift while someone reads it.

## 07 — Theme, font and asset integration

| Concern | Cursor MUST do |
|---|---|
| Brand colors | Resolve existing CSS variables / Tailwind tokens in repo; map `sectionBg`, `cardBg`, `textPrimary`, `textMuted`, `quoteBg`, `quoteText`, `focusRing`, `brandAccent` to those existing values |
| Fonts | Inherit the site's actual `next/font`/global font stack, typography classes, variable weights; **no Google/Premier font import** |
| Logos | Reuse stored approved agency customer-logo media IDs/paths; contain sizing and descriptive surrounding text |
| Reviewer images | Reuse genuine existing reviewer portraits via existing image pipeline, storage/domain allowlist and media dimensions |
| Icons | Reuse existing icon library / inline SVG convention; no new icon dependency for one arrow/star |
| Rating | Display only actual stored numeric rating with stated scale; omit if missing |
| Button | Reuse current focus/hover/button conventions; minimum 44 × 44 px targets for Close and tap controls |
| Content | Use only current authorized/published reviews; no Premier examples published as agency endorsements |

Maintain ≥4.5:1 contrast for normal body/quote text where WCAG AA applies. Do not copy screenshot's low-opacity gray literally if illegible. Missing genuine media is a **content gap**, not a reason to generate fake client proofs. In admin, require/provide safe upload validation and preview where already supported.

## 08 — Admin/CMS/data requirements

- Section must read the existing canonical testimonials collection and homepage block settings. **All already-editable fields remain editable:** section eyebrow/title/subtitle/visibility; testimonial `id`, company, logo, city/location, reviewer name, role, portrait, exact quote, optional rating, source URL, approved/published status and display order (adapt to actual schema).
- Preserve current admin upload, replace/remove, reorder, feature/publish, and validation workflows. Add missing **required** field support only through the existing feature and real persistence layer; do not build parallel storage or fake in-memory data.
- No migration for presentation-only work; schema migration only if genuinely necessary after inspection. Protect mutating actions server-side (auth, authorization, input validation, upload constraints and relevant quotas).
- Select only displayed, approved records server-side. Preserve sorting deterministically and use **stable record IDs** for React keys. Do not leak drafts/private notes.
- Invalidate appropriate cached public result after authorized admin edit/publish/unpublish/reorder using the installed version's cache model; verify change appears on homepage.
- If no valid published reviews exist, hide empty wall on public page; show real actionable empty state in admin. Never silently fabricate sample testimonials.
- Do not invent or automatically emit aggregate `Review`/`AggregateRating` schema or rich-result eligibility. Preserve legitimate existing structured data and semantic HTML.

## 09 — Clean Next.js engineering contract

- Honor repository's exact versions and official version-matched docs; App Router route composition stays in `src/app`. Prefer Server Component for data fetch and HTML; isolate hover/tap state in the minimal `'use client'` boundary.
- Match **feature-based architecture**. If no matching feature exists, use cohesive modules such as `src/features/testimonials/components/TestimonialsSection.tsx`, `TestimonialCard.tsx`, `TestimonialQuote.tsx`, `TestimonialsWall.module.css`, and necessary `server/` read module. These are *examples of responsibilities*, not a command to create redundant files.
- All authored source/test/style/config files ≤ **300 physical lines**. Component and component files PascalCase, functions/fields camelCase, feature folders kebab-case, constants UPPER_SNAKE_CASE, hooks `useX`. Preserve `page.tsx` convention and file-based routing.
- Follow SOLID where applicable; KISS/DRY; one owner per concern; no service-locator/repository abstraction for trivial UI; no catch-all helpers, dead files, fake fallbacks, speculative features or global state for local cards.
- Strict TypeScript contracts, boundary input validation, no `any`/unsafe casts/`@ts-ignore`, no index keys, no render-time mutations, no unnecessary state/effects/memos, and no extra third-party dependencies just for a section.
- On the server, fetch in one efficient query; avoid N+1 fetches or client request waterfalls. No self-HTTP call from Server Components to app's own route handlers. Preserve actual cache/locale/tenant keys and invalidation rules.
- Reuse existing `next/image` integration with `sizes`, dimensions, alt strategy and lazy loading where appropriate. No new global fonts and no loading-heavy asset filters.
- Accessible HTML: `section` + H2, `article`, `blockquote`, reviewer attribution, actual buttons/links. Correct `aria-expanded`/`aria-controls`, hidden-face focus management, visible focus, touch behavior and 200% zoom usability.
- Animation is **progressive enhancement**, not a prerequisite for testimonial content. Only transforms/opacity; suspend observers offscreen; remove listeners on unmount. Aim for LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 in representative field measurement.
- Keep all other routes, home sections, nav, portfolio, Insights, services, CTAs, footer, fonts, base design tokens and admin pages unchanged except the minimum directly necessary integration.

## 10 — Required responsive and edge-case QA

- Visual test at **1920, 1600, 1440, 1280, 1024, 768, 390, 320 px** and 200% zoom. Record actual column count, card width and no horizontal overflow.
- Compare the supplied screenshot's **five-column wave at ~1600 px**: outer starts lower by ~258px, inner pair by ~92px, center highest; centered wide content, 28px-class gap, 300px-class dark cards.
- At widths where 5 × 260px won't fit, reduce columns; do **not** apply a page-scale transform, shrink text, or force 5 columns onto phones.
- Test default, mouse preview, pinned quote, second-card switching, keyboard Enter/Space, Escape/Close, clicking review source, mobile tap, outside click, rapid hover and reduced motion.
- Test real records with a very long approved quote, long client name, no logo, no reviewer image, no rating, long role text, source link absent, one or two total reviews and no published records.
- Check quote face text: **full length visible**, no ghosting from identity face, no jump in outer card height during activation, no ellipses, no clipped text and no unreadably narrow column.
- Verify server-rendered HTML and no-JS access, keyboard focus order, contrast, accessible names, accessible hiding, image dimensions, no blank reserve after last cards and no overlap with adjacent sections.
- Run the existing package manager's formatter, ESLint (`--max-warnings 0`), TypeScript checking, authored-file line-cap check, appropriate interaction regression tests, and **production build**. Fix genuine failures without disabling checks; report what was/wasn't actually run.

## 11 — Implementation sequence for Cursor

1. **Audit:** Report current project tokens/font/assets/animation library, current testimonial component/data/admin paths and actual measured container/card CSS. Identify any existing narrow-container/scale/hover-clipping bug before editing.
2. **Layout:** Make a single responsive, wide, row-major wall; implement wave offsets and reserved visual height; match logo/name/role alignment and theme tokens.
3. **Reveal:** Build stable, intrinsic-height dual faces and controlled hover/pin/tap/keyboard interaction, correct hidden-face accessibility and reduced-motion behavior.
4. **Data:** Connect genuine published admin records and current media pipeline; add only necessary real fields, cache invalidation and validation without parallel models.
5. **Verification:** Inspect default/active screenshots at target widths, long-content cases and hover rapidly; run correct existing checks and review diff for unrelated changes.

### Paste-this-command into Cursor

> Read `design.md`, the bundled `reference.png`, all repository/Cursor rules and the actual Jump If Zero project first. Implement/refine the EXISTING homepage testimonials section using the five-column symmetric wave measured here (desktop column offsets 258/92/0/92/258px, card widths ~260px and gaps ~28px), with responsive 4/3/2/1-column behavior. Preserve **exact existing fonts, color tokens, approved media, dynamic admin records, page section order, CTA behavior and animation stack**. Default dark cards show real company logos, company/location and reviewer identity. Hover/tap/keyboard reveals the full real testimonial on an opaque high-contrast face with no text ghosting, clipping, shrunk typography, layout jump or fake reviews. Maintain one ordered DOM copy, safe server-rendered content, semantic accessible interactions, reduced motion, production Next.js App Router architecture, SOLID/DRY/KISS, strict TypeScript, ≤300-line authored code files and no extra dependencies. Do not touch unrelated UI or rewrite current data/admin systems. Measure/check widths, accessibility, admin publish updates, lint/typecheck/test/build, then report **specific files changed, verified outcomes, and blockers**. Never claim a test was run if it was not.

---

**Finish criteria:** The section looks recognizably like the supplied reference while staying unequivocally on-brand for Jump If Zero, using only real approved proof and preserving all existing production rules.
