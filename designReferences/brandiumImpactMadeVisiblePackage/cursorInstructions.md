# Paste This Prompt Into Cursor

Implement the **"Impact made visible" horizontal editorial impact-card section** shown on https://www.brandium.nl/ and in the attached `referenceOnly/impactSectionReference.png` for my EXISTING production Next.js site.

**READ IN ORDER:** `designReferences/brandiumImpactMadeVisiblePackage/design.md`, `specs/cardByCard.md`, `specs/motionAndResponsive.md`, `specs/adminContentSchema.md`, and `assetManifest.md` (adjust root path to wherever I put the ZIP contents). Inspect reference image and `referenceOnly/impactGeometryOverlay.png`.

STRICT RULES:

1. First audit my actual codebase: routes, page composition, current color/font tokens, image pipeline, CMS, installed motion stack, and frontend rules. Show which files are affected before changing them.
2. Reproduce the exact **top-aligned, mixed-height, seamless horizontal row**. Approx. desktop card width 459px, gap 16px, radii 10px; heights tall 552px, compact 256px, CTA 358px. The card types and photo/copy/metric anatomy are specified individually. DO NOT turn it into uniform grid/carousel cards.
3. Preserve my current project's brand colors and fonts. Match source visual treatment using token mappings, **without** changing global styles or unrelated homepage sections.
4. Cards must use genuine approved business content/media. Do not copy Brandium's results as ours, invent metrics, use the screenshot crops as production photos, or insert filler. Use existing case study data/admin models where available.
5. Use current feature-based architecture. You may adapt the source reference implementation in `src/components/impactMadeVisible`, but audit dependencies/types and integrate properly rather than blindly overwriting files.
6. Implement desktop moving rail without large UI dependencies; mobile native swipe/scroll-snap and reduced-motion fallback. Pause autoplay on hover/focus/offscreen. No extra arrows, pagination, glows, borders or shadows.
7. Render two equal card sequences ONLY in view layer for seamless desktop movement; hide the second from assistive technology and keyboard; never duplicate CMS records.
8. Only edit required files. Strict typing, stable keys, accessible links, correct image alt, Next/Image, minimal Client Components, scoped CSS, clean architecture, no demo/test placeholder content. Keep source files <300 lines.
9. Test against the reference at 1591×635, plus 1440, 1024, 768, 390 and 375px. Verify photo focal points, visible whitespace beneath short cards, no overflow, no hydration errors, mobile swipe, reduced motion, keyboard access, lint/typecheck/build.
10. Deliver a file-change list, measurements before/after, completed checklist, and any outstanding blocker (e.g., missing actual photography or verified KPI). Do not claim pixel parity unless you compared screenshots.

**Start with the card sequence in the screenshot:** tall mint-type image → compact black metric → tall photo case result → medium neutral CTA. Then continue with approved editorial/metric variations. If my actual project has no matching photos, implement structure with real available assets or pause for media; never fabricate a result.
