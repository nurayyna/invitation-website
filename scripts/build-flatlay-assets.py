"""Trims the supplied keepsake elements for the site-wide flat-lay (the
arrangement the camera pulls back to between sections) and exports them as
web-sized WebP.  Run:  python3 scripts/build-flatlay-assets.py
Outputs to public/assets/flatlay/.  Pieces are shown small, so 2x their
largest on-screen size is enough."""
from PIL import Image

SRC, OUT = 'public/assets/elements', 'public/assets/flatlay'

PIECES = {
    # name in /flatlay          (source file,                      max width px)
    'velvet-plaque':            ('velvet-frame-scalloped-plum.png',   420),
    'lace-panel':               ('lace-frame-rectangle-ivory.png',    420),
    'embossed-sheet':           ('paper-embroidered-ivory.jpg',       420),
    'lace-oval':                ('lace-frame-oval-white.png',         300),
    'envelope-seal':            ('envelope-ivory-wax-seal.png',       420),
    'envelope-lace':            ('envelope-ivory-lace.png',           380),
    'envelope-sage':            ('envelope-sage-lined-open.png',      380),
    'envelope-burgundy':        ('envelope-burgundy-lace.png',        380),
    'tray-oval':                ('silver-tray-oval.png',              420),
    'tray-handkerchief':        ('silver-tray-handkerchief.png',      380),
    'lace-heart':               ('lace-heart-2027-bride.png',         300),
    'lace-trim-burgundy':       ('lace-trim-burgundy.png',            160),
    'lace-trim-sage':           ('lace-trim-sage.png',                160),
    'ribbon':                   ('lace-ribbon-florals-vertical.png',  110),
    'handkerchief':             ('lace-handkerchief-ivory.png',       340),
    'bow-garland':              ('bow-garland-ivory.png',             360),
    'bouquet-mixed':            ('bouquet-burgundy-mixed.png',        300),
    'bouquet-burgundy':         ('bouquet-cascade-burgundy.png',      260),
    'bouquet-white':            ('bouquet-cascade-white.png',         260),
    'florals-burgundy':         ('florals-cluster-burgundy.png',      300),
    'florals-white':            ('florals-cluster-white.png',         300),
    'florals-amaranth':         ('florals-amaranth-burgundy.png',     300),
    'calla-white':              ('calla-lilies-white.png',            300),
    'calla-burgundy':           ('calla-lilies-burgundy.png',         240),
    'orchid':                   ('orchid-burgundy.png',               220),
    'seal-rose':                ('wax-seal-burgundy-gold-rose.png',   160),
    'name-plaque':              ('name-plaque-floral.png',            300),
    'velvet-cameo':             ('velvet-cameo-burgundy.png',         220),
    'velvet-oval':              ('velvet-oval-burgundy-florals.png',  300),
    'velvet-oval-small':        ('velvet-oval-burgundy-small.png',    260),
    'frame-baroque':            ('frame-oval-baroque-pink.png',       280),
    'frame-swans':              ('frame-oval-lace-swans.png',         280),
    'frame-ribbon':             ('lace-frame-ribbon-blush.png',       300),
}

for name, (src, max_w) in PIECES.items():
    im = Image.open(f'{SRC}/{src}')
    im = im.convert('RGBA') if src.endswith('.png') else im.convert('RGB')
    if im.mode == 'RGBA':
        im = im.crop(im.getbbox())
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    im.save(f'{OUT}/{name}.webp', quality=82, method=6)
    print(f'{name:20s} {im.size}  ar {im.width / im.height:.3f}')

# a small copy of the Garden's painting for its framed miniature
g = Image.open('public/assets/art/wivenhoe-park-1400.webp').convert('RGB')
g = g.resize((480, round(g.height * 480 / g.width)), Image.LANCZOS)
g.save(f'{OUT}/garden-miniature.webp', quality=80, method=6)
print('garden-miniature', g.size)
