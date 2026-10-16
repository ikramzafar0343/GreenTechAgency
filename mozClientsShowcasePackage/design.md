# MOZ Clients Showcase — Strict Production Design Specification

**Document:** `design.md`  
**Component:** `ClientsShowcaseSection`  
**Reference:** https://clapat.com/templates/moz/about.html  
**Scope:** Recreate ONLY the near-black **Discover / 03 / Clients** section from the supplied screenshot, in the existing About page.  
**Priority:** Reference composition → interaction parity → responsive stability → current design-system integration → performance/accessibility.  
**Stack:** Existing Next.js App Router + React + current typography tokens + GSAP/ScrollTrigger ONLY if already installed.  
**Naming:** React `PascalCase`; functions/variables/filenames `camelCase`; scoped CSS Module class naming consistent with current project rules.

> **Evidence boundary:** The supplied 1572 × 672 screenshot is authoritative for visible geometry and color. An accessible MOZ deployment at `https://www.cyanstudio.com/about.html` confirms the section label, twelve ordered client names, multiple item images, and testimonial text, but does NOT establish precise animation behavior. The original clapat.com page returned HTTP 403 during automated inspection. All timing, scroll, activation and image-transition instructions in this document are carefully defined reconstruction targets, not claims of verified original source code.

---

## 00 — Non-negotiable outcome

Create one immersive, full-bleed, near-black client recognition section that looks like the reference during movement: a **centered, vertically moving typographic client rail**, a **small white square image tile on the left**, and a **tiny right-aligned testimonial in the bottom-right**. A narrow focus band makes one or two adjacent names brilliant white, while the remainder stay mid-charcoal gray. The rail moves vertically through natural page scrolling; a user can hover/focus a name to preview it. Motion is restrained and continuous, without carousels, rotating cards, marquee motion, or unnecessary flourishes.

**Do not implement:** a standard client-logo grid, an infinite marquee, a swiper of company logos, a horizontal ticker, 3D rotation, parallax particles, multiple floating logos, a full-screen background photograph, or another generic testimonials component. Do not add an oversized `Our Clients` heading inside the black canvas; the MOZ reference keeps hierarchy mostly in the moving client names.

The current **employee carousel**, **MouseTrail**, **pinned services section**, site-wide header/footer, and other pages must remain untouched.

---

## 01 — Source audit and fidelity

### 1.1 Screenshot observations (verified visually)

- Screenshot resolution: **1572 × 672 px**.
- Uniform background: approximately `#0C0C0C` sampled from screenshot.
- A tall client-name column sits **slightly left of the physical viewport center** to balance the right testimonial.
- Name type has a modern sans-serif appearance, approximately **64–68px** on this viewport, normal/medium weight, tight letter spacing; one name per row.
- Inactive items look roughly `#505050` against the black background.
- At this captured instant, **Panasonic** and **Logitech** are near-white; **Sony** immediately above and **Hama** below are muted. Two adjacent names can occupy the active/focus band at the same time.
- The list extends beyond the top and bottom of the visible canvas, giving the impression of continuous vertical scrolling. DeepSeek appears near the cropped top edge, Webflow near the lower portion.
- Left preview: **x≈66–209, y≈238–375**; near-square **143 × 137px** white rectangular tile with a restrained centered logo/graphic; no rounded card styling or shadow.
- Right quote: around **x≈1200–1522, y≈523–594**, small light-gray uppercase or mono-looking text, right aligned; author beneath in small brighter type.
- Canvas uses generous negative space, no border boxes around names, and no overlay gradients that obscure the text.
- The screenshot shows a faint circle over the lower list. That alone does **not** prove a permanent decorative element; do not add a large permanent circle unless already supplied by the site's cursor system.

### 1.2 Text structure checked against accessible mirror

The MOZ section is labelled **Discover / 03 / Clients**, and contains this order in the reference (for comparison **only**):

`Apple → WordPress → Google → DeepSeek → Intel → Toyota → Sony → Panasonic → Logitech → Hama → ClaPat → Webflow`

A small testimonial and attribution appear below/alongside it. **Do not copy these brand names or testimonial to the customer's live site without verified permission, relationship, and content approval.** Use the site's real clients or accurately labelled *Partners / Platforms / Selected Work* if the relationships are different. Do not invent quotes or endorsements.

### 1.3 Original-vs-reconstruction distinction

