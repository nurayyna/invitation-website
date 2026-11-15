// Choreography for a KeepsakeTransition. No React, no content: it takes the
// transition's root node and wires one pinned, scrubbed timeline to the scroll.
//
// The timeline tweens a single number, cam.t:
//
//   0 → 1   pull back from the piece just read until the whole flat-lay shows
//   (rest)  the arrangement holds still for a moment
//   1 → 2   glide to the next piece and move in until its paper fills the view
//
// and every frame is drawn from it (see render): zoom is eased on a log scale
// so it feels even, the camera's aim slides between the piece and the centre
// of the table as the view widens, and it turns to square up with each piece,
// which lie at slight angles like real stationery.
//
import { gsap, ScrollTrigger, DESKTOP } from '../../lib/motion'

const SCROLL_LENGTH = { desktop: 1.35, mobile: 1.15 }   // viewport-heights each move lasts
const DEPTHS = { paper: 0.52, label: 0.6 }             // fractions of the full zoom where
                                                        // the close-up paper / the lettering give way

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const smooth = (a, b, v) => { const x = clamp01((v - a) / (b - a)); return x * x * (3 - 2 * x) }

export function buildTransition(root, { from, to }) {
  const q = gsap.utils.selector(root)
  const stage  = q('.kt__stage')[0]
  const layers = q('.kt__layer').map((el) => ({ el, depth: Number(el.dataset.depth) || 1 }))
  const board  = q('.fl-board')[0]
  const piece  = (id) => q(`[data-piece="${id}"]`)[0]
  const paperFrom = q('.kt__paper--from')[0]
  const paperTo   = q('.kt__paper--to')[0]
  const vignette  = q('.kt__vignette')[0]

  root.dataset.live = ''

  // ── Measuring: layout only (offset*/client* ignore transforms) ──────────
  const m = {}
  const focus = (el) => {
    // The board and its items are centred on their left/top by
    // translate: -50% -50%, which offset* does not include.
    const w = el.offsetWidth, h = el.offsetHeight
    return {
      x: m.cx - board.offsetWidth / 2 + el.offsetLeft,
      y: m.cy - board.offsetHeight / 2 + el.offsetTop,
      tilt: parseFloat(getComputedStyle(el).rotate) || 0,
      // close enough that the screen sits wholly inside the piece's plain middle
      k: Math.max(m.vw / (w * 0.72), m.vh / (h * 0.62)) * 1.02,
    }
  }
  const measure = () => {
    m.vw = stage.clientWidth
    m.vh = stage.clientHeight
    m.cx = board.offsetLeft
    m.cy = board.offsetTop
    m.a = focus(piece(from))
    m.b = focus(piece(to))
    alignEmboss()
  }

  // An embossed section's margins are a repeating relief: start the close-up
  // paper where the section above left off, so the pattern runs on unbroken.
  const alignEmboss = () => {
    if (!paperFrom.classList.contains('section--emboss')) return
    const above = document.getElementById(from)
    if (!above) return
    const sizes = getComputedStyle(paperFrom).backgroundSize.split(',').map((s) => parseFloat(s))
    const relief = sizes[0] * 10, linen = sizes[2] * 2.5      // tile heights (see keepsakes.css)
    const h = above.offsetHeight
    paperFrom.style.backgroundPosition =
      `left ${-(h % relief)}px, right ${-(h % relief)}px, center ${-(h % linen)}px`
  }
  measure()

  // ── Drawing a frame ─────────────────────────────────────────────────────
  const cam = { t: 0 }
  const render = () => {
    const out = cam.t <= 1
    const p = out ? m.a : m.b
    const depth = out ? 1 - cam.t : cam.t - 1          // 1 = close on the piece, 0 = whole table
    const k = Math.exp(Math.log(p.k) * depth)
    // how much of the way the aim has slid from the piece to the table's centre
    const wide = (1 / k - 1 / p.k) / (1 - 1 / p.k)
    const fx = p.x + (m.cx - p.x) * wide
    const fy = p.y + (m.cy - p.y) * wide
    const turn = -p.tilt * (1 - wide)

    for (const { el, depth: d } of layers) {
      const kd = Math.pow(k, d)
      el.style.transform =
        `translate3d(${m.vw / 2}px, ${m.vh / 2}px, 0) rotate(${turn}deg) scale(${kd}) translate(${-fx}px, ${-fy}px)`
    }

    const close = smooth(DEPTHS.paper, 0.92, depth)
    paperFrom.style.opacity = out ? close : 0
    paperTo.style.opacity   = out ? 0 : close
    vignette.style.opacity  = 1 - close
    stage.style.setProperty('--fl-label', 1 - smooth(0.22, DEPTHS.label, depth))
  }

  const length = () => m.vh * (window.matchMedia(DESKTOP).matches ? SCROLL_LENGTH.desktop : SCROLL_LENGTH.mobile)
  const refreshInit = () => measure()
  ScrollTrigger.addEventListener('refreshInit', refreshInit)

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    onUpdate: render,
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: () => `+=${length()}`,
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      // layers are only promoted while the scene is on screen
      onToggle: (self) => root.classList.toggle('is-active', self.isActive),
      onRefresh: render,
    },
  })

  tl
    .to(cam, { t: 1, duration: 2.2 })
    .to(cam, { t: 2, duration: 2.2 }, '+=0.45')     // the flat-lay rests in view
    .to({}, { duration: 0.12 })

  render()

  return () => {
    ScrollTrigger.removeEventListener('refreshInit', refreshInit)
    delete root.dataset.live
    root.classList.remove('is-active')
  }
}
