"""Derives the artwork for the full-bleed opening scene from the originals in
/assets.  Run:  python3 scripts/build-opening-assets.py
Outputs to public/assets/opening/:
  lace-trim.webp  straight, horizontally tileable lace edging (scallops down)
  seal-rose.webp, bow-garland.webp, bouquet-*.webp, florals-*.webp
                  supplied elements, trimmed to their content
The envelope itself, including its paper grain, is drawn in CSS (see
opening.css) so it can fill any screen without repeating or blurring."""
import numpy as np
from PIL import Image

SRC, OUT = 'assets', 'public/assets/opening'
IVORY = np.array([247, 241, 230], float)

# ── Lace trim: top edge of the lace napkin, cut at the gaps between scallops ─
lace = np.asarray(Image.open(f'{SRC}/square-lace.png').convert('L')).astype(float)[0:112, 122:1411]
alpha = np.clip((lace - 22) / 80, 0, 1)
rgb = IVORY[None, None, :] * (0.78 + 0.22 * (lace / 255))[:, :, None]
trim = Image.fromarray(np.dstack([rgb, alpha * 255]).astype('uint8'), 'RGBA').transpose(Image.FLIP_TOP_BOTTOM)
trim.save(f'{OUT}/lace-trim.webp', quality=82, method=6)
print('lace-trim', trim.size)

# ── Elements supplied in public/assets/elements: trim to content, ship as WebP ─
ELEMENTS = 'public/assets/elements'
for src_name, out_name in [
    ('wax-seal-burgundy-gold-rose', 'seal-rose'),          # the seal on the flap
    ('bow-garland-ivory',           'bow-garland'),        # swag above the names
    ('bouquet-cascade-white',       'bouquet-white'),      # foreground, sealed scene
    ('bouquet-cascade-burgundy',    'bouquet-burgundy'),   # on the table, bottom-left
    ('florals-cluster-burgundy',    'florals-burgundy'),   # on the table, top-right
]:
    im = Image.open(f'{ELEMENTS}/{src_name}.png').convert('RGBA')
    im = im.crop(im.getbbox())
    im.save(f'{OUT}/{out_name}.webp', quality=88, method=6)
    print(out_name, im.size)