Verified: reference placement, monochromatic palette, relative scale, active/inactive contrast, preview image, quote placement, client order and content hierarchy.  
Specified reconstruction: pin duration, list interpolation, input priority, crossfade timing, two-item focus window, edge snapping, and mobile fallback.

---

## 02 — Visual hierarchy and section placement

- Insert this section **after the Awards / Recognition area** and **before the final Let's Talk CTA**, following the About page reference.
- Render as a true full-width dark interval, no default content-max-width on its background.
- The optional small editorial section label (`Discover / 03 / Clients`) may appear **above** the interactive stage according to the existing About page's label pattern; do not float a new heading over the names if the label already exists elsewhere.
- Stage should read as a self-contained dark scene; the previous light section ends cleanly at the boundary, and the next light CTA begins only when this section releases scrolling.

### Desktop geometry at reference viewport 1572×672

| Element | Target | Rationale |
|---|---|---|
| Stage background | `#0C0C0C` | Screenshot-matched inverse panel |
| Stage height while pinned | `100svh`; recommended minimum **560px** | Viewport-filling chapter |
| List horizontal center | ~`45%` of stage width | Reserves right quote |
| List focus vertical line | ~`48%` of stage height | Matches bright band |
| Client font | `clamp(3rem, 4.2vw, 4.25rem)` | Approx 66px screenshot |
| Name row line-height | `1.03–1.10` | Compact stack |
| Name letter-spacing | `-0.045em` to `-0.03em` | Editorial, not geometric spaced |
| Inactive text color | approx `#505050` | Muted gray |
| Active text color | approx `#F7F7F7` | Brilliant neutral white |
| Brand tile | `clamp(110px, 9.1vw, 144px)` square-ish | Left floating preview |
| Tile left offset | `4.2vw` (min 24px) | 66px at reference |
| Tile vertical placement | `~45.5%` stage center | Screenshot center y≈307 |
| Quote width | `min(320px, 23vw)` | Lower-right compact copy |
| Quote right offset | `3.2vw` (min 24px) | Right edge breathing room |
| Quote bottom offset | `clamp(44px, 10.7vh, 76px)` | Caption visible at bottom |
| Quote font | ~`10–11px` | Deliberately subordinate |
| Attribution font | ~`11–12px` | Human-readable identifier |

Measurements are targets for 1572px; adapt with CSS `clamp()`, `svh`, `dvh` where safe, and dynamic content dimensions, not brittle globally fixed pixels. At 1024px–1199px, list should remain centered within the available lane and quote/preview must never overlap names.

---

## 03 — Layer map (visual stack)

**Layer 0 — background:** full-bleed near black, no grid/noise/border/shadow. Use the site's dark/inverse background token if one exists and remains visually consistent with the reference; otherwise scope `#0C0C0C` exclusively to this section.

**Layer 1 — name rail:** visible in the center, clipped softly/cleanly at stage top and bottom. Each row is real text; never rasterize the names into an image/canvas. No giant gradients over active text.

**Layer 2 — preview tile:** small media container anchored on the left, within section bounds. Content centered, `object-fit: contain`, neutral/light background only when consistent with provided client asset. No hover enlarging the card into a huge slab.

**Layer 3 — testimonial:** right-aligned, bottom-right, visually secondary. Prevent quote line lengths exceeding about 36–45 characters on desktop. A subtle fade or crossfade is allowed when an approved per-client quote exists. Keep it stable otherwise.

**Layer 4 — pointer interactions:** pointer hit targets over names; do not let image/quote overlays intercept scroll or hide names. Existing site cursor works unchanged; avoid double-custom-cursor effect.

---

## 04 — Client-name rail: each individual item

### Default state

- One name per logical row; center alignment.
- Use site font family (`font-family: var(--font-body)` or project-resolved equivalent); **do not import a new font**. If the site uses a display font but the reference look requires clean sans, choose the closest already loaded family.
- Font weight 400–500, not bold 700.
- Color approximately white at **25–35%** opacity or measured `#505050`; preserve minimum active contrast.
- No underline, outline, divider or colored bullets.
- White space above/below comes from line-height, not `margin-block` on each item.
- `white-space: nowrap` on desktop only when text fits; for long names use adaptive font sizing, never crop characters.

### Active / near-focus state

