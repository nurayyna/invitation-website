"""Derives the lace, floral and embossed-paper "keepsake" assets from the
originals in /assets.  Run:  python3 scripts/build-keepsake-assets.py
Outputs to public/assets/keepsakes/.  The lace slice numbers printed at the
end are mirrored in src/styles/keepsakes.css (.lace)."""
import numpy as np
from PIL import Image

SRC, OUT = 'assets', 'public/assets/keepsakes'
IVORY = np.array([247, 241, 230], float)

def save(im, name, q=82):
    im.save(f'{OUT}/{name}.webp', quality=q, method=6)
    print(name, im.size)

# ── Lace border: white lace + linen photographed on black → ivory on alpha ──
lace = np.asarray(Image.open(f'{SRC}/square-lace.png').convert('L')).astype(float)
alpha = np.clip((lace - 22) / 80, 0, 1)
shade = 0.80 + 0.20 * (lace / 255)                       # keep the thread relief
rgb = IVORY[None, None, :] * shade[:, :, None]
out = np.dstack([rgb, alpha * 255]).astype('uint8')
im = Image.fromarray(out, 'RGBA')
# the linen centre is drawn in CSS, so drop it to keep the file small
c = np.array(im); c[150:-130, 150:-150, 3] = 0
save(Image.fromarray(c, 'RGBA'), 'lace-border', q=80)
linen = rgb[400:600, 600:900].reshape(-1, 3).mean(axis=0)
print('linen colour  #%02X%02X%02X' % tuple(int(v) for v in linen))

# ── Lace drape (corner piece) ───────────────────────────────────────────────
d = Image.open(f'{SRC}/left-lace.png').convert('RGBA').crop((0, 0, 1216, 1024))
d = d.resize((800, round(1024 * 800 / 1216)), Image.LANCZOS)
save(d, 'lace-drape')

# ── Bouquet + sprig ─────────────────────────────────────────────────────────
f = Image.open(f'{SRC}/flowers.png').convert('RGBA'); f = f.crop(f.getbbox())
f = f.resize((720, round(f.height * 720 / f.width)), Image.LANCZOS)
save(f, 'bouquet', q=84)
s = Image.open(f'{SRC}/corner-flowers.png').convert('RGBA'); s = s.crop(s.getbbox())
save(s, 'sprig', q=86)

# ── Embossed ivory florals (supplied reference) → side borders + linen tile ─
e = np.asarray(Image.open(f'{SRC}/reference/embossed-ivory-florals.jpg').convert('RGB')).astype(float)
centre = e[:, 300:400].reshape(-1, 3).mean(axis=0)
target = np.array([243, 236, 223], float)                # a touch deeper than --ivory so relief reads
e = np.clip(e * (target / centre), 0, 255)
H, W, _ = e.shape
def mirrored(a):                                         # seamless when repeated vertically
    return np.concatenate([a, a[::-1]], axis=0)
SW = 250
ramp = np.clip(np.linspace(0, 1, 70), 0, 1)             # fade the inner edge into the linen
def strip(a, inner_on_right):
    al = np.ones((a.shape[0], SW))
    if inner_on_right: al[:, -70:] = 1 - ramp
    else:              al[:, :70] = ramp
    return Image.fromarray(np.dstack([a, al * 255]).astype('uint8'), 'RGBA')
save(strip(mirrored(e[:, :SW]), True), 'emboss-left', q=80)
save(strip(mirrored(e[:, W - SW:]), False), 'emboss-right', q=80)
t = e[:, 290:410]; t = np.concatenate([t, t[:, ::-1]], axis=1)
save(Image.fromarray(mirrored(t)[:600].astype('uint8'), 'RGB'), 'linen', q=78)
print('emboss base  #%02X%02X%02X' % tuple(int(v) for v in target))
print('lace slices (top right bottom left): 124 125 106 122 of 1536x1024, band = 100px')
