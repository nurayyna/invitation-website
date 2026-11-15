import { wedding } from '../../content/wedding'
import InvitationCard from '../opening/InvitationCard'

const A = '/assets/flatlay'

// Placement: [x %, y %, width in board-widths %, tilt °] on the landscape
// board (L) and the portrait board (P). x/y are the item's centre.
const place = (L, P) => ({
  '--x': L[0], '--y': L[1], '--w': L[2], '--r': L[3] ?? 0,
  '--px': P ? P[0] : 0, '--py': P ? P[1] : 0, '--pw': P ? P[2] : 0, '--pr': P ? (P[3] ?? 0) : 0,
})

/* ── The stationery: one piece per section ─────────────────────────────────
   `body` is a supplied element used as the piece itself; without one the
   piece is cut from paper in CSS (see .fl-piece--*). */
const PIECES = [
  { id: 'story',      body: 'embossed-sheet', eyebrow: 'How it began',                 title: 'Our Story',
    at: place([12.5, 29, 13.5, -4],  [25, 13.5, 30, -3]) },
  { id: 'garden',                              eyebrow: 'The English Garden',           title: null,
    at: place([33, 25.5, 14.5, 2.5], [74, 14.5, 33, 3]) },
  { id: 'invitation', body: 'velvet-plaque',  eyebrow: 'Together with their families', title: 'Invitation',
    at: place([67, 26, 15, -2],      [75, 38, 34, -2]) },
  { id: 'events',                              eyebrow: wedding.dateLong,               title: 'Order of the Day',
    at: place([88, 30, 13.5, 3.5],   [25, 38.5, 31, 2.5]) },
  { id: 'venue',                               eyebrow: 'The Venue',                    title: wedding.venue.name,
    at: place([87.5, 72, 13.5, -3],  [25, 63, 31, -3]) },
  { id: 'dress-code', body: 'lace-panel',     eyebrow: 'Attire',                       title: 'Dress Code',
    at: place([66.5, 74, 15, 2],     [75, 62.5, 35, 2]) },
  { id: 'rsvp',                                eyebrow: 'Will you be joining us?',      title: 'Kindly Reply',
    at: place([33.5, 73, 14.5, -2.5], [74, 86.5, 33, -2]) },
  { id: 'closing',                             eyebrow: null,                           title: wedding.closing.message,
    at: place([12.5, 72, 13.5, 4],   [26, 87, 31, 3.5]) },
]

/* ── Everything laid around them ───────────────────────────────────────────
   under: lies beneath the stationery · over: rests on or beside it, a little
   nearer the lens. P = null leaves the item off the (narrower) portrait board. */
const UNDER = [
  ['envelope-lace',      place([7.5, 19, 12.5, -14],  null)],
  ['envelope-burgundy',  place([38, 36.5, 12.5, -12], [35, 44.5, 23, -12])],
  ['handkerchief',       place([59.5, 60.5, 12, 14],  [65, 56, 23, 14])],
  ['envelope-seal',      place([28, 84.5, 14.5, -8],  [63, 94.5, 27, -8])],
  ['tray-oval',          place([87.5, 72, 19, 5],     [25, 63, 43, 5])],
  ['envelope-sage',      place([75.5, 87, 8.5, 14],   null)],
  ['lace-trim-burgundy', place([57, 14.5, 3.6, 24],   [93, 26, 7, 16])],
  ['lace-trim-sage',     place([77.2, 58.5, 3.4, -66], null)],
  ['tray-handkerchief',  place([49.5, 89, 9.5, -4],   null)],
]

