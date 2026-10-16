# Motion, Responsive Behavior and Accessibility Contract

## Transport decision

The extracted homepage renders the same sequence of impact statements twice; a duplicated horizontal rail is therefore a reasonable implementation technique. However, no still screenshot can prove exact runtime animation behavior. The recommended production implementation uses a clean CSS linear marquee on desktop, static touch swipe on mobile, and no movement for reduced-motion settings.

## Desktop (`min-width: 1024px`)

- Container: `width:100%`, `overflow:hidden`, no document-width increase.
- Rail: flex `width:max-content`, two equal `.group` children.
- Group: `display:flex; gap:16px; padding-right:16px`; padding ensures inter-group seam equals internal gap.
- Animation: `transform:translate3d(-50%,0,0)` from 0 to -50% of full track width, because groups are equal.
- Target velocity: 58 pixels/second, not a claimed reverse-engineered speed; duration derived from visible card count and approximate card+gap width.
- Timing: `linear`, infinite; no spring, easing stop, clip-path distortion, fades or snap transitions.
- Offscreen: IntersectionObserver starts/stops playback to avoid useless motion.
- Pointer hovering on rail: pause CSS animation. Keyboard focus inside: pause also.
- Do not add invisible visual overlay intercepting pointer events.

## Tablet (`768px` to `1023px`)

- ~380px cards, 16px gap, tall 500px, medium 350px, compact 248px.
- Prefer manual horizontal snap/swipe for tablets with coarse pointers; no hover-only behavior.
- On hybrid devices, if autoplay is on, the transport must remain usable with a touchpad or touch input; native overflow strategy is preferable where touch predominates.

## Mobile (`max-width:767px`)

- No marquee animation; hide decorative repeat group.
- Native `overflow-x:auto` with `scroll-snap-type:x proximity` or `mandatory` depending on actual use tests.
- `-webkit-overflow-scrolling:touch`, `overscroll-behavior-inline:contain`.
- 12px gaps, card width `min(84vw,360px)`, 24px inset.
- 460/340/240px card heights. Maintain TOP alignment and white space below shorter cards.
- Keep the left and right safe gutters ~16px so the first card doesn't touch physical screen edge.
- Keyboard scrollable wrapper with a visible focus treatment when focus is applied.

## Reduced motion

- `@media (prefers-reduced-motion:reduce)`: `animation:none !important` on the track.
- Enable native overflow and snap; remove second decorative repeat.
- Hover zooms/underlines have minimal or zero animation.
- Ensure the first card is visible; no position stuck offscreen from paused translate.

## Visual debugging checklist

- Screenshot comparison viewport: 1591×635; cards y start match each other; measured y=77 in provided viewport (not section-global positioning).
- Pixel target tolerance ±8px width/height and ±2px card gap for first pass; typography/crop second pass.
- At 1440 desktop, the rail occupies edge-to-edge available width, not the centered intro width.
- At 375/390 mobile, text fits and CTA does not overflow its rounded corner.
- At browser zoom 200%, text can wrap; `min-height` for content cards to avoid overlap.
- Testing with keyboard Tab: every real CTA only once in tab order; duplicates not focusable.
- Tab focus visible; cards remain in logical DOM sequence.
- Screen reader announcement: section label once; duplicated cards entirely hidden.
- Images have meaningful alt or empty alt if text fully describes them.
- Use no autoplay for users requesting reduced motion.
- In Chrome/Safari/Firefox, loop seam should not jump or duplicate gaps.
- No layout shift while loading photos; Image fill parent fixed/min-height.
- Large images should be served in appropriately compressed formats.

## Runtime QA

Run lint, typecheck, build and cross-browser tests. Confirm CSS properties are scoped; check Chrome Performance panel while section is offscreen, watch mobile main-thread activity, and confirm there are no hydration warnings when cards are served from CMS. All result data must be verified before public release.
