# GreenTech media art generator

Generates every default illustration used in image/video frames across the site
(service pages, services hub, home carousel, about, why-choose, portfolio, impact,
insights and blog covers) into `Frontend/public/`.

```bash
python3 tools/media-art/build_media.py .
```

- Output is deterministic: the same input produces byte-identical SVGs.
- `media-manifest.json` lists every generated file with its alt text.
- Each service has its own set under `Frontend/public/services/editorial/{slug}/`.
- Real photos uploaded in the admin CMS always override these defaults.

## Motion contract

SVGs ship CSS-only motion and respect `prefers-reduced-motion`.

The art is served through `<img>`, where no outside script can reach it, so the
motion drives itself the instant the image paints. Each animation runs **once**
and settles; stagger is capped under ~0.2s so cards do not sit blank before the
entrance. It must stay one-shot — a forever-looping image is re-rastered every
frame and stutters scroll. Panels use stacked translucent rects instead of a
Gaussian drop-shadow filter for the same reason.

Rules are scoped to `svg[data-art]`. `animation-fill-mode: backwards` holds the
start pose only through that short delay; every animation ends on the element's
own base style, so reduced-motion / old renderers still show the finished art.

| Class | Role |
|-------|------|
| `tw` | Typewriter: bars scale in from the left (`--i` stagger) |
| `draw` | Stroke draw via `pathLength="1"` + dashoffset |
| `area` | Chart fill fade-in under a drawn line |
| `rise` | Bar charts grow from the baseline |
| `ring-draw` | Progress ring reveal |
| `st` | Soft stagger (opacity + lift) for chrome / cards |
| `pop` | Endpoint / node pop after a draw |

`fl`, `fl2`, `pu`, `da` and `sp` are still in the markup but carry no rules: they
were ambient loops (float, pulse, dash, spin) and loops are what cost frames.
