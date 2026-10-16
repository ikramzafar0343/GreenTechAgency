# Dot Field Background — Cursor Implementation Design

**Reference:** https://www.componentblocks.com/blocks/bg-dot-field  
**Scope:** Add ONLY a cursor-reactive dotted background to ONE existing section selected in the project. Do not rebuild or redesign that section.

**GreenTech Agency target section:** How We Work (`Frontend/src/features/how-we-work/`). Do **not** mount the dot field on Our Work / Portfolio — that section uses the curved timeline ([HOW_WE_DO_IT_TIMELINE_DESIGN.md](HOW_WE_DO_IT_TIMELINE_DESIGN.md)).

## 1. Visual target

Recreate the reference's **precise, evenly spaced field of small circular dots** as a subtle background texture. When the pointer enters the section, nearby dots **brighten, grow slightly, and gently move apart**, forming a soft circular area of activity that follows the cursor. Distant dots remain calm. The effect fades smoothly back to the original grid after the pointer leaves.

The reference describes a canvas-based grid with cursor proximity interaction. Its preview defaults to **30px dot spacing** and **130px cursor reach**. Treat these as initial tuning values, not reasons to replace the site's design system.

- Dots should look crisp, understated, and consistently spaced.
- Regular background dots: approximately **1–1.3px radius**, adjusted for actual visual density.
- Active dots: approximately **2–2.5px radius** maximum.
- Default dot opacity: approximately **0.12–0.25**; peak interaction opacity **0.55–0.85**, tuned for the current background contrast.
- Dot field color MUST be derived from the project's existing foreground/accent tokens or a suitable existing section color. **Never introduce a foreign palette or hardcode the reference site's colors.**
- Keep the canvas **transparent**: it enhances the current section surface rather than replacing its background, gradient, image, or texture.
- The effect must remain decorative and never compete with headings, links, cards, or CTAs.

## 2. Absolutely restricted scope

**Implement only the background dot animation in the designated section.**

- Preserve all current text, headings, media, assets, images, fonts, typography, padding, margins, width, grid, animations, responsive breakpoints, interactions, accessibility, and content order.
- Do not add a new section, navigation control, headline, card, hero, button, tooltip, or demo content.
- Do not change global theme tokens or CSS variables; read/reuse the existing ones.
- Do not change the section's existing background fill or gradient.
- Do not install any package for this effect: **Canvas 2D + standard browser APIs are sufficient**.
- Do not insert dots into every section or into the global page background.
- Do not modify unrelated components to make the animation work.
- If a specific section cannot be identified from Cursor's current selection or task context, request its component/path rather than guessing and applying the effect site-wide.

## 3. Layer composition

The existing section is the positioning context. Add one canvas-only decorative layer, with normal section content above it.

```text
existingSection (position: relative; preserve current styles)
  DotFieldBackground (absolute inset-0; z-index: decorative layer)
    canvas (fills section; pointer-events: none; aria-hidden)
  existingSectionContent (unchanged and above background)
```

- Use `position: absolute; inset: 0; width: 100%; height: 100%` for the canvas layer.
- Scope painting to the chosen section's bounds; do not paint into neighboring sections.
- Make the decorative canvas `aria-hidden="true"` and non-focusable.
- `pointer-events: none` on the canvas so existing buttons, links, hovers, selections, and scroll behavior work normally.
- Observe pointer motion on the **section container**, not on the canvas.
- Make only the minimum CSS positioning changes needed to establish the layer. Respect existing stacking contexts. Avoid global z-index overrides or a new ancestor stacking context if it changes overlays.
- If the section has irregular masking or rounded boundaries, follow its existing clipping treatment without clipping content or focus rings.

## 4. Dot-grid geometry

Use a **single HTML Canvas 2D** surface instead of hundreds of React/SVG/DOM elements.

- Initial grid spacing: **30 CSS px**. Tune only if required for the actual section dimensions or product visual hierarchy.
- Center or consistently anchor the grid so dots do not visibly jump when repainting.
- Calculate grid positions from the **measured section/canvas dimensions**; no hardcoded viewport widths or heights.
- Render at the current device-pixel ratio (cap effective DPR around 2 for reasonable memory cost), while measuring and interacting in CSS pixels.
- Recalculate grid dimensions on section resize via the existing layout system or one scoped `ResizeObserver`.
- Never stretch a low-resolution canvas with CSS and allow blurry dots.
- Use circles with antialiasing; avoid heavy `shadowBlur`, DOM filters, and expensive per-dot gradients.

## 5. Cursor proximity behavior

On `pointermove` for a fine/hover-capable pointer:

1. Convert pointer coordinates into the **section-local coordinate space**.
2. For each dot, compute its distance from the pointer.
3. Apply a smooth, distance-based influence up to **130 CSS px** from the pointer.
4. Nearby dots brighten and enlarge; optionally displace slightly radially outward to reproduce the gentle **parting** sensation in the reference.
5. Outside the influence radius, draw dots in their normal state.
6. Smoothly interpolate the visual response so the effect follows pointer movement without abrupt jumps.

Recommended effect math (illustrative, not an instruction to create extra abstractions):

```ts
const proximity = Math.max(0, 1 - distance / cursorRadius);
const influence = proximity * proximity;
const dotRadius = baseDotRadius + influence * radiusBoost;
const dotAlpha = baseOpacity + influence * opacityBoost;
// Optional small radial displacement: ~0–4px at maximum influence.
```

