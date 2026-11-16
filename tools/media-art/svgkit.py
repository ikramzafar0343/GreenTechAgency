"""Small SVG illustration kit for GreenTech media frames (authoring tool, not shipped)."""
import math
import random
import zlib

NAVY = "#06111c"
DEEP = "#0b1d2e"
INK = "#0f2a40"
LINE = "#1d3b52"
WHITE = "#eaf6f8"
MUTED = "#8fb3c2"

ACCENTS = {
    "dev": ("#58e2ec", "#1f7a8c"),
    "marketing": ("#7cf0b4", "#1f8c6a"),
    "creative": ("#9db8ff", "#3e5bb8"),
    "emerging": ("#c49bff", "#6b45b8"),
    "brand": ("#58e2ec", "#1f7a8c"),
}


class Canvas:
    def __init__(self, w, h, accent_key, seed):
        self.w, self.h = w, h
        self.a, self.a2 = ACCENTS[accent_key]
        self.rnd = random.Random(seed)
        self.parts = []
        self.uid = f"g{zlib.crc32(f'{seed}|{w}|{h}'.encode()) % 99999}"

    def add(self, s):
        self.parts.append(s)

    def defs(self):
        u, a, a2 = self.uid, self.a, self.a2
        gx, gy = self.rnd.uniform(0.25, 0.8), self.rnd.uniform(0.15, 0.55)
        return f"""<defs>
<linearGradient id="{u}bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{NAVY}"/><stop offset=".6" stop-color="{DEEP}"/><stop offset="1" stop-color="#10324a"/></linearGradient>
<radialGradient id="{u}glow" cx="{gx:.2f}" cy="{gy:.2f}" r=".6"><stop offset="0" stop-color="{a}" stop-opacity=".38"/><stop offset=".45" stop-color="{a2}" stop-opacity=".16"/><stop offset="1" stop-color="{a2}" stop-opacity="0"/></radialGradient>
<linearGradient id="{u}acc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{a2}"/></linearGradient>
<linearGradient id="{u}glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".10"/><stop offset="1" stop-color="#ffffff" stop-opacity=".03"/></linearGradient>
<linearGradient id="{u}edge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{a}" stop-opacity=".75"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".12"/><stop offset="1" stop-color="{a2}" stop-opacity=".5"/></linearGradient>
<pattern id="{u}grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="{LINE}" stroke-width="1" opacity=".55"/></pattern>
<filter id="{u}soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="18"/></filter>
<filter id="{u}shadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000" flood-opacity=".45"/></filter>
</defs>"""

    def style(self):
        # Entrance classes stay at the pre-play pose until `svg.play` is set by PlayOnViewSvg.
        # Reduced-motion users see the finished art (no entrance rules apply).
        return """<style>
@media (prefers-reduced-motion: no-preference){
.tw{transform-box:fill-box;transform-origin:left center;transform:scaleX(0)}
.draw{stroke-dasharray:1;stroke-dashoffset:1}
.area{fill-opacity:0}
.rise{transform-box:fill-box;transform-origin:center bottom;transform:scaleY(0)}
.ring-draw{stroke-dashoffset:1}
.st{opacity:0;transform:translateY(14px)}
.pop{transform-box:fill-box;transform-origin:center;transform:scale(0);opacity:0}
svg.play .tw{animation:tw .42s cubic-bezier(.22,1,.36,1) forwards;animation-delay:calc(var(--i,0)*.055s)}
svg.play .draw{animation:draw 1.15s cubic-bezier(.22,1,.36,1) .15s forwards}
svg.play .area{animation:area .7s ease .55s forwards}
svg.play .rise{animation:rise .55s cubic-bezier(.22,1,.36,1) forwards;animation-delay:calc(.2s + var(--i,0)*.07s)}
svg.play .ring-draw{animation:ringDraw 1s cubic-bezier(.22,1,.36,1) .25s forwards}
svg.play .st{animation:st .5s cubic-bezier(.22,1,.36,1) forwards;animation-delay:calc(var(--i,0)*.07s)}
svg.play .pop{animation:pop .4s cubic-bezier(.22,1,.36,1) 1.1s forwards}
svg.play .fl{animation:fl 7s ease-in-out 1.3s infinite}
svg.play .fl2{animation:fl 9s ease-in-out 1.1s infinite}
svg.play .pu{animation:pu 4s ease-in-out 1.2s infinite}
svg.play .da{stroke-dasharray:10 14;animation:da 6s linear 1.2s infinite}
svg.play .sp{transform-box:fill-box;transform-origin:center;animation:sp 24s linear 1.2s infinite}
@keyframes tw{to{transform:scaleX(1)}}
@keyframes draw{to{stroke-dashoffset:0}}
@keyframes area{to{fill-opacity:.12}}
@keyframes rise{to{transform:scaleY(1)}}
@keyframes ringDraw{to{stroke-dashoffset:0}}
@keyframes st{to{opacity:1;transform:translateY(0)}}
@keyframes pop{to{transform:scale(1);opacity:1}}
@keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes pu{0%,100%{opacity:.35}50%{opacity:1}}
@keyframes da{to{stroke-dashoffset:-240}}
@keyframes sp{to{transform:rotate(360deg)}}}
</style>"""

    def background(self):
        u = self.uid
        self.add(f'<rect width="{self.w}" height="{self.h}" fill="url(#{u}bg)"/>')
        self.add(f'<rect width="{self.w}" height="{self.h}" fill="url(#{u}grid)"/>')
        self.add(f'<rect width="{self.w}" height="{self.h}" fill="url(#{u}glow)"/>')
        for _ in range(int(self.w * self.h / 60000)):
            x, y = self.rnd.uniform(0, self.w), self.rnd.uniform(0, self.h)
            r = self.rnd.choice([1.2, 1.6, 2.2])
            cls = ' class="pu"' if self.rnd.random() < 0.3 else ""
            self.add(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r}" fill="{self.a}" opacity=".5"{cls}/>')

    def svg(self, title):
        title = title.replace("&", "&amp;").replace("<", "&lt;").replace('"', "&quot;")
        body = "\n".join(self.parts)
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.w} {self.h}" '
                f'width="{self.w}" height="{self.h}" overflow="visible" '
                f'role="img" aria-label="{title}">'
                f"<title>{title}</title>{self.defs()}{self.style()}{body}</svg>\n")


