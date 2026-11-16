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
motion drives itself: every class runs a **12s infinite** build–hold–clear cycle
(hold for most of the cycle), plus ambient float / pulse / dash / spin. Negative
`--i` stagger puts elements mid-cycle on first paint so the scene is never blank.

Rules are scoped to `svg[data-art]`. Reduced-motion users get the finished art
because all rules live inside the media query. Panels use stacked translucent
rects instead of a Gaussian drop-shadow filter to keep loop cost lower.

| Class | Role |
|-------|------|
| `tw` | Typewriter: bars scale in from the left (`--i` stagger) |
| `draw` | Stroke draw via `pathLength="1"` + dashoffset |
| `area` | Chart fill fade under a drawn line |
| `rise` | Bar charts grow from the baseline |
| `ring-draw` | Progress ring reveal |
| `st` | Soft stagger (opacity + lift) for chrome / cards |
| `pop` | Endpoint / node pop after a draw |
| `fl` / `fl2` | Ambient float |
| `pu` | Ambient pulse |
| `da` | Ambient dash travel |
| `sp` | Ambient spin |
