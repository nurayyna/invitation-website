"""Trims the supplied keepsake elements for the Invitation -> Our Story passage
and exports them as web-sized WebP.  Run:  python3 scripts/build-passage-assets.py
Outputs to public/assets/passage/.  Sizes are ~2x the largest size each piece
is shown at, so the camera can come close without the textures going soft."""
from PIL import Image

SRC, OUT = 'public/assets/elements', 'public/assets/passage'

PIECES = {
    # name in /passage            source element                max width (px)
    'portrait-lace-oval':        ('lace-frame-oval-white',       1100),
    'envelope-burgundy':         ('envelope-burgundy-lace',       720),
    'handkerchief':              ('lace-handkerchief-ivory',      640),
    'florals-burgundy':          ('florals-cluster-burgundy',     560),
    'florals-white':             ('florals-cluster-white',        560),
    'calla-lilies':              ('calla-lilies-white',           560),
    'seal-rose':                 ('wax-seal-burgundy-gold-rose',  300),
    'ribbon':                    ('lace-ribbon-florals-vertical', 200),
    'orchid':                    ('orchid-burgundy',              360),
}

for name, (src, max_w) in PIECES.items():
    im = Image.open(f'{SRC}/{src}.png').convert('RGBA')
    im = im.crop(im.getbbox())
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    im.save(f'{OUT}/{name}.webp', quality=84, method=6)
    print(f'{name:22s} {im.size}')

# The portrait's window: where the transparent centre of the lace oval sits,
# as fractions of the trimmed frame (mirrored in passage.css --hole-*).
f = Image.open(f'{SRC}/lace-frame-oval-white.png').convert('RGBA')
L, T, R, B = f.getbbox()
w, h = R - L, B - T
print('hole  x %.4f  y %.4f  w %.4f  h %.4f' % ((232 - L) / w, (256 - T) / h, (508 - 232) / w, (724 - 256) / h))