- At each scroll position, one **primary** name is the focus anchor; optionally one adjacent name remains bright to match the screenshot's two-line highlight band.
- At reference-like progress, Panasonic and Logitech can both appear white. Do not make all visible labels white.
- Smoothly interpolate brightness using scroll proximity rather than abruptly toggling a class every frame.
- No scale bounce; allow a maximum **1.00–1.015** scale if necessary and only from center; default scale 1.
- Brightness transition target: 0.20–0.35s when hovered and `scrub`-linked when scrolling.
- When focus passes to another client, older names fade toward gray and incoming names become white.

### Hover / keyboard focus

- Hover on a name may temporarily override the scroll focus and update the tile; user must **not** lose page scrolling or trigger an unexpected jump.
- Pointer exit restores the scroll-derived focus, with no snap, glitch or sudden unmount.
- `focus-visible` receives same visual treatment as hover with a visible yet restrained accessibility ring/underline for keyboard users.
- Names must not look clickable unless each has a real destination; otherwise use buttons for interactive preview controls with explicit aria labels, not empty anchors.

---

## 05 — The left logo / project preview tile

### Appearance

- Reference: a light, nearly white `143×137px` small rectangle around x66, y238.
- Default preview background should be token-based neutral light (`#F7F7F7` suitable to screenshot), **not brand-colored** unless a real client case study needs that background.
- Position fixed **within the pinned stage**, not viewport fixed outside the section.
- Media centered with `object-fit: contain` and internal padding 18–26px; allow transparent SVG/WEBP/PNG logos.
- Sharp or near-sharp corners (`0–2px`); absolutely no rounded 24px cards, borders, shadows or glow.
- If media is a photograph, use project-provided cover image with appropriate crop and verified rights; logo is preferred for visual parity.

### Media changes

- On focus index change, perform a **crossfade** (`opacity 0 → 1`) plus an optional tiny `y: 8px → 0` transform.
- Target 0.24–0.34s with `power2.out` (or existing easing token); update at most once per meaningful index change. Never request a new image on each wheel tick.
- Preload active/next media and use `next/image` with sensible sizes; use a single foreground/background swap or two stable DOM image layers.
- If no real image is approved, keep a clean typography monogram derived from the *real* client name, not a random external brand asset; hide blank `<img>` elements.

---

## 06 — Bottom-right testimonial

- Anchor inside stage bottom-right, independent of list transform.
- Text small, uppercase if editorial style matches screenshot; use the site's existing mono face **only if already loaded**, otherwise current sans at about 10.5px, letter spacing `0.01em`, line-height `1.45`.
- Muted gray text, stronger near-white attribution.
- Keep testimonial in a **semantic `<blockquote>`** and the attribution in a `<cite>`; no external quote marks needed unless site already uses them.
- Maximum width **320px** on reference desktop, right aligned.
- Testimonial can be **global** to the section, as in the screenshot, or per-client if real attributed quotes exist; do not attach one customer's quote to different logos.
- Crossfade text 0.22s only when replacing with another approved quote; respect reduced motion.
- If no approved quote exists, replace with a short factual section descriptor (e.g. *Selected collaborations*) and omit attribution entirely. Never invent Mark Spencer or reuse his words as a real endorsement.

---

## 07 — Scroll behavior and animation state machine

**Primary interaction:** natural document wheel / touchpad / scroll, not mouse wheel hijacking.

### Desktop (`min-width: 1024px` and fine pointer when sufficient space)

1. User scrolls into the section from Awards. The black panel takes the viewport; the rail becomes visible.
2. Stage **pins** while scrolling advances through the ordered names.
3. Rail is translated vertically so the progressively focused name remains in a central focus band (~48% viewport height).
4. Nearby names fade in/out of brightness as the focus crosses them; target one bright primary plus optional bright neighbor during in-between progress.
5. The small left preview tile updates to the relevant focus name; quote stays visible and stable, unless an approved per-client quote exists.
6. On last name, pin releases into the CTA with **no excess dead scroll** and **no blank frame**.
7. Reverse scroll must restore exact prior rail positions, highlights and preview content, including when coming back from the CTA.

### Suggested GSAP ScrollTrigger settings (reconstruction, not extracted)

