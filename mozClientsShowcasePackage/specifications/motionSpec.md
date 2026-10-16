# Motion Spec — MOZ Client Rail

This is a **reconstruction target** derived from a still screenshot, not an instrumented recording of the Clapat original.

## Priority and timeline

1. **Scroll progress** supplies a float `position` from `0` to `n - 1`.
2. A measured rail transform keeps `position` inside the stage focus region, which sits near **48%** of stage height.
3. A continuous focus envelope computes each name's opacity. Near the middle of a transition, two names may be almost fully white simultaneously.
4. When the rounded index changes stably, crossfade the logo tile (0.28s) and optionally the verified quote (0.22s).
5. Pointer hover temporarily previews hovered index but never alters rail position.
6. Keyboard focus has priority over pointer hover; explicit focus displays the name and preview.
7. On leaving/focusout, restore current scroll progress rather than resetting to first item.

## GSAP / CSS value recommendations

| Channel | Value | Constraint |
|---|---:|---|
| Scroll `scrub` | 0.65 | Existing scroll engine must have one owner |
| Name inactive opacity | 0.30 | Decorative; increase on mobile |
| Max highlighted items | 2 | Adjacent items only |
| Hover tint duration | 0.22s | `power2.out` |
| Preview crossfade | 0.28s | `power2.out`; swap on stable index change |
| Preview entrance Y | 8px | No scale burst |
| Quote crossfade | 0.22s | Only with approved per-client quote |
| Desktop pin end | `(n-1)*0.42*viewportHeight` with min `2*viewportHeight` | Tune with actual UX testing |

## No-jitter requirements

- Never compute active index directly from small changing mouse-distance deltas; use scroll index + hysteresis.
- No hard snapping when wheel reverses.
- No unbounded GSAP tweens; kill/overwrite prior preview transitions.
- All list item measurements cached and refreshed only after size/font changes.
- Reverse scroll must restore earlier image selections correctly.

## Static/degraded behavior

- Small datasets (1–2 clients): no pin.
- Reduced motion: no pin, no transform animations, all names in natural flow.
- Small or low-height screens: static readable name list with tap-select preview and quote after list.
