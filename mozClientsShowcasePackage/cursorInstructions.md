# Strict Cursor Instructions — MOZ Clients Section

**Implement the user-provided screenshot's dark client-name showcase inside the existing About page.** Read `design.md` and `specifications/motionSpec.md` completely before editing.

1. Audit the actual project's theme tokens, font system, About page, routing, data management, GSAP/ScrollTrigger and Lenis. Do not guess brand hex values or invent a new font.
2. Keep the reference composition exact: full-width near-black section; oversized vertical centered names slightly left-of-center; small light logo tile at left; tiny right-aligned quote near bottom-right. Preserve negative space, opacity contrast and typography proportions.
3. Reconstruct a natural vertical pinned-scroll movement on desktop with focus illumination of one/two names, synchronized left media, hover preview, reverse scroll restoration and seamless exit. Do not create a logo carousel or unrelated MouseTrail.
4. Implement fully readable flow on mobile, reduced motion and zoomed-in desktop. There must be no scroll trapping or invisible content.
5. Use verified existing client/logo/quote content. The demo Apple/Google/Panasonic/Logitech names are **reference only**: never falsely attribute those as the site's customers.
6. Feature-scope your code. Keep components under 300 lines each, enforce TypeScript, SOLID/DRY/KISS as applicable and project routing conventions. Do not modify unrelated sections.
7. Test at screenshot 1572×672 and relevant desktop/mobile breakpoints; check scroll down and up, text overlap, pin cleanup, keyboard focus, hydration, image loading and production build.
8. Report the files edited, sources of content/assets, tests passed and any departures from the reference or unverified animations.

**Do not call the task complete until the screenshot-match stage is visible in browser and its motion is actually tested.**
