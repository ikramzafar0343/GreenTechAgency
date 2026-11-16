"""Generates every GreenTech media-frame SVG into Frontend/public. Run: python3 build_media.py <repo>"""
import json
import os
import sys
from scenes import (MOTIFS, CATEGORY, scene, W_browser, W_code, W_line, W_bars, W_ring, W_nodes,
                    W_people, W_doc, W_chat, W_phone, W_cart, W_bezier, W_swatch, W_cube, W_orbit,
                    W_server, W_search, W_film, W_mega)

ROOT = sys.argv[1]
PUB = os.path.join(ROOT, "Frontend", "public")
manifest = []


def write(rel, svg, alt):
    path = os.path.join(PUB, rel.lstrip("/"))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(svg)
    manifest.append({"path": rel, "alt": alt, "bytes": len(svg.encode())})


services = json.load(open(os.path.join(ROOT, "Backend/data/import/services.json")))
TITLES = {s["slug"]: s["doc"]["title"] for s in services}

FRAMES = [
    ("lead", "lead", 2200, 1450, 0),
    ("pair-a-left", "pair", 1200, 1800, 0),
    ("pair-a-right", "pair", 1200, 1800, 1),
    ("pair-b-left", "pair", 1200, 1800, 2),
    ("pair-b-right", "pair", 1200, 1800, 3),
    ("rail", "rail", 1000, 1400, 1),
    ("card", "card", 1200, 1347, 2),
]
FRAME_ALT = {
    "lead": "{t} — overview illustration",
    "pair-a-left": "{t} — planning and discussion illustration",
    "pair-a-right": "{t} — interface detail illustration",
    "pair-b-left": "{t} — craft and build illustration",
    "pair-b-right": "{t} — collaboration and delivery illustration",
    "rail": "{t} — delivery illustration",
    "card": "{t} service illustration",
}

for slug, motifs in MOTIFS.items():
    title = TITLES.get(slug, slug)
    cat = CATEGORY[slug]
    for name, kind, w, h, variant in FRAMES:
        alt = FRAME_ALT[name].format(t=title)
        write(f"/services/editorial/{slug}/{name}.svg",
              scene(slug, motifs, cat, kind, w, h, variant, alt, f"{slug}-{name}"), alt)
    alt = f"{title} — service cover illustration"
    write(f"/services/{slug}-cover.svg", scene(slug, motifs, cat, "cover", 1280, 800, 1, alt, f"{slug}-cover"), alt)
    alt = f"{title} guide — article cover illustration"
    write(f"/blog/{slug}.svg", scene(slug, motifs, cat, "cover", 1600, 1000, 3, alt, f"{slug}-blog"), alt)

INSIGHTS = {
    "seo-foundations": ([W_search, W_line, W_browser], "marketing", "SEO foundations"),
    "geo-visibility": ([W_chat, W_nodes, W_search], "marketing", "GEO visibility in AI answers"),
    "conversion-ux": ([W_browser, W_bars, W_bezier], "creative", "Conversion-focused UX"),
    "ecommerce-speed": ([W_cart, W_line, W_phone], "dev", "Ecommerce store speed"),
    "mobile-delivery": ([W_phone, W_code, W_ring], "dev", "Mobile app delivery"),
    "content-systems": ([W_doc, W_chat, W_line], "marketing", "Content systems"),
    "practical-ai": ([W_nodes, W_code, W_chat], "emerging", "Practical AI"),
    "brand-systems": ([W_swatch, W_bezier, W_doc], "creative", "Brand systems"),
    "site-handover": ([W_server, W_doc, W_browser], "dev", "Website handover"),
}
for name, (motifs, cat, label) in INSIGHTS.items():
    alt = f"{label} — article cover illustration"
    write(f"/insights/{name}.svg", scene(name, motifs, cat, "cover", 1600, 1000, 0, alt, f"ins-{name}"), alt)

SINGLES = [
    ("/about/group-portrait.svg", [W_people, W_browser, W_chat], "brand", "lead", 2400, 1170, 0,
     "GreenTech team collaborating across design, engineering and growth"),
    ("/why-choose/large.svg", [W_browser, W_people], "brand", "pair", 900, 1200, 0,
     "Product team reviewing a website build"),
    ("/why-choose/small.svg", [W_line, W_ring], "marketing", "card", 900, 1100, 0,
     "Growth dashboard with performance metrics"),
    ("/portfolio/atlas-dashboard.svg", [W_bars, W_line, W_ring], "dev", "pair", 1000, 1000, 1,
     "Atlas Operations Dashboard — analytics interface"),
    ("/portfolio/lumen-shop.svg", [W_browser, W_cart], "creative", "pair", 1000, 1000, 0,
     "Lumen Commerce Experience — storefront interface"),
    ("/portfolio/northline-banking.svg", [W_phone, W_ring], "dev", "pair", 1000, 1000, 0,
     "Northline Mobile Banking — mobile app screens"),
    ("/portfolio/carepath-portal.svg", [W_browser, W_doc, W_chat], "marketing", "pair", 1000, 1000, 1,
     "CarePath Patient Portal — web platform interface"),
    ("/impact/delivery.svg", [W_browser, W_people], "marketing", "rail", 1000, 1400, 0,
     "Design and engineering delivery in progress"),
    ("/impact/collaboration.svg", [W_people, W_code, W_line], "dev", "lead", 2200, 1450, 1,
     "Cross-functional team shipping a digital product"),
]
for rel, motifs, cat, kind, w, h, variant, alt in SINGLES:
    write(rel, scene(rel, motifs, cat, kind, w, h, variant, alt, rel), alt)

ACHIEVEMENTS = [
    ("development", [W_code, W_browser], "dev", "Development work"),
    ("design", [W_bezier, W_swatch], "creative", "Design systems work"),
    ("growth", [W_line, W_search], "marketing", "Growth and search work"),
    ("creative", [W_film, W_cube], "creative", "Brand and creative work"),
    ("emerging", [W_nodes, W_orbit], "emerging", "AI and immersive pilots"),
    ("partnership", [W_people, W_chat], "brand", "Ongoing partnership squads"),
]
for name, motifs, cat, alt in ACHIEVEMENTS:
    write(f"/about/achievements/{name}.svg", scene(name, motifs, cat, "card", 900, 1100, 0, alt, f"ach-{name}"), alt)

TRAIL = [([W_browser, W_ring], "dev"), ([W_phone, W_chat], "marketing"), ([W_bezier, W_swatch], "creative"),
         ([W_nodes, W_cube], "emerging"), ([W_doc, W_mega], "marketing"), ([W_code, W_server], "dev"),
         ([W_people, W_line], "brand")]
for i, (motifs, cat) in enumerate(TRAIL, start=1):
    alt = "GreenTech studio work illustration"
    write(f"/about/trail/trail-{i:02d}.svg", scene(f"t{i}", motifs, cat, "card", 900, 1100, 0, alt, f"trail-{i}"), alt)

json.dump(manifest, open(os.path.join(os.path.dirname(__file__), "media-manifest.json"), "w"), indent=1)
print(len(manifest), "svgs", sum(m["bytes"] for m in manifest) // 1024, "KiB")
