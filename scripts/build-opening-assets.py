"""Derives the layered envelope + seal used by the opening scene from the
original photos in /assets.  Run:  python3 scripts/build-opening-assets.py
Outputs to public/assets/opening/.  Geometry constants here must stay in sync
with src/components/opening/envelopeGeometry.js."""
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageChops

SRC, OUT = 'assets', 'public/assets/opening'
W = 1600                                  # output width of every envelope layer
CROP = (363, 393, 3810, 2771)             # envelope bbox in the source + 20px pad
# Flap outline in source-image pixels (clockwise from top-left corner).
FLAP_SRC = [(388, 414), (3788, 414), (3788, 610), (2140, 2124), (2046, 2112), (388, 560)]

def main(debug=None):
    src = Image.open(f'{SRC}/envelope.png').convert('RGBA').crop(CROP)
    k = W / src.width
    H = round(src.height * k)
    env = src.resize((W, H), Image.LANCZOS)
    flap_pts = [((x - CROP[0]) * k, (y - CROP[1]) * k) for x, y in FLAP_SRC]

    # Flap mask (supersampled for a clean edge)
    ss = 4
    m = Image.new('L', (W * ss, H * ss), 0)
    ImageDraw.Draw(m).polygon([(x * ss, y * ss) for x, y in flap_pts], fill=255)
    flap_mask = m.resize((W, H), Image.LANCZOS)
    alpha = env.split()[3]

    # 1. flap (outer face)
    flap = env.copy(); flap.putalpha(ImageChops.multiply(alpha, flap_mask))
    # 2. pocket = envelope minus flap (flap mask shrunk 1px so no seam shows)
    hole = flap_mask.filter(ImageFilter.MinFilter(3))
    pocket = env.copy(); pocket.putalpha(ImageChops.multiply(alpha, ImageChops.invert(hole)))
    # The brass button must not ghost through the interior / liner: clone clean paper over it
    clean = env.copy()
    bx, by, br = 785, 625, 72
    patch = env.crop((bx - br - 190, by - br - 200, bx + br - 190, by + br - 200))
    pm = Image.new('L', patch.size, 0); ImageDraw.Draw(pm).ellipse((8, 8, 2 * br - 8, 2 * br - 8), fill=255)
    clean.paste(patch, (bx - br, by - br), pm.filter(ImageFilter.GaussianBlur(9)))
    # 3. interior = blurred, darkened paper in the envelope silhouette
    soft = clean.convert('RGB').filter(ImageFilter.GaussianBlur(14))
    interior = ImageEnhance.Brightness(soft).enhance(0.42).convert('RGBA'); interior.putalpha(alpha)
    # 4. flap inner face: burgundy paper edge + sage liner inset
    inner = ImageEnhance.Brightness(soft).enhance(0.72).convert('RGBA')
    cx = sum(p[0] for p in flap_pts) / len(flap_pts); cy = sum(p[1] for p in flap_pts) / len(flap_pts)
    inset = [(cx + (x - cx) * 0.93, cy + (y - cy) * 0.93 - H * 0.012) for x, y in flap_pts]
    lm = Image.new('L', (W * ss, H * ss), 0)
    ImageDraw.Draw(lm).polygon([(x * ss, y * ss) for x, y in inset], fill=255)
    lm = lm.resize((W, H), Image.LANCZOS)
    # liner keeps the paper's grain: desaturated texture tinted sage
    grain = ImageEnhance.Contrast(clean.convert('L')).enhance(0.55)
    liner = Image.merge('RGB', [grain.point(lambda v, c=c: min(255, int(v * c / 128))) for c in (150, 157, 126)])
    inner.paste(liner, (0, 0), lm)
    inner.putalpha(ImageChops.multiply(alpha, flap_mask))

    for name, im in [('flap', flap), ('pocket', pocket), ('interior', interior), ('flap-inner', inner)]:
        im.save(f'{OUT}/envelope-{name}.webp', quality=84, method=6)

    # Wax seal: knock out the white studio background
    seal = Image.open(f'{SRC}/wax-seal-2.jpg').convert('RGB')
    r, g, b = seal.split()
    darkest = ImageChops.darker(ImageChops.darker(r, g), b)
    # white -> transparent; ramp between 236..252 for a soft edge
    a = darkest.point(lambda v: 255 if v < 236 else max(0, int(255 * (252 - v) / 16)))
    # keep only the outer background transparent (flood from the corners)
    bgmask = a.point(lambda v: 0 if v < 128 else 255)
    for seed in [(0, 0), (seal.width - 1, 0), (0, seal.height - 1), (seal.width - 1, seal.height - 1)]:
        ImageDraw.floodfill(bgmask, seed, 128)
    outside = bgmask.point(lambda v: 255 if v == 128 else 0).filter(ImageFilter.MaxFilter(5))
    a = ImageChops.lighter(a, ImageChops.invert(outside))      # interior highlights stay opaque
    a = a.filter(ImageFilter.GaussianBlur(0.8))
    seal.putalpha(a)
    seal = seal.crop(seal.getbbox())
    seal.thumbnail((520, 520), Image.LANCZOS)
    seal.save(f'{OUT}/wax-seal.webp', quality=88, method=6)

    print('envelope', (W, H), 'aspect', round(W / H, 4))
    print('flap %:', [(round(x / W * 100, 2), round(y / H * 100, 2)) for x, y in flap_pts])
    print('seal', seal.size)
    if debug:
        d = Image.new('RGBA', (W, H), (40, 80, 50, 255)); d.alpha_composite(interior); d.alpha_composite(pocket)
        d2 = Image.new('RGBA', (W, H), (40, 80, 50, 255)); d2.alpha_composite(inner)
        d3 = Image.new('RGBA', (W, H), (40, 80, 50, 255)); d3.alpha_composite(pocket); d3.alpha_composite(flap)
        s2 = Image.new('RGBA', (W, H), (104, 26, 43, 255)); s2.alpha_composite(seal, (540, 300))
        sheet = Image.new('RGB', (W, H), 'white')
        for n, im in enumerate([d, d2, d3, s2]):
            sheet.paste(im.convert('RGB').resize((W // 2, H // 2)), ((n % 2) * W // 2, (n // 2) * H // 2))
        sheet.save(debug)

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else None)
