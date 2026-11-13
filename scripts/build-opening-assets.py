"""Derives the artwork for the full-bleed opening scene from the originals in
/assets.  Run:  python3 scripts/build-opening-assets.py
Outputs to public/assets/opening/:
  lace-trim.webp  straight, horizontally tileable lace edging (scallops down)
  wax-seal.webp   the gold seal, cut out from its studio background
The envelope itself, including its paper grain, is drawn in CSS (see
opening.css) so it can fill any screen without repeating or blurring."""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

SRC, OUT = 'assets', 'public/assets/opening'
IVORY = np.array([247, 241, 230], float)

# ── Lace trim: top edge of the lace napkin, cut at the gaps between scallops ─
lace = np.asarray(Image.open(f'{SRC}/square-lace.png').convert('L')).astype(float)[0:112, 122:1411]
alpha = np.clip((lace - 22) / 80, 0, 1)
rgb = IVORY[None, None, :] * (0.78 + 0.22 * (lace / 255))[:, :, None]
trim = Image.fromarray(np.dstack([rgb, alpha * 255]).astype('uint8'), 'RGBA').transpose(Image.FLIP_TOP_BOTTOM)
trim.save(f'{OUT}/lace-trim.webp', quality=82, method=6)
print('lace-trim', trim.size)

# ── Wax seal: knock out the white studio background ─────────────────────────
seal = Image.open(f'{SRC}/wax-seal-2.jpg').convert('RGB')
r, g, b = seal.split()
darkest = ImageChops.darker(ImageChops.darker(r, g), b)
al = darkest.point(lambda v: 255 if v < 236 else max(0, int(255 * (252 - v) / 16)))
bgmask = al.point(lambda v: 0 if v < 128 else 255)
for seed in [(0, 0), (seal.width - 1, 0), (0, seal.height - 1), (seal.width - 1, seal.height - 1)]:
    ImageDraw.floodfill(bgmask, seed, 128)
outside = bgmask.point(lambda v: 255 if v == 128 else 0).filter(ImageFilter.MaxFilter(5))
al = ImageChops.lighter(al, ImageChops.invert(outside)).filter(ImageFilter.GaussianBlur(0.8))
seal.putalpha(al)
seal = seal.crop(seal.getbbox())
seal.thumbnail((480, 480), Image.LANCZOS)
seal.save(f'{OUT}/wax-seal.webp', quality=88, method=6)
print('seal', seal.size)
