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
const OPENING_EXTRA = 0.45                               // …plus, after the opening, time to read the card
const PAPER = [0.36, 0.8]   // fractions of the full zoom over which the close-up paper takes over,
                             // before the once-drawn flat-lay is magnified far enough to look soft

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
  // After the opening (from="card") the move starts on the invitation card
  // itself: a full-size twin of the opening's last frame, which shrinks into
  // the card at the heart of the flat-lay as the camera pulls back.
  const fromCard = from === 'card'
  const replica  = q('.kt__replica')[0]
  const openingDressing = q('.kt__replica > .lace-curtain, .kt__cue')

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
    m.a = fromCard
      ? { x: m.cx, y: m.cy, tilt: 0,      // the card lies square at the centre of the board
          k: replica.querySelector('.card-wrap').offsetWidth / board.querySelector('.card-wrap').offsetWidth }
      : focus(piece(from))
    m.b = focus(piece(to))
    alignEmboss()
  }

  // An embossed section's margins are a repeating relief: start the close-up
  // paper where the section above left off, so the pattern runs on unbroken.
  const alignEmboss = () => {
    if (!paperFrom || !paperFrom.classList.contains('section--emboss')) return
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

    if (!warming) for (const { el, depth: d } of layers) {
      const kd = Math.pow(k, d)
      el.style.transform =
        `translate3d(${m.vw / 2}px, ${m.vh / 2}px, 0) rotate(${turn}deg) scale(${kd}) translate(${-fx}px, ${-fy}px)`
    }

    // opacity only, on layers of their own: nothing is repainted
    const close = smooth(PAPER[0], PAPER[1], depth)
    paperTo.style.opacity = out ? 0 : close * 0.999
    if (!fromCard) {
      paperFrom.style.opacity = out ? close * 0.999 : 0
      vignette.style.opacity  = 1 - close
      return
    }
    // From the card: the flat-lay comes up around the full-size card as the
    // camera starts back, and only then is that card exchanged for the one
    // on the table, which by now is the same size in the same place.
    const around = out ? 1 - smooth(0.74, 0.98, depth) : 1
    for (const { el } of layers) el.style.opacity = Math.max(0.01, around)
    replica.style.opacity   = out ? smooth(0.4, 0.66, depth) : 0
    // the opening's lace curtain and scroll cue belong to its close-up only
    const dressing = out ? smooth(0.86, 0.99, depth) : 0
    for (const el of openingDressing) el.style.opacity = dressing
    replica.style.transform = `scale(${out ? k / p.k : 1 / p.k})`
    vignette.style.opacity  = out ? 1 : 1 - close
  }

  // ── Keeping it cheap ────────────────────────────────────────────────────
  // The flat-lay is drawn once, at its natural size, into two GPU layers that
  // the camera then only moves. A browser fixes the resolution of such a layer
  // the first time it draws it, so each time the scene comes on screen the
  // layers are held square-on for a moment before the camera takes them. The
  // guest sees none of it: the scene always arrives behind its close-up paper
  // (kept a hair short of opaque, or the browser would skip drawing what is
  // underneath). Off screen the layers are not drawn at all.
  const WARM_MS = 260
  let warming = false, warmId = 0
  const setNear = (near) => {
    root.classList.toggle('is-near', near)
    clearTimeout(warmId)
    warming = near
    if (!near) return
    for (const { el } of layers) el.style.transform = 'none'
    warmId = setTimeout(() => { warming = false; render() }, WARM_MS)
  }

  const length = () => m.vh * (
    (window.matchMedia(DESKTOP).matches ? SCROLL_LENGTH.desktop : SCROLL_LENGTH.mobile) + (fromCard ? OPENING_EXTRA : 0))
  // After the opening the scene lies over the opening's last screen and is
  // shown from the exact scroll position the opening ends on — until then the
  // opening itself is on screen beneath, drawn the same. (Nearly, not fully,
  // transparent, so the browser still prepares its layers.)
  const show = (on) => { if (fromCard) root.style.opacity = on ? '' : '0.002' }
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
      onEnter: () => show(true),
      onLeaveBack: () => show(false),
      onRefresh: (self) => { show(self.scroll() >= self.start); render() },
    },
  })

  // "near": any part of the scene is on screen
  const near = ScrollTrigger.create({
    start: () => tl.scrollTrigger.start - m.vh,
    end: () => tl.scrollTrigger.end + m.vh,
    onToggle: (self) => setNear(self.isActive),
    onRefresh: (self) => { if (self.isActive !== root.classList.contains('is-near')) setNear(self.isActive) },
  })

  if (fromCard) tl.to({}, { duration: 0.8 })          // the card rests, to be read
  tl
    .to(cam, { t: 1, duration: 2.2 })
    .to(cam, { t: 2, duration: 2.2 }, '+=0.45')     // the flat-lay rests in view
    .to({}, { duration: 0.12 })

  render()

  return () => {
    ScrollTrigger.removeEventListener('refreshInit', refreshInit)
    clearTimeout(warmId)
    near.kill()
    delete root.dataset.live
    root.classList.remove('is-near')
    root.style.opacity = ''
  }
}