- Use **existing GSAP/ScrollTrigger** installation if present; no second GSAP instance, no unnecessary smooth-scroll package.
- Isolate scope via `gsap.context()` / `@gsap/react` if already in project; cleanup/revert on unmount and route changes.
- `trigger`: section root; `start: 'top top'`; `pin: true` if layout allows; `pinSpacing: true`; `anticipatePin: 1`.
- `scrub`: `0.5–0.8` seconds of smoothing; starting target `0.65`.
- `end`: function of number of items and available viewport, e.g. `max(2 * vh, (itemCount - 1) * 0.42 * vh)`; revisit after actual browser testing to avoid very slow scrolling or insufficient reading time.
- The list y-offset MUST be computed from DOM measurements (actual row centers vs focus line), not hardcoded `index * 68px` for all breakpoints.
- Derived float `position = clamp(progress * (count - 1), 0, count - 1)`.
- Selected index for tile `Math.round(position)`, with a small hysteresis band (~0.10–0.15 of a row) to prevent repeated image swap at the midpoint.
- Brightness per item: distance from current float position; use continuous interpolation with a **two-item focus envelope**, so two neighboring names can appear white, as in the reference frame. Map proximity to opacity/contrast, not to expensive filters on many elements.
- If count is `0`: **do not mount** decorative showcase; do not pin blank stage. If count is `1–2`: disable pin and show static list with preview/description.

### Focus transfer formula (illustrative specification)

```
const distance = Math.abs(itemIndex - scrollPosition);
const intensity = 1 - clamp((distance - 0.1) / 1.25, 0, 1);
const textOpacity = inactiveOpacity + intensity * (1 - inactiveOpacity);
```

Target inactiveOpacity ~0.30. Tune the active window so at least one name and at most two adjacent names are near-white at a time. **Do not** use `ScrollTrigger` instance per name; use a single controlling timeline/trigger for this section.

### Important ScrollTrigger integration constraints

- Check whether the previous **PinRotateSections** is already pinned. Each section owns exactly one pin; no nested pinned ancestors; avoid React portals for the stage.
- For sites using Lenis: register the existing integration/scrollerProxy already in place; do not add duplicate `requestAnimationFrame` loops.
- Recalculate offsets with `ScrollTrigger.refresh()` on breakpoint change, fonts ready, CMS list length change and layout resize — use efficient event handling, not continuous resize polling.
- Prevent pin spacer layout shifts and maintain an accurate section boundary into the CTA.
- Limit React state changes from scroll events: animate transforms/opacity via GSAP directly; update selected React index only when the rounded index actually changes. No per-frame React render.

---

## 08 — Hover interactions (secondary, never replaces scrolling)

- Hovering a center name brightens that item to white within ~0.20s and previews its real logo on the left.
- The remaining list stays anchored; hover never scroll-jumps to clicked/hovered item.
- On mouse leave, restore the GSAP-derived focused index smoothly within ~0.24s.
- Clicking a name is optional; if enabled, animate to its corresponding scroll position ONLY when this is safe and predictable; otherwise click simply selects preview.
- For pointer movements across neighboring items, cancel previous tween instead of stacking 12 overlapping fade animations.
- Existing MouseTrail from earlier About section must **not** activate over this client-name canvas unless that is an explicit existing site-wide behavior. Never create a new MouseTrail inside the showcase.

---

## 09 — Desktop responsive rules

### Wide desktop `>= 1440px`

- Reference composition: left 4.2vw tile, names centered ~45%, small quote right 3.2vw bottom.
- Names 60–68px; row height ~69–74px.
- Left tile ~135–144px, right quote 280–320px.
- Stage 100svh while pinning; keep black panel continuous through its scroll distance.

### Laptop `1200–1439px`

- Names `clamp(47px, 4.3vw, 62px)`; tile 116–132px; quote 240–280px.
- Move list slightly toward the midpoint if necessary to keep text and quote apart.
- Use CSS grid or anchored columns with `minmax`; do not accidentally clip Logitech/Panasonic lengths at 1280px.

### Small laptop / tablet landscape `1024–1199px`

- Names `clamp(42px, 4.4vw, 54px)`.
- Tile approximately 105px; quote max 220px, 10px text.
- If the longest actual client label would collide with the quote, switch to stacked/collapsed preview/quote mode rather than shrinking text below legibility.
- Disable pin automatically if available height is <560px or user has reduced motion.

---

## 10 — Mobile and tablet portrait responsive design

### Tablet portrait `768–1023px`

