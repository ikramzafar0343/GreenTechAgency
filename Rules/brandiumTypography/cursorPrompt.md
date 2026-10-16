# Cursor implementation prompt

Paste the instruction below after extracting `brandiumTypography` into a reference directory in your project.

---

Implement a consistent, production-quality typography system throughout this project using the extracted `brandiumTypography` package. Read `typographyDesign.md`, `referenceAudit.md`, and `fontSetup.md` first, then read this repository's actual development rules and inspect its existing stack.

The confirmed reference family is TWK Lausanne. Its declared normal weights are 250, 300, 400, and 500. Use the real licensed project files; never download font binaries from Brandium, create dummy assets, map a static file to a variable range, or silently call a substitute an exact match. If assets are missing, preserve the current working loader, finish safe structural preparation, and report the exact missing filenames.

Apply the typography system to homepage and inner pages, shared navigation, portfolio and blog cards, case studies, forms, CTA, FAQ, footer, CMS output, and authored application screens. Use compact body/UI roles for admin screens and the prose scale for articles. Do not apply huge marketing H2 sizes inside dense interfaces.

Keep existing brand colors, logo files, imagery, layouts, routes, section order, content, component behavior, and animation architecture. Allow natural text reflow and resolve real clipping caused by the font change.

Use the supplied tokens, base styles, role classes, and prose stylesheet as one shared source. Place them in the existing shared style architecture and scope them with `siteTypography`. Choose one loader only. For a Next.js App Router project, follow `nextjs/nextjsIntegration.md` after adding the font assets.

Map text roles explicitly. Use 250 for hero and short marketing copy; 300 for section headings and reading contexts; 400 for controls and figures; 500 for strong emphasis. Keep body and form text at 16px by default. Use the supplied responsive sizes and tracking; do not invent local size overrides to match one screenshot.

Remove obsolete competing typography declarations where migration is complete. Keep icon fonts, code fonts, logo artwork, and third-party embeds intact. Preserve semantic heading structure, link styling, focus states, and real CMS content.

Use camelCase for authored files, folders, CSS classes, CSS custom-property names, and ordinary JS/TS identifiers. Retain required CSS/HTML syntax, framework filenames, vendor documents, and PascalCase React component identifiers. Keep each implementation file under 300 lines. Do not add placeholder pages, new animation dependencies, runtime font-fetch helpers, or unnecessary components.

Verify with real copy at 320, 390, 768, 1024, 1440, and 1920px where relevant, 200% zoom, text-spacing overrides, and reduced motion. Check long titles, form labels, CMS strong/emphasis, figures, supported locales, and clipped descenders. Check actual rendered fonts and asset requests, not just the computed family string. Ensure all essential text remains visible without animation JavaScript.

Run existing build/lint/type checks appropriate to the repository. Finish with a concise report of files changed, areas migrated, checks actually performed, and any unresolved font-asset dependency. Do not claim the real-font visual match or build is complete without evidence.