- Start tuning with `cursorRadius = 130`, `baseDotRadius = 1.2`, `radiusBoost = 1.1` (CSS px).
- Use a light easing/interpolation response of roughly **120–220ms**; tune by eye to match the reference's smooth pocket of motion.
- On `pointerleave`, ease the influence back to zero, then stop animation frames after the base state is reached.
- Do not create a large hard-edged spotlight ring, opaque color overlay, ripple on click, particle trails, autonomous drifting dots, mouse-following DOM element, or page-wide glow.
- If existing foreground elements intercept pointer activity, tracking on their section ancestor should still update the effect without changing their events.

## 6. Runtime and performance

- Prefer server rendering for the actual **section**; put canvas drawing, pointer handling, and resize logic in the smallest necessary client component.
- Keep drawing values in refs/plain local drawing state; **do not call React state setters on every frame or pointer movement**.
- Use at most **one `requestAnimationFrame` loop per mounted dot field**, with correct cancellation and cleanup.
- Render a static base grid initially. Draw active frames **only while responding to pointer movement or easing back to idle**. Do not run an endless idle RAF loop.
- Use `IntersectionObserver` or an existing scoped visibility mechanism only if needed to suspend work while the section is off-screen; avoid duplicate observers/systems.
- Keep pointer handlers cheap: update stored coordinates; do proximity calculations during drawing, not in event handlers.
- Repaint/reset safely when section size or relevant theme color changes; no stale canvas dimensions.
- Do not start an additional GSAP/Lenis/Framer Motion scroll engine; this effect has **no scroll-driven animation**.
- Implement proper cleanup for listeners, animation frames, `ResizeObserver`, and visibility observers when unmounted.
- Preserve section height and media geometry; the effect must not contribute to layout shift.
- Target smooth input responsiveness on desktop without claiming a guaranteed frame rate on all devices.

## 7. Responsive, accessibility, and input behavior

- **Desktop fine pointer:** interactive proximity effect.
- **Mobile/coarse pointer:** render a calm **static dot grid**; avoid touch-follow interactions and extra battery use.
- **Keyboard:** never rely on dots to convey information; original keyboard controls remain usable and visible.
- **`prefers-reduced-motion: reduce`:** show the static dot grid, do not run proximity animation or an ongoing RAF loop.
- **JavaScript unavailable:** section content remains completely functional; the existing section background remains intact.
- Do not obscure text contrast, alter accessible names, interfere with click/tap/selection, or introduce horizontal overflow.
- Respect the site's existing dark/light theme behavior. The dot color should respond if the relevant theme token changes.

## 8. Architecture and project rule precedence

Before coding, Cursor MUST inspect the existing repository, target section, design tokens, current font setup, animations, and the project's production engineering instructions (including `NEXTJS_FRONTEND_PRODUCTION_RULES.md` if present).

- Follow existing Next.js App Router conventions and feature-based architecture; do not invent a new directory tree when an appropriate feature folder exists.
- Follow **SOLID where applicable, DRY, KISS**, strict TypeScript, stable naming, and purposeful code.
- **Maximum 300 physical lines per authored file**, including comments and blank lines. Split files only along real cohesive responsibilities.
- Use `PascalCase` for the React component, `camelCase` for variables/functions, and existing naming conventions for hooks/style files.
- Prefer a small dedicated `DotFieldBackground` component next to the owning section. Make it generic only if there is a real second consumer.
- Never ship prototype/placeholder code, stub callbacks, fake runtime data, unused props, decorative controls, or an unnecessary abstraction layer.
- Do not add an admin schema or CMS field only for the effect; existing feature flags/configuration can be reused when truly required by the current project.
- Reuse project styling conventions; avoid global CSS edits, `!important`, new animation packages, and changes to the section's original typography/colors.
- If repository rules conflict with this animation spec, preserve higher-priority project rules and report the conflict rather than silently overriding them.

## 9. Validation checklist

- [ ] Dots appear **only behind the chosen section**, within its existing bounds.
- [ ] Existing content, typography, assets, layout, spacing, colors, and other animations are unchanged.
- [ ] Grid is precise, evenly spaced, sharp on high-DPI screens, and responsive to resize.
- [ ] Near-pointer dots brighten and swell (and gently part if tuned); distant dots stay static.
- [ ] Pointer movement is fluid; leaving returns the field to its quiet state without popping.
- [ ] Existing CTA/button/card pointer interactions are unaffected.
- [ ] No constant idle animation, React rerender loop, canvas leak, or global pointer tracking.
- [ ] Reduced-motion and touch devices receive a still, non-distracting dot field.
- [ ] No text contrast regression, clipping, horizontal overflow, hydration warning, or layout shift.
- [ ] Verify at typical desktop, tablet, and mobile widths and after theme/section resize.
- [ ] Run the project's actual formatting, lint, TypeScript, relevant checks, and production build; report any check not executed.
- [ ] Show a concise diff summary limited to the intended section and its tiny background component.

## 10. Ready-to-paste Cursor command

> Implement `dot-field-background-design.md` in the **currently selected existing section only**. Use https://www.componentblocks.com/blocks/bg-dot-field as the visual/behavior reference: a subtle 30px-spaced Canvas 2D dot grid with a 130px cursor-proximity radius; dots smoothly brighten, slightly enlarge, and gently part near the pointer, then return to rest. Preserve this section's exact current typography, content, assets, colors, padding, dimensions, z-index behavior, and all other animations. Use existing project color tokens, and do not add dependencies or alter other sections. Keep the field behind all interactive content and pointer-events disabled on the canvas. Honor touch/reduced-motion preferences, clean up listeners/RAF, and avoid continuous idle rendering. Follow the repository's production-ready rules, feature architecture, strict TypeScript, and 300-line maximum per file. Implement fully, validate responsive/interactive states, and report the files changed and checks run.
