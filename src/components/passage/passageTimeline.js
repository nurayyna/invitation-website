// Choreography for the Invitation → Our Story passage. No React, no content:
// it takes the passage's root node and wires one pinned, scrubbed timeline
// to the scroll. The timeline drives a single camera — { x, y, k }: the point
// of the table at the centre of the screen, in card widths from the card's
// centre, and the zoom — and every frame is drawn from it (see render).
//
//   0  hold on the invitation, exactly as the opening leaves it (reading)
//   1  the camera pulls back: the card lies among the wedding keepsakes
//   2  it drifts to the lace-framed portrait, the rest of the table quietens
//   3  it moves in and through the portrait's window
//   4  the photograph gives way to the paper of Our Story; the camera settles
//
import { gsap, ScrollTrigger, DESKTOP } from '../../lib/motion'

const SCROLL_LENGTH = { desktop: 3.2, mobile: 2.6 }   // viewport-heights the scene lasts
const OPEN = 1.5          // how far the window's edge blooms past the lace as we pass through
const BLEED = 1.04        // the photo runs just under the lace's inner scallops

export function buildPassage(root) {
  const q = gsap.utils.selector(root)
  const stage   = q('.passage__stage')[0]
  const card    = q('.card-wrap')[0]
  const frame   = q('[data-portrait]')[0]
  const portal  = q('.passage__portal')[0]
  const photo   = q('.passage__photo')[0]
  const layers  = q('.passage__layer').map((el) => ({ el, depth: Number(el.dataset.depth) || 1 }))
  const keepsakes = q('.passage__layer .ks:not([data-portrait])')
  const world   = q('.passage__layer:not(.passage__layer--frame):not(.passage__layer--near)')
  const frameLayer = q('.passage__layer--frame')[0]

  root.dataset.live = ''

  // ── Measuring: layout only (offset*/client* ignore transforms) ──────────
  const m = {}
  const measure = () => {
    const css = getComputedStyle(stage)
    const num = (name) => parseFloat(css.getPropertyValue(name))
    m.vw = stage.clientWidth
    m.vh = stage.clientHeight
    m.W  = card.offsetWidth
    // The portrait's window, from the fractions in passage.css. .ks boxes
    // are centred on their left/top by translate: -50% -50%.
    const fw = frame.offsetWidth, fh = frame.offsetHeight
    const fcs  = getComputedStyle(frame)
    const frac = (name) => parseFloat(fcs.getPropertyValue(name))
    const hw = frac('--hole-w') * fw, hh = frac('--hole-h') * fh
    m.hole = {                          // centre in card widths from the card's centre; radii in px
      x: (frame.offsetLeft - fw / 2 + frac('--hole-x') * fw + hw / 2 - m.vw / 2) / m.W,
      y: (frame.offsetTop  - fh / 2 + frac('--hole-y') * fh + hh / 2 - m.vh / 2) / m.W,
      rx: hw / 2,
      ry: hh / 2,
    }
    m.frame = { w: fw, h: fh }
    m.pull = { x: num('--pull-x'), y: num('--pull-y'), w: num('--pull-w'), h: num('--pull-h') }

    photo.style.width  = `${m.hole.rx * 2 * BLEED}px`
    photo.style.height = `${m.hole.ry * 2 * BLEED}px`
  }
  measure()

  // Zoom at which the whole arrangement fits the screen
  const kPull = () => Math.min(m.vw / (m.pull.w * m.W), m.vh / (m.pull.h * m.W))
  // Zoom at which the portrait is the subject: most of the height, never too wide
  const kPortrait = () => Math.min((m.vh * 0.8) / m.frame.h, (m.vw * 0.62) / m.frame.w)
  // Zoom at which the (bloomed) window encloses the whole screen
  const kThrough = () => {
    const s = Math.hypot(m.vw / 2 / m.hole.rx, m.vh / 2 / m.hole.ry)
    return (s / (OPEN * BLEED)) * 1.03
  }

  // ── Drawing a frame ─────────────────────────────────────────────────────
  const cam  = { x: 0, y: 0, k: 1, open: 1 }
  const render = () => {
    const cx = m.vw / 2, cy = m.vh / 2
    for (const { el, depth } of layers) {
      const k = Math.pow(cam.k, depth)
      // screen = C + (P - C - cam·W)·k   →   translate(C - (C + cam·W)·k) scale(k)
      const tx = cx - (cx + cam.x * m.W) * k
      const ty = cy - (cy + cam.y * m.W) * k
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${k})`
    }
    // the window, where the portrait's layer puts it, then opened out
    const wx = cx + (m.hole.x - cam.x) * m.W * cam.k
    const wy = cy + (m.hole.y - cam.y) * m.W * cam.k
    const s  = cam.k * BLEED * cam.open
    const rx = m.hole.rx * s, ry = m.hole.ry * s
    portal.style.clipPath = `ellipse(${rx}px ${ry}px at ${wx}px ${wy}px)`
    photo.style.transform = `translate3d(${wx - rx}px, ${wy - ry}px, 0) scale(${cam.k * cam.open})`
  }

  const length = () => m.vh * (window.matchMedia(DESKTOP).matches ? SCROLL_LENGTH.desktop : SCROLL_LENGTH.mobile)
  const show = (on) => { root.style.visibility = on ? 'visible' : 'hidden' }

  const refreshInit = () => measure()
  ScrollTrigger.addEventListener('refreshInit', refreshInit)

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    onUpdate: render,
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: () => `+=${length()}`,
      pin: true,
      scrub: 0.8,                       // the opening's own weight, so the hand-over feels the same
      anticipatePin: 1,
      invalidateOnRefresh: true,
      // Visible from the exact scroll position the opening ends on: before it,
      // the opening is still on screen beneath, drawn the same.
      onEnter: () => show(true),
      onLeaveBack: () => show(false),
      onRefresh: (self) => { show(self.scroll() >= self.start); render() },
    },
  })

  tl
    // 0 · reading: nothing moves; the scroll cue goes once the guest scrolls on
    .to(q('[data-cue]'), { autoAlpha: 0, duration: 0.6 }, 0.2)

    // 1 · pull back to the whole arrangement
    .to(cam, { x: () => m.pull.x, y: () => m.pull.y, k: kPull, duration: 3, ease: 'power2.inOut' }, 1.2)
    .fromTo(keepsakes, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.4, stagger: 0.08, ease: 'power1.out', immediateRender: true }, 1.35)

    // 2 · find the portrait; the rest of the table falls into shade
    .to(cam, { x: () => m.hole.x, y: () => m.hole.y, k: kPortrait, duration: 2.4, ease: 'power2.inOut' }, 4.5)
    .to(q('.passage__scrim'), { opacity: 1, duration: 2, ease: 'power1.inOut' }, 4.9)

    // 3 · through the window: the lace passes beyond the edges of the frame
    .to(cam, { k: kThrough, duration: 2.8, ease: 'power3.inOut' }, 7.3)
    .to(cam, { open: OPEN, duration: 1.3, ease: 'power2.in' }, 8.8)
    .to(frameLayer, { autoAlpha: 0, duration: 0.9, ease: 'power1.in' }, 9.15)
    .to(q('.passage__vignette, .passage__scrim'), { autoAlpha: 0, duration: 1, ease: 'power1.inOut' }, 9.1)
    .set([...world, q('.passage__layer--near')[0], q('.opening__ground')[0]], { autoAlpha: 0 }, 10.1)

    // 4 · the photograph gives way to the paper of Our Story
    .to(photo, { autoAlpha: 0, duration: 1.1, ease: 'power1.inOut' }, 10.1)
    .to({}, { duration: 0.5 })          // the camera rests before the page moves on

  render()

  return () => {
    ScrollTrigger.removeEventListener('refreshInit', refreshInit)
    delete root.dataset.live
    root.style.visibility = ''
  }
}