- Default **no pin** unless proven comfortable in real devices; use an overflow-safe, progressively highlighted vertical list with a single preview below/alongside the focused item.
- Names `clamp(36px, 6.2vw, 50px)` and centered. No clipped letters at edges.
- Tile 95–112px, positioned as a separate grid cell, not absolutely over names.
- Quote moves beneath rail with left/right text alignment matching local space; use 12–13px readable font.
- Optional short scroll-linked highlight on entering view without consuming multiple screenfuls.

### Mobile `<= 767px`

- **No long pinned scroll chapter.** Normal page scrolling and accessible, tap-friendly client selection.
- Background remains `#0C0C0C`; retain dramatic white/charcoal type hierarchy.
- Name size: `clamp(30px, 8vw, 44px)`; center aligned; line-height 1.1; width `calc(100% - 32px)`.
- Show 4–6 names in initial mobile viewport, with remaining names readable on normal scrolling; do not trap user inside the rail.
- Tap name changes its active state and real asset preview; no hover assumption.
- Preview tile appears in a separate centered or start-aligned block sized ~96–120px (not under fixed left absolute x positions); keep brand-name and preview visible together when possible.
- Testimonial goes **below** the list or at section end, not an overlapping absolute block; use left-aligned 12–14px and attribution below.
- No horizontal page scroll. Respect safe areas and browser chrome using natural document flow.
- Name interaction targets >=44px height; keyboard traversal visible and logical.

### Short-height devices and zoom

- Avoid `overflow: hidden` clipping the complete page; use clipping only for the visual desktop rail viewport.
- At 200% zoom, disable pin or switch to the non-pinned layout so names, preview, and quote remain reachable.
- At landscape mobile heights 360–500px, no pin; avoid 100vh-plus-fixed absolute children.

---

## 11 — Theme and color system (strict)

This component **inherits the current project's fonts** and compatible color tokens; it does not replace typography across the website. It preserves the visual experience of the screenshot by giving this single section an inverse dark treatment.

Suggested local token aliases (map first to existing tokens; scoped fallbacks ONLY if absent):

```css
.clientsShowcase {
  --clientsStageBg: var(--surface-inverse, #0c0c0c);
  --clientsTextActive: var(--text-on-inverse, #f7f7f7);
  --clientsTextMuted: #535353; /* screenshot-matched decorative inactive text */
  --clientsTileBg: #fafafa;
  --clientsQuoteMuted: #858585;
  --clientsFocusColor: var(--brand-accent, #f7f7f7);
  background: var(--clientsStageBg);
  color: var(--clientsTextActive);
  font-family: inherit;
}
```

- Do not assume the project is using `#204E4A` / `#E1E53F` or cyan: **inspect the actual project tokens** before implementation. Previous projects are not evidence of this project's current palette.
- Accent color can be used *sparingly* for keyboard focus. For visual parity, active client names stay white rather than becoming bright cyan/purple/lime.
- **No** global `body` color changes, utility overrides, CSS reset changes, new font packages, or unrelated theme adjustments.

---

## 12 — Content data / CMS fields

Use existing content architecture and admin service if available; only introduce a new feature-scoped model if necessary. **User's actual clients and testimonials must be authoritative.**

```ts
export type ClientShowcaseItem = {
  id: string;
  displayName: string;
  sortOrder: number;
  isPublished: boolean;
  logo?: { src: string; alt: string; width: number; height: number };
  logoBackground?: string; // approved/project-provided only
  caseStudyUrl?: string;   // only when an actual published case study exists
  quote?: string;          // verified, attributable
  quoteAuthor?: string;
  quoteRole?: string;
};
```

**Admin capabilities:** reorder, publish/hide, edit name, upload logo, set alt, optional case-study link, enter verified quote/author; preview desktop/tablet/mobile; validation on image dimensions/MIME/type; protect against empty labels and bad external URLs.

**Policy:** Never automatically populate Apple, Google, Intel, DeepSeek, etc. as client relationships based on the MOZ demo. If the user's project has fewer than 3 verified clients, render a plain minimal collaborator/technology section with accurate labeling rather than a fake wall of logos. Sample data is permitted only in isolated development/story fixtures, never shipping as factual customer relationships.

**Quote integrity:** If the section has one globally approved testimonial, store it on the section-level settings rather than copying it onto every client record.

---

## 13 — Next.js component architecture

Preferred feature scope (adapt to existing folder conventions):

```text
src/
  features/
    clientsShowcase/
      components/
        ClientsShowcaseSection.tsx
        ClientNameRail.tsx
        ClientPreviewTile.tsx
        ClientQuote.tsx
      hooks/
        useClientShowcaseMotion.ts
      clientsShowcase.module.css
      types.ts
```

