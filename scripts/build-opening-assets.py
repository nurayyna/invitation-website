"""Derives the artwork for the full-bleed opening scene from the originals in
/assets.  Run:  python3 scripts/build-opening-assets.py
Outputs to public/assets/opening/:
  lace-trim.webp  straight, horizontally tileable lace edging (scallops down)
  seal-rose.webp, bow-garland.webp
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
]:
    im = Image.open(f'{ELEMENTS}/{src_name}.png').convert('RGBA')
    im = im.crop(im.getbbox())
    im.save(f'{OUT}/{out_name}.webp', quality=88, method=6)
    print(out_name, im.size)

# ── Burgundy lace band: kept at its natural proportions and repeated down the
#    screen in CSS. Each tile is the strip followed by its mirror image, so
#    where tiles meet the pattern continues instead of jumping.
band = Image.open(f'{ELEMENTS}/lace-trim-burgundy.png').convert('RGBA')
band = band.crop(band.getbbox())
tile = Image.new('RGBA', (band.width, band.height * 2))
tile.paste(band, (0, 0))
tile.paste(band.transpose(Image.FLIP_TOP_BOTTOM), (0, band.height))
tile.save(f'{OUT}/lace-band-burgundy.webp', quality=86, method=6)
print('lace-band-burgundy', tile.size, 'aspect', round(tile.width / tile.height, 4))
