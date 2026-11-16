"""Scene layouts: compose kit widgets into unique per-frame illustrations."""
from svgkit import (INK, MUTED, Canvas, browser, phone, chart, ring, code, nodes, person, search_bar, chat,
                    headset, cube, orbit, swatches, bezier, film, cart, doc, megaphone, panel, LINE)


def server(c, x, y, w, h, n=4):
    s = ['<g class="fl2">']
    rh = (h - (n - 1) * 14) / n
    for i in range(n):
        yy = y + i * (rh + 14)
        s.append(panel(c, x, yy, w, rh, 14))
        s.append(f'<circle cx="{x + 30}" cy="{yy + rh / 2:.0f}" r="7" fill="{c.a}" class="pu"/>')
        s.append(f'<rect x="{x + 54}" y="{yy + rh / 2 - 5:.0f}" width="{w * .45:.0f}" height="10" rx="5" fill="{MUTED}" opacity=".4"/>')
    s.append("</g>")
    return "".join(s)


def W_browser(c, x, y, w, h): return browser(c, x, y, w, h)
def W_code(c, x, y, w, h): return code(c, x, y, w, h)
def W_line(c, x, y, w, h): return chart(c, x, y, w, h, "line")
def W_bars(c, x, y, w, h): return chart(c, x, y, w, h, "bars", "fl2")
def W_server(c, x, y, w, h): return server(c, x + w * .1, y, w * .8, h, 4 if h > 300 else 3)
def W_doc(c, x, y, w, h): return doc(c, x, y, w, h)


def W_phone(c, x, y, w, h):
    pw = min(w, h * 0.5)
    return phone(c, x + (w - pw) / 2, y, pw, min(h, pw * 2))


def W_ring(c, x, y, w, h):
    r = min(w, h) * 0.32
    return panel(c, x, y, w, h, 26, "fl2") + ring(c, x + w / 2, y + h / 2, r)


def W_nodes(c, x, y, w, h): return panel(c, x, y, w, h, 26) + nodes(c, x + 30, y + 30, w - 60, h - 60, 8)
def W_search(c, x, y, w, h):
    k = max(1.0, min(2.0, w / 520))
    out = search_bar(c, x, y + h * .18, w, k)
    out += chart(c, x + w * .08, y + h * .18 + 76 * k + 40, w * .84, max(160, h * .82 - 76 * k - 40), "line", "fl2")
    return out
def W_chat(c, x, y, w, h):
    n = 4 if h > w * 0.6 else 3
    bh = min(150, h / (n * 1.3))
    return chat(c, x, y + (h - bh * 1.3 * n) / 2, w, n, bh)
def W_vr(c, x, y, w, h): return headset(c, x + w / 2, y + h / 2, min(w, h * 1.6) * 0.36)
def W_ar(c, x, y, w, h):
    s_ = min(w, h * 1.8) * 0.38
    return headset(c, x + w / 2, y + h * .4, s_, ar=True) + orbit(c, x + w / 2, y + h * .72, s_ * .9)


def W_cube(c, x, y, w, h):
    s = min(w, h) * 0.3
    return cube(c, x + w / 2, y + h / 2, s) + orbit(c, x + w / 2, y + h / 2 + s * .4, s * 1.6)


def W_orbit(c, x, y, w, h):
    r = min(w, h) * 0.4
    return (f'<circle cx="{x + w / 2}" cy="{y + h / 2}" r="{r * .45:.0f}" fill="url(#{c.uid}acc)" opacity=".85" class="fl"/>'
            + orbit(c, x + w / 2, y + h / 2, r))


def W_swatch(c, x, y, w, h):
    s = (w - 64) / 5
    return swatches(c, x, y + (h - s * 1.4) / 2, s)


def W_bezier(c, x, y, w, h): return panel(c, x, y, w, h, 26) + bezier(c, x + 50, y + 50, w - 100, h - 100)
def W_film(c, x, y, w, h): return film(c, x, y, w, min(h, w * 0.7))
def W_cart(c, x, y, w, h): return panel(c, x, y, w, h, 26, "fl2") + cart(c, x + w / 2, y + h / 2, min(w, h) * 0.3)
def W_mega(c, x, y, w, h): return megaphone(c, x + w * .42, y + h / 2, min(w, h) * 0.36)