- Server-render section shell + names where possible, then client-side only for interactive motion.
- Do not make entire About page a client component merely for this interaction.
- `ClientsShowcaseSection` owns data and section scope; `ClientNameRail` renders semantic list and labels; `ClientPreviewTile` owns asset swapping; `ClientQuote` owns approved quote; hook isolates GSAP timeline and cleanup.
- Preserve existing file max size rule: **300 lines per file**.
- Don't introduce unnecessary state libraries, Swiper, Three.js, custom Lenis instances, requestAnimationFrame loops, fake skeleton loaders, placeholder code, `any`, noisy debug logs or direct querySelector against other sections.
- Validate `/about` route rendering, RSC/client boundaries, `next/image` remote config if approved assets use remote domains, and clean hydration.

### Suggested semantic markup

```tsx
<section className={styles.clientsShowcase} aria-labelledby="clientsHeading">
  <h2 id="clientsHeading" className="sr-only">Selected clients</h2>
  <div className={styles.stage}>
    <div className={styles.previewColumn}>{/* client preview */}</div>
    <ul className={styles.names} aria-label="Clients">
      {/* <li key={item.id}><button ...>{item.displayName}</button></li> */}
    </ul>
    <div className={styles.quoteColumn}>{/* approved quote */}</div>
  </div>
</section>
```

- If names are not selectable, use non-interactive `<span>` instead of a fake button; scroll selection remains visual.
- For selectable names use `aria-pressed` **only when semantically toggleable**, otherwise simple accessible buttons with `aria-label="Preview [company]"` and a non-intrusive live region announcing selected company.
- Decorative image? Empty `alt` only when the company name is already adjacent and the image adds no new information.

---

## 14 — Motion parameters and conflicts

| Motion | Trigger | Target | Ease | Notes |
|---|---|---|---|---|
| Stage reveal | section entry | opacity 0→1, y 12→0 | 0.45s / power2.out | Skip if it would flash while pin starts |
| Rail translation | native scroll progress | translateY measured | scrub 0.65 | Reversible, no snapping |
| Rail item emphasis | proximity to active position | opacity ~0.30→1 | scrub | One or two near-white at a time |
| Hover emphasis | pointerenter | opacity →1 | 0.22s / power2.out | No rail jump |
| Preview swap | active item changes | crossfade + y 8→0 | 0.28s / power2.out | Only when index changes |
| Quote swap (optional) | approved quote changes | crossfade | 0.22s | Remain fixed if one quote |
| Section exit | last index reached | pin ends | natural scroll | No long empty tail |

**Do not run three independent GSAP timelines fighting over the same `transform`/`opacity`.** Rail movement and name illumination should be driven by one scroll progress value. Hover may temporarily override visual intensity only. Define deterministic input priority: keyboard selection > pointer hover while present > scroll focus.

### Reduced motion

At `prefers-reduced-motion: reduce`, disable GSAP pin, scrubbed translations, crossfades/parallax, and animations longer than 0.01s. Display all real client names in normal flow with readable contrast and the approved quote after them. Keyboard/tap selection may still update preview instantly.

---

## 15 — Performance requirements

- Animate **only** `transform` and `opacity` per frame (no per-frame `filter`, `left`, `top`, fontSize, DOM inserts or style recalculation loops).
- Keep layout thrash at initialization only; cache name centers and stage focus line, refresh on meaningful resize.
- Use React keys from verified stable item ids.
- Use Next/Image (`sizes="(max-width: 767px) 120px, 144px"`) or existing image wrapper for image files; SVG logo files can use appropriate safe handling per existing project policy.
- Lazy-load noninitial preview assets and avoid animated GIF backgrounds.
- Avoid layout shifts while images load by reserving tile dimensions.
- No unbounded list cloning/infinite DOM doubling. Maximum list length comes from real CMS content.
- Do not mount GSAP listeners on mobile reduced-motion mode.
- Clean up ScrollTrigger on route changes and when content/filter changes; pin spacer removed on teardown.

---

## 16 — Accessibility and discoverability

