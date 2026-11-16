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
- SVGs animate with CSS only and respect `prefers-reduced-motion`.
- Real photos uploaded in the admin CMS always override these defaults.