def W_people(c, x, y, w, h):
    n = 3 if w < 700 else 4
    s = min(h * .2, w / (n * 2.6))
    desk_y = y + h * .68
    out = [panel(c, x, y, w, h, 26)]
    for i in range(n):
        px = x + w * (i + .5) / n
        out.append(person(c, px, desk_y - s * 2.05, s, i + len(c.parts)))
    out.append(f'<rect x="{x + w * .05:.0f}" y="{desk_y:.0f}" width="{w * .9:.0f}" height="{h * .05:.0f}" rx="10" fill="#2b4a63"/>')
    for i in range(n):
        px = x + w * (i + .5) / n
        lw = s * 1.5
        out.append(f'<g class="fl2"><path d="M{px - lw / 2:.0f} {desk_y:.0f} L{px - lw * .42:.0f} {desk_y - lw * .62:.0f} H{px + lw * .42:.0f} L{px + lw / 2:.0f} {desk_y:.0f}Z" fill="{INK}" stroke="url(#{c.uid}edge)" stroke-width="3"/>'
                   f'<circle cx="{px:.0f}" cy="{desk_y - lw * .32:.0f}" r="{lw * .08:.0f}" fill="{c.a}" class="pu"/></g>')
    out.append(f'<rect x="{x + w * .1:.0f}" y="{desk_y + h * .12:.0f}" width="{w * .35:.0f}" height="12" rx="6" fill="{c.a}" opacity=".8"/>')
    out.append(f'<rect x="{x + w * .1:.0f}" y="{desk_y + h * .12 + 26:.0f}" width="{w * .55:.0f}" height="10" rx="5" fill="{MUTED}" opacity=".35"/>')
    return "".join(out)


MOTIFS = {
    "web-development": [W_browser, W_code, W_line, W_server],
    "mobile-app-development": [W_phone, W_chat, W_ring, W_bars],
    "ecommerce-development": [W_browser, W_cart, W_bars, W_phone],
    "ui-ux-design": [W_browser, W_bezier, W_swatch, W_phone],
    "content-marketing": [W_doc, W_line, W_chat, W_mega],
    "copywriting": [W_doc, W_chat, W_mega, W_bezier],
    "digital-marketing": [W_bars, W_ring, W_mega, W_search],
    "social-media-marketing": [W_phone, W_chat, W_people, W_ring],
    "search-engine-optimization": [W_search, W_line, W_browser, W_ring],
    "generative-engine-optimization": [W_chat, W_nodes, W_search, W_doc],
    "artificial-intelligence": [W_nodes, W_chat, W_code, W_ring],
    "augmented-reality": [W_ar, W_phone, W_cube, W_orbit],
    "virtual-reality": [W_vr, W_cube, W_orbit, W_nodes],
    "digital-branding-creatives": [W_swatch, W_bezier, W_cube, W_doc],
    "it-resource-outsourcing": [W_people, W_code, W_server, W_chat],
    "video-animation-2d-3d": [W_film, W_cube, W_bezier, W_orbit],
}

CATEGORY = {
    "web-development": "dev", "mobile-app-development": "dev", "ecommerce-development": "dev",
    "it-resource-outsourcing": "dev", "ui-ux-design": "creative", "digital-branding-creatives": "creative",
    "video-animation-2d-3d": "creative", "content-marketing": "marketing", "copywriting": "marketing",
    "digital-marketing": "marketing", "social-media-marketing": "marketing",
    "search-engine-optimization": "marketing", "generative-engine-optimization": "marketing",
    "artificial-intelligence": "emerging", "augmented-reality": "emerging", "virtual-reality": "emerging",
}

# Box layouts as fractions (x, y, w, h). The first box gets the "hero" widget.
LAYOUTS = {
    "lead": [[(.07, .16, .5, .68), (.62, .14, .31, .34), (.62, .54, .31, .32)],
             [(.43, .14, .5, .7), (.07, .18, .3, .3), (.07, .55, .3, .3)]],
    "pair": [[(.1, .1, .8, .42), (.18, .58, .64, .3)],
             [(.12, .14, .76, .34), (.1, .55, .8, .36)]],
    "rail": [[(.1, .12, .8, .5), (.18, .68, .64, .22)]],
    "card": [[(.1, .12, .8, .5), (.2, .68, .6, .2)]],
    "cover": [[(.08, .16, .5, .68), (.63, .14, .29, .32), (.63, .54, .29, .32)],
              [(.42, .16, .5, .68), (.08, .14, .29, .32), (.08, .54, .29, .32)]],
}


def scene(slug_key, motifs, category, kind, w, h, variant, title, seed):
    c = Canvas(w, h, category, seed)
    c.background()
    boxes = LAYOUTS[kind][variant % len(LAYOUTS[kind])]
    for i, (fx, fy, fw, fh) in enumerate(boxes):
        widget = motifs[(variant + i) % len(motifs)]
        c.add(widget(c, round(fx * w), round(fy * h), round(fw * w), round(fh * h)))
    return c.svg(title)