- Contrast of **active** words/interactive controls must satisfy WCAG AA where possible; inactive names are decorative but should remain legible enough to identify as content. On touch and reduced-motion non-pinned modes, increase all names to a readable contrast.
- Keyboard focus must be visible; `Tab` through selectable names and activate via Enter/Space.
- Do not hijack document wheel, preventDefault touch events, or lock body scroll.
- Announce active company changes only on **explicit user selection**; do not create an `aria-live` storm on scroll.
- Logos: accurate alt and aspect ratio; links have real destinations.
- No false claims about who is a client; only verified brands/logos/testimonials shown.
- Section has a semantic `<h2>` or visible/visually-hidden matching title and the right heading level.
- Avoid accidental low contrast of quote when theme tokens differ from reference.

---

## 17 — Acceptance tests / visual match checklist

### Visual at 1572×672

- [ ] Stage background near `#0C0C0C` edge-to-edge with no surrounding white gutters.
- [ ] Name list appears slightly left of center, uses existing font, approximately 64–68px text and compact rows.
- [ ] Active focus state can show **two adjacent white names**; all others gray.
- [ ] Left preview is small, light, square, around x66/y238 at reference screenshot proportion, not a giant logo card.
- [ ] Right testimonial appears in bottom-right, narrow and tiny; no big quotation-mark ornament.
- [ ] No accidental badge, borders, glow, CTA button or client-grid redesign.

### Interaction

- [ ] Scroll down: rail advances smoothly and only relevant items brighten.
- [ ] Scroll up: exact animation reverses, no stale active tiles.
- [ ] Hover each name: item and tile respond without scrolling or flicker.
- [ ] Leave name: scroll state restores.
- [ ] Last client exits into next CTA without blank section or pin collision.
- [ ] No JS hydration errors, duplicate React key errors, or GSAP uncleaned listeners.

### Responsive

- [ ] 1920×1080, 1572×672, 1440×900, 1366×768, 1280×720, 1024×768.
- [ ] 820×1180, 768×1024, 430×932, 390×844, 375×667, 320×568.
- [ ] No horizontal overflow, clipped company names, quote/name collision, or inaccessible controls.
- [ ] Mobile native scroll works; tap selects; quote in flow; no scroll trapping.
- [ ] 200% zoom and reduced-motion path remain usable.

### Content integrity

- [ ] Clients/logos come from verified site data, not MOZ demonstration names.
- [ ] All testimonials are approved and attributed correctly.
- [ ] Placeholder assets and demo testimonials absent from production build.

---

## 18 — Implementation sequence Cursor MUST follow

1. **Audit current project**: About page route, current component placement, CMS service, font variables, theme tokens, GSAP/Lenis setup, existing `PinRotateSections`, responsive breakpoints, project lint and production rules.
2. Read screenshot reference from `reference/mozClientsScreenshot.png` and build this stage in the correct order between Awards and CTA.
3. Implement static composition first and compare at **1572×672** before adding animation.
4. Integrate **real** client/partner data (only approved relationships). Build left preview and right quote with safe image handling.
5. Implement a **single** pinned vertical-scroll timeline on eligible desktop only, index-based preview updates, reversible progress, hover preview and keyboard/touch selection.
6. Verify mobile non-pinned content flow and reduced-motion layout.
7. Run TypeScript, ESLint, project tests and production build; inspect browser at target sizes and test both scroll directions.
8. Report exact changed files, real interaction implementation, image sources, screen sizes tested, warnings, and any still-unverified parity details.

### Definition of done

The result must be instantly recognizable as the screenshot's **dark, vertically focused client-name stage**, with polished scroll-tied emphasis and dynamic left media; it must not be merely a row/grid of logos or a simple opacity-on-hover list. The component must ship without false client claims, unrelated CSS changes, broken pinned scrolling or inaccessible mobile behavior.

---

## 19 — Source references

1. User-supplied exact section screenshot: `reference/mozClientsScreenshot.png` (visual authority).
2. ClaPat MOZ template page: https://clapat.com/templates/moz/about.html (HTTP 403 to automated inspection at audit time).
3. Accessible deployment containing matching MOZ About structure and client names: https://www.cyanstudio.com/about.html (content/section order corroboration, *not* live animation measurement).
4. ClaPat MOZ product feature information: https://themeforest.net/item/moz-agency-creative-portfolio-html-template/59550299 (states GSAP effects, scroll effects, dark/light variants, responsive layout; does not detail this specific interaction).

**Rights reminder:** Reimplement the original visual pattern and interactions with independent code and approved site content. Do not scrape/reuse the template vendor's proprietary source, unlicensed logos or claimed testimonials.