def panel(c, x, y, w, h, r=28, cls=""):
    u = c.uid
    k = f' class="{cls}"' if cls else ""
    return (f'<g{k}><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{INK}" opacity=".92" filter="url(#{u}shadow)"/>'
            f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="url(#{u}glass)" stroke="url(#{u}edge)" stroke-width="2"/></g>')


def lines(c, x, y, w, n, gap=26, first=None, start_i=0, anim="tw"):
    out = []
    for i in range(n):
        lw = w * c.rnd.uniform(0.45, 1.0) if i else (first or w * 0.6)
        col = c.a if i == 0 else MUTED
        op = ".9" if i == 0 else ".35"
        idx = start_i + i
        out.append(
            f'<rect class="{anim}" style="--i:{idx}" x="{x}" y="{y + i * gap}" '
            f'width="{lw:.0f}" height="{10 if i else 14}" rx="6" fill="{col}" opacity="{op}"/>'
        )
    return "".join(out)


def browser(c, x, y, w, h, cls="fl"):
    s = [panel(c, x, y, w, h, 26, cls)]
    s.append("<g>")
    i = 0
    s.append(f'<rect class="st" style="--i:{i}" x="{x}" y="{y}" width="{w}" height="54" rx="26" fill="#ffffff" opacity=".05"/>')
    i += 1
    for j, col in enumerate(["#ff6b6b", "#ffd166", c.a]):
        s.append(
            f'<circle class="st" style="--i:{i}" cx="{x + 32 + j * 24}" cy="{y + 27}" r="7" fill="{col}" opacity=".85"/>'
        )
        i += 1
    s.append(
        f'<rect class="st" style="--i:{i}" x="{x + 120}" y="{y + 16}" width="{w * 0.45:.0f}" '
        f'height="22" rx="11" fill="#ffffff" opacity=".07"/>'
    )
    i += 1
    s.append(
        f'<rect class="st" style="--i:{i}" x="{x + 36}" y="{y + 90}" width="{w * 0.48:.0f}" '
        f'height="{h * 0.34:.0f}" rx="18" fill="url(#{c.uid}acc)" opacity=".85"/>'
    )
    i += 1
    s.append(lines(c, x + w * 0.56, y + 100, w * 0.36, 5, start_i=i))
    i += 5
    cw = (w - 72 - 40) / 3
    for j in range(3):
        cx = x + 36 + j * (cw + 20)
        s.append(
            f'<rect class="st" style="--i:{i}" x="{cx:.0f}" y="{y + h * 0.58:.0f}" width="{cw:.0f}" '
            f'height="{h * 0.3:.0f}" rx="16" fill="#ffffff" opacity=".05" stroke="{LINE}"/>'
        )
        i += 1
        s.append(lines(c, cx + 18, y + h * 0.58 + 22, cw - 36, 3, 22, start_i=i))
        i += 3
    s.append("</g>")
    return "".join(s)


def phone(c, x, y, w, h, cls="fl2"):
    s = [f'<g class="{cls}">', panel(c, x, y, w, h, 42)]
    i = 0
    s.append(
        f'<rect class="st" style="--i:{i}" x="{x + w * 0.38:.0f}" y="{y + 16}" width="{w * 0.24:.0f}" '
        f'height="12" rx="6" fill="#000" opacity=".5"/>'
    )
    i += 1
    s.append(
        f'<rect class="st" style="--i:{i}" x="{x + 22}" y="{y + 50}" width="{w - 44}" '
        f'height="{h * 0.3:.0f}" rx="20" fill="url(#{c.uid}acc)" opacity=".8"/>'
    )
    i += 1
    for _ in range(4):
        yy = y + 70 + h * 0.3 + (_ ) * (h * 0.12)
        s.append(
            f'<circle class="st" style="--i:{i}" cx="{x + 44}" cy="{yy + 16:.0f}" r="14" fill="{c.a}" opacity=".35"/>'
        )
        i += 1
        s.append(lines(c, x + 70, yy + 4, w - 100, 2, 20, start_i=i))
        i += 2
    s.append(
        f'<rect class="st" style="--i:{i}" x="{x + w * 0.3:.0f}" y="{y + h - 26}" width="{w * 0.4:.0f}" '
        f'height="6" rx="3" fill="#fff" opacity=".35"/></g>'
    )
    return "".join(s)


def chart(c, x, y, w, h, kind="bars", cls="fl"):
    s = [panel(c, x, y, w, h, 24, cls), "<g>"]
    s.append(lines(c, x + 28, y + 28, w * 0.5, 1, start_i=0))
    base, top = y + h - 30, y + 80
    if kind == "bars":
        n = 7
        bw = (w - 56) / n * 0.6
        for i in range(n):
            bh = (base - top) * c.rnd.uniform(0.25, 1.0)
            bx = x + 28 + i * (w - 56) / n
            s.append(
                f'<rect class="rise" style="--i:{i}" x="{bx:.0f}" y="{base - bh:.0f}" width="{bw:.0f}" '
                f'height="{bh:.0f}" rx="6" fill="url(#{c.uid}acc)" opacity="{0.45 + i * 0.07:.2f}"/>'
            )
    else:
        pts = [
            (
                x + 28 + i * (w - 56) / 8,
                base - (base - top) * (0.2 + 0.8 * (i / 8) * c.rnd.uniform(0.7, 1.1)),
            )
            for i in range(9)
        ]
        d = "M" + " L".join(f"{px:.0f} {py:.0f}" for px, py in pts)
        s.append(
            f'<path class="area" d="{d} L{pts[-1][0]:.0f} {base} L{pts[0][0]:.0f} {base}Z" fill="{c.a}"/>'
        )
        s.append(
            f'<path class="draw" pathLength="1" d="{d}" fill="none" stroke="{c.a}" stroke-width="5" '
            f'stroke-linecap="round" stroke-linejoin="round"/>'
        )
        px, py = pts[-1]
        s.append(f'<circle class="pop pu" cx="{px:.0f}" cy="{py:.0f}" r="10" fill="{c.a}"/>')
    s.append("</g>")
    return "".join(s)


def ring(c, cx, cy, r, value=0.72):
    return (
        f'<g class="fl2">'
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{LINE}" stroke-width="{r * 0.22:.0f}"/>'
        f'<circle class="ring-draw" pathLength="1" cx="{cx}" cy="{cy}" r="{r}" fill="none" '
        f'stroke="url(#{c.uid}acc)" stroke-width="{r * 0.22:.0f}" stroke-linecap="round" '
        f'stroke-dasharray="{value:.3f} 1" transform="rotate(-90 {cx} {cy})"/>'
        f'<circle class="st" style="--i:2" cx="{cx}" cy="{cy}" r="{r * 0.5:.0f}" fill="{c.a}" opacity=".12"/>'
        f"</g>"
    )


def code(c, x, y, w, h):
    s = [panel(c, x, y, w, h, 22, "fl"), "<g>"]
    idx = 0
    for i in range(int((h - 60) / 30)):
        indent = c.rnd.choice([0, 0, 1, 2, 1])
        xx = x + 30 + indent * 28
        s.append(
            f'<rect class="tw" style="--i:{idx}" x="{x + 18}" y="{y + 34 + i * 30}" '
            f'width="14" height="8" rx="3" fill="{MUTED}" opacity=".25"/>'
        )
        idx += 1
        segs = c.rnd.randint(1, 3)
        for _ in range(segs):
            sw = c.rnd.uniform(40, (w - 90 - indent * 28) / segs)
            col = [c.a, MUTED, "#ffd166", c.a2][c.rnd.randint(0, 3)]
            s.append(
                f'<rect class="tw" style="--i:{idx}" x="{xx + 20:.0f}" y="{y + 32 + i * 30}" '
                f'width="{sw:.0f}" height="10" rx="5" fill="{col}" opacity=".7"/>'
            )
            idx += 1
            xx += sw + 12
    s.append("</g>")
    return "".join(s)


def nodes(c, x, y, w, h, n=9):
    cols = 3 if w >= h else 2
    rows = max(2, round(n / cols))
    pts = []
    for r in range(rows):
        for q in range(cols):
            jx, jy = c.rnd.uniform(-.25, .25), c.rnd.uniform(-.25, .25)
            pts.append((x + w * (q + .5 + jx) / cols, y + h * (r + .5 + jy) / rows))
    s = ["<g>"]
    li = 0
    for i, (px, py) in enumerate(pts):
        for j in (i + 1, i + cols):
            if j < len(pts) and not (j == i + 1 and (i + 1) % cols == 0):
                qx, qy = pts[j]
                s.append(
                    f'<line class="draw" pathLength="1" style="--i:{li}" x1="{px:.0f}" y1="{py:.0f}" '
                    f'x2="{qx:.0f}" y2="{qy:.0f}" stroke="{c.a}" stroke-width="3" opacity=".5"/>'
                )
                li += 1
    for ni, (px, py) in enumerate(pts):
        r = min(w, h) * c.rnd.choice([.045, .06, .075])
        s.append(
            f'<circle class="st" style="--i:{ni}" cx="{px:.0f}" cy="{py:.0f}" r="{r * 2:.0f}" fill="{c.a}" opacity=".08"/>'
            f'<circle class="st" style="--i:{ni}" cx="{px:.0f}" cy="{py:.0f}" r="{r:.0f}" fill="{INK}" stroke="{c.a}" stroke-width="3"/>'
            f'<circle class="pop pu" style="--i:{ni}" cx="{px:.0f}" cy="{py:.0f}" r="{r * 0.38:.0f}" fill="{c.a}"/>'
        )
    s.append("</g>")
    return "".join(s)


def person(c, x, y, s_, tone=0):
    tones = ["#f1c9a5", "#c98e66", "#8d5a3b", "#e8b48c"]
    shirt = [c.a2, "#2b4a63", c.a, "#3a3f6b"][tone % 4]
    return (f'<g><path d="M{x - s_ * .9:.0f} {y + s_ * 2.2:.0f} Q{x:.0f} {y + s_ * .9:.0f} {x + s_ * .9:.0f} {y + s_ * 2.2:.0f}Z" fill="{shirt}"/>'
            f'<circle cx="{x}" cy="{y + s_ * .55:.0f}" r="{s_ * .48:.0f}" fill="{tones[tone % 4]}"/>'
            f'<path d="M{x - s_ * .48:.0f} {y + s_ * .5:.0f} Q{x:.0f} {y - s_ * .15:.0f} {x + s_ * .48:.0f} {y + s_ * .5:.0f}" fill="#1b1b24"/></g>')


def search_bar(c, x, y, w, k=1.0):
    bw = w / k
    inner = (
        f'<g class="fl">{panel(c, 0, 0, bw, 76, 38)}'
        f'<circle class="st" style="--i:0" cx="44" cy="36" r="13" fill="none" stroke="{c.a}" stroke-width="4"/>'
        f'<line class="draw" pathLength="1" x1="54" y1="46" x2="64" y2="56" stroke="{c.a}" stroke-width="4" stroke-linecap="round"/>'
        f'<rect class="tw" style="--i:1" x="84" y="31" width="{bw * 0.55:.0f}" height="12" rx="6" fill="{MUTED}" opacity=".45"/>'
        f'<rect class="st" style="--i:2" x="{bw - 110:.0f}" y="18" width="84" height="40" rx="20" fill="url(#{c.uid}acc)"/></g>'
    )
    return f'<g transform="translate({x} {y}) scale({k:.2f})">{inner}</g>'


def chat(c, x, y, w, n=3, bh=70):
    s = ['<g class="fl2">']
    yy = y
    for i in range(n):
        right = i % 2 == 1
        bw = w * c.rnd.uniform(0.55, 0.85)
        bx = x + (w - bw if right else 0)
        fill = f"url(#{c.uid}acc)" if right else INK
        s.append(
            f'<rect class="st" style="--i:{i * 3}" x="{bx:.0f}" y="{yy:.0f}" width="{bw:.0f}" height="{bh:.0f}" '
            f'rx="{bh * .34:.0f}" fill="{fill}" opacity="{.9 if right else .95}" stroke="{LINE}"/>'
        )
        s.append(
            f'<rect class="tw" style="--i:{i * 3 + 1}" x="{bx + bh * .32:.0f}" y="{yy + bh * .3:.0f}" '
            f'width="{bw * .6:.0f}" height="{bh * .15:.0f}" rx="{bh * .07:.0f}" fill="#fff" opacity=".55"/>'
        )
        s.append(
            f'<rect class="tw" style="--i:{i * 3 + 2}" x="{bx + bh * .32:.0f}" y="{yy + bh * .56:.0f}" '
            f'width="{bw * .4:.0f}" height="{bh * .15:.0f}" rx="{bh * .07:.0f}" fill="#fff" opacity=".3"/>'
        )
        yy += bh * 1.3
    s.append("</g>")
    return "".join(s)


def headset(c, cx, cy, s_, ar=False):
    if ar:
        return (
            f'<g class="fl">'
            f'<rect class="st" style="--i:0" x="{cx - s_}" y="{cy - s_ * .32:.0f}" width="{s_ * 2}" height="{s_ * .64:.0f}" '
            f'rx="{s_ * .3:.0f}" fill="{INK}" stroke="url(#{c.uid}edge)" stroke-width="4"/>'
            f'<rect class="st" style="--i:1" x="{cx - s_ * .86:.0f}" y="{cy - s_ * .2:.0f}" width="{s_ * .78:.0f}" '
            f'height="{s_ * .4:.0f}" rx="{s_ * .18:.0f}" fill="{c.a}" opacity=".35"/>'
            f'<rect class="st" style="--i:2" x="{cx + s_ * .08:.0f}" y="{cy - s_ * .2:.0f}" width="{s_ * .78:.0f}" '
            f'height="{s_ * .4:.0f}" rx="{s_ * .18:.0f}" fill="{c.a}" opacity=".35"/>'
            f'<path class="draw" pathLength="1" d="M{cx - s_} {cy} L{cx - s_ * 1.5:.0f} {cy - s_ * .1:.0f}M{cx + s_} {cy} '
            f'L{cx + s_ * 1.5:.0f} {cy - s_ * .1:.0f}" stroke="{MUTED}" stroke-width="6" stroke-linecap="round"/></g>'
        )
    return (
        f'<g class="fl">'
        f'<rect class="st" style="--i:0" x="{cx - s_}" y="{cy - s_ * .5:.0f}" width="{s_ * 2}" height="{s_}" '
        f'rx="{s_ * .32:.0f}" fill="{INK}" stroke="url(#{c.uid}edge)" stroke-width="4"/>'
        f'<rect class="st" style="--i:1" x="{cx - s_ * .82:.0f}" y="{cy - s_ * .3:.0f}" width="{s_ * 1.64:.0f}" '
        f'height="{s_ * .6:.0f}" rx="{s_ * .22:.0f}" fill="url(#{c.uid}acc)" opacity=".7"/>'
        f'<path class="draw" pathLength="1" d="M{cx - s_ * .9:.0f} {cy - s_ * .4:.0f} Q{cx} {cy - s_ * 1.3:.0f} '
        f'{cx + s_ * .9:.0f} {cy - s_ * .4:.0f}" fill="none" stroke="{MUTED}" stroke-width="8" opacity=".6"/></g>'
    )


def cube(c, cx, cy, s_, cls="fl"):
    t = s_ * 0.5
    return (
        f'<g class="{cls}">'
        f'<path class="st" style="--i:0" d="M{cx} {cy - s_} L{cx + s_} {cy - t} L{cx} {cy} L{cx - s_} {cy - t}Z" fill="{c.a}" opacity=".85"/>'
        f'<path class="st" style="--i:1" d="M{cx - s_} {cy - t} L{cx} {cy} L{cx} {cy + s_} L{cx - s_} {cy + t}Z" fill="{c.a2}" opacity=".9"/>'
        f'<path class="st" style="--i:2" d="M{cx + s_} {cy - t} L{cx} {cy} L{cx} {cy + s_} L{cx + s_} {cy + t}Z" fill="{INK}" stroke="{c.a}" stroke-width="2"/>'
        f"</g>"
    )


def orbit(c, cx, cy, r):
    return (
        f'<g>'
        f'<ellipse class="draw" pathLength="1" cx="{cx}" cy="{cy}" rx="{r}" ry="{r * .36:.0f}" fill="none" '
        f'stroke="{c.a}" stroke-width="2" opacity=".5"/>'
        f'<g class="sp"><circle class="pop" cx="{cx + r}" cy="{cy}" r="9" fill="{c.a}"/></g>'
        f"</g>"
    )


def swatches(c, x, y, s_):
    cols = [c.a, c.a2, "#ffd166", "#ff8fa3", WHITE]
    return (
        '<g class="fl2">'
        + "".join(
            f'<rect class="st" style="--i:{i}" x="{x + i * (s_ + 16)}" y="{y}" width="{s_}" '
            f'height="{s_ * 1.4:.0f}" rx="16" fill="{col}" opacity=".9" stroke="{LINE}"/>'
            for i, col in enumerate(cols)
        )
        + "</g>"
    )


def bezier(c, x, y, w, h):
    return (
        f'<g class="fl">'
        f'<path class="draw" pathLength="1" d="M{x} {y + h} C{x + w * .25:.0f} {y} {x + w * .75:.0f} {y + h} {x + w} {y}" '
        f'fill="none" stroke="{c.a}" stroke-width="6" stroke-linecap="round"/>'
        f'<line class="draw" pathLength="1" x1="{x}" y1="{y + h}" x2="{x + w * .25:.0f}" y2="{y}" '
        f'stroke="{MUTED}" stroke-width="2" stroke-dasharray="6 8"/>'
        f'<line class="draw" pathLength="1" x1="{x + w}" y1="{y}" x2="{x + w * .75:.0f}" y2="{y + h}" '
        f'stroke="{MUTED}" stroke-width="2" stroke-dasharray="6 8"/>'
        + "".join(
            f'<rect class="pop" style="--i:{i}" x="{px - 10:.0f}" y="{py - 10:.0f}" width="20" height="20" rx="4" '
            f'fill="{INK}" stroke="{c.a}" stroke-width="3"/>'
            for i, (px, py) in enumerate([(x, y + h), (x + w * .25, y), (x + w * .75, y + h), (x + w, y)])
        )
        + "</g>"
    )


def film(c, x, y, w, h):
    s = [panel(c, x, y, w, h, 18, "fl"), "<g>"]
    idx = 0
    for i in range(int(w / 46)):
        s.append(
            f'<rect class="st" style="--i:{idx}" x="{x + 16 + i * 46}" y="{y + 12}" width="24" height="14" '
            f'rx="4" fill="{MUTED}" opacity=".35"/>'
        )
        idx += 1
        s.append(
            f'<rect class="st" style="--i:{idx}" x="{x + 16 + i * 46}" y="{y + h - 26}" width="24" height="14" '
            f'rx="4" fill="{MUTED}" opacity=".35"/>'
        )
        idx += 1
    s.append(
        f'<rect class="st" style="--i:{idx}" x="{x + 24}" y="{y + 44}" width="{w - 48}" height="{h - 88}" '
        f'rx="12" fill="url(#{c.uid}acc)" opacity=".65"/>'
    )
    idx += 1
    cx, cy = x + w / 2, y + h / 2
    s.append(
        f'<path class="pop" d="M{cx - 22:.0f} {cy - 30:.0f} L{cx + 32:.0f} {cy:.0f} L{cx - 22:.0f} {cy + 30:.0f}Z" '
        f'fill="#fff" opacity=".9"/></g>'
    )
    return "".join(s)


def cart(c, cx, cy, s_):
    return (
        f'<g class="fl2">'
        f'<path class="draw" pathLength="1" d="M{cx - s_} {cy - s_ * .6:.0f} H{cx - s_ * .7:.0f} L{cx - s_ * .4:.0f} '
        f'{cy + s_ * .4:.0f} H{cx + s_ * .7:.0f} L{cx + s_} {cy - s_ * .3:.0f} H{cx - s_ * .6:.0f}" fill="none" '
        f'stroke="{c.a}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>'
        f'<circle class="pop" cx="{cx - s_ * .3:.0f}" cy="{cy + s_ * .7:.0f}" r="{s_ * .14:.0f}" fill="{c.a}"/>'
        f'<circle class="pop" cx="{cx + s_ * .55:.0f}" cy="{cy + s_ * .7:.0f}" r="{s_ * .14:.0f}" fill="{c.a}"/>'
        f"</g>"
    )


def doc(c, x, y, w, h, cls="fl"):
    n = max(3, min(9, int((h - 120) / 34)))
    gap = max(26, (h - 130) / (n + 1))
    s = [panel(c, x, y, w, h, 18, cls), f'<g class="{cls}">']
    s.append(
        f'<rect class="tw" style="--i:0" x="{x + 28}" y="{y + 30}" width="{w * .5:.0f}" height="18" rx="9" fill="{c.a}"/>'
    )
    s.append(lines(c, x + 28, y + 80, w - 56, n, gap, first=w * 0.8, start_i=1))
    s.append("</g>")
    return "".join(s)


def megaphone(c, cx, cy, s_):
    return (
        f'<g class="fl">'
        f'<path class="st" style="--i:0" d="M{cx - s_} {cy - s_ * .25:.0f} L{cx + s_ * .6:.0f} {cy - s_ * .8:.0f} '
        f'V{cy + s_ * .8:.0f} L{cx - s_} {cy + s_ * .25:.0f}Z" fill="url(#{c.uid}acc)"/>'
        f'<rect class="st" style="--i:1" x="{cx - s_ * 1.25:.0f}" y="{cy - s_ * .25:.0f}" width="{s_ * .3:.0f}" '
        f'height="{s_ * .5:.0f}" rx="6" fill="{c.a2}"/>'
        + "".join(
            f'<path class="draw pu" pathLength="1" d="M{cx + s_ * (.8 + i * .25):.0f} {cy - s_ * (.4 + i * .15):.0f} '
            f'Q{cx + s_ * (1 + i * .3):.0f} {cy} {cx + s_ * (.8 + i * .25):.0f} {cy + s_ * (.4 + i * .15):.0f}" '
            f'fill="none" stroke="{c.a}" stroke-width="5" stroke-linecap="round"/>'
            for i in range(3)
        )
        + "</g>"
    )