const OVER = [
  ['bow-garland',        place([50, 30.5, 14, 0],     [50, 39.6, 27, 0])],
  ['bouquet-mixed',      place([49.5, 12.5, 7.5, -8], [50, 26, 14, -8])],
  ['seal-rose',          place([73, 41, 3, 12],       [88.5, 47.5, 6.5, 12])],
  ['florals-burgundy',   place([3.5, 49.5, 9.5, 0],   [4, 25.5, 19, 0])],
  ['florals-white',      place([97, 51.5, 10, 0],     [97, 75, 19, 0])],
  ['calla-white',        place([78.5, 10.5, 8, -30],  [94, 3.5, 15, -30])],
  ['calla-burgundy',     place([23, 90, 4.6, 24],     [6, 76, 9, 18])],
  ['orchid',             place([42, 62, 5.4, -10],    [44, 60.5, 11, -10])],
  ['bouquet-white',      place([97.5, 90, 5, -14],    [96.5, 51, 9, -14])],
  ['bouquet-burgundy',   place([2.5, 6.5, 5.4, 150],  null)],
  ['florals-amaranth',   place([58.5, 93, 7, 0],      [50, 97.5, 13, 0])],
  ['lace-heart',         place([22.5, 52.5, 7, -8],   [50, 75.5, 14, -8])],
  ['velvet-cameo',       place([23.5, 44, 3.8, -6],   [6, 50.5, 8, -6])],
  ['velvet-oval-small',  place([3.5, 92, 5.4, -12],   null)],
  ['frame-swans',        place([52, 72.5, 4.8, -6],   null)],
  ['frame-ribbon',       place([96.5, 9, 6.4, 8],     null)],
  ['frame-baroque',      place([43.5, 9.5, 4.6, 6],   null)],
  ['ribbon',             place([25.5, 61, 1.9, 62],   [50, 13, 3.4, 80])],
]

const Item = ([name, at]) => (
  <img
    key={name}
    className="fl-item"
    data-off-portrait={at['--pw'] ? undefined : ''}
    style={at}
    src={`${A}/${name}.webp`}
    alt=""
    loading="lazy"
    decoding="async"
  />
)

/**
 * The whole invitation suite as one flat-lay: every section is a piece of
 * stationery on the table, dressed with the lace, florals and keepsakes.
 * The camera of a KeepsakeTransition moves over two layers of it — the paper
 * (`far`) and what rests on it (`near`) — so it is rendered as two fragments.
 * Decorative only; the caller hides it from assistive tech.
 */
export default function FlatLay() {
  const { couple, story } = wedding

  return (
    <>
      <div className="kt__layer" data-depth="1">
        <div className="fl-board">
          {UNDER.map(Item)}

          {PIECES.map(({ id, body, eyebrow, title, at }) => (
            <div key={id} className={`fl-item fl-piece fl-piece--${id}`} data-piece={id} style={at}>
              {body
                ? <img className="fl-piece__body" src={`${A}/${body}.webp`} alt="" loading="lazy" decoding="async" />
                : <span className="fl-piece__paper" />}
              <div className="fl-piece__label">
                {id === 'garden' && (
                  <span className="fl-piece__painting">
                    <img src={`${A}/garden-miniature.webp`} alt="" loading="lazy" decoding="async" />
                  </span>
                )}
                {eyebrow && <span className="fl-piece__eyebrow">{eyebrow}</span>}
                {title && <span className="fl-piece__title">{title}</span>}
                {id === 'closing' && (
                  <span className="fl-piece__eyebrow">{couple.first} &amp; {couple.second}</span>
                )}
                <span className="fl-piece__rule"><i>◆</i></span>
              </div>
            </div>
          ))}

          {/* The invitation itself, at the heart of the suite */}
          <div className="fl-item fl-card" style={place([50, 50, 23, 0], [50, 50, 25, 0])}>
            <InvitationCard />
          </div>
        </div>
      </div>

      <div className="kt__layer" data-depth="1.04">
        <div className="fl-board">
          {/* The couple's portrait, leaning on the corner of their story */}
          <div className="fl-item fl-portrait" style={place([19, 13.5, 7.4, 7], [41.5, 6, 15, 7])}>
            <span className="fl-portrait__photo">
              {story.portrait && <img src={story.portrait} alt="" loading="lazy" decoding="async" />}
            </span>
            <img src={`${A}/lace-oval.webp`} alt="" loading="lazy" decoding="async" />
          </div>
          {OVER.map(Item)}
        </div>
      </div>
    </>
  )
}
