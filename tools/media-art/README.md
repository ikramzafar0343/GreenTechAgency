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

Entrance animations stay paused until the root `<svg>` has class `play`
(added by `Frontend/src/shared/media/PlayOnViewSvg.tsx` when the art scrolls into view).

| Class | Role |
|-------|------|
| `tw` | Typewriter: bars scale in from the left (`--i` stagger) |
| `draw` | Stroke draw via `pathLength="1"` + dashoffset |
| `area` | Chart fill fade-in under a drawn line |
| `rise` | Bar charts grow from the baseline |
| `ring-draw` | Progress ring reveal |
| `st` | Soft stagger (opacity + lift) for chrome / cards |
| `pop` | Endpoint / node pop after a draw |
| `fl` / `fl2` / `pu` / `da` / `sp` | Ambient float / pulse / dash / spin after entrance |

Without `play` (and with reduced motion), illustrations render in their finished state.
