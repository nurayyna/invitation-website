// Choreography for the scroll-driven opening. No React, no content — it takes
// DOM nodes and wires one scrubbed, pinned GSAP timeline to the scroll:
//
//   0   the camera eases in; title and foreground drift out of frame
//   1   the seal gives
//   2   the flap swings up towards the viewer and over the top
//   3   the card is drawn out while the envelope falls away below
//   4   the card comes forward; the names are written
//
import { gsap, ease } from '../../lib/motion'

const SCROLL_LENGTH = 3.4      // viewport-heights of scrolling the scene lasts
const FLAP_SHADOW = 'drop-shadow(0 0.5rem 0.9rem rgba(24, 2, 8, 0.6))'

const parts = (els) => {
  const q = gsap.utils.selector(els.section)
  return {
    flapOuter: q('[data-flap="outer"]')[0],
    flapInner: q('[data-flap="inner"]')[0],
    seal:      q('.flap__seal')[0],
    names:     q('[data-anim="names"]')[0],
    rule:      q('[data-anim="rule"]')[0],
    print:     q('[data-anim="print"]'),
    after:     q('[data-after]'),
    before:    q('[data-before]'),
    fg:        q('[data-fg]'),
    env:       [els.back, els.front],
  }
}

/** Reduced motion: no scene, just the invitation as it ends up. */
export function showOpened(els) {
  const p = parts(els)
  gsap.set([...p.env, ...p.before, ...p.fg], { autoAlpha: 0 })
  gsap.set(p.after, { autoAlpha: 1 })
}

/** Returns the scrubbed timeline; its .scrollTrigger exposes start/end. */
export function buildScrollOpening(els) {
  const p = parts(els)
  const { section, card } = els
  const vh = () => section.clientHeight

  gsap.set([p.flapOuter, p.flapInner], { transformPerspective: 1800, transformOrigin: '50% 0%' })
  gsap.set(p.env, { transformOrigin: '50% 55%' })

  // One value drives both flap faces so they can never drift apart.
  const swing = { angle: 0 }
  const renderFlap = () => {
    const a = swing.angle
    const outward = a < 90
    gsap.set([p.flapOuter, p.flapInner], { rotationX: a })
    p.flapOuter.style.visibility = outward ? 'visible' : 'hidden'
    p.flapInner.style.visibility = outward ? 'hidden' : 'visible'
    // Paper darkens as it turns edge-on to the light.
    const shade = outward ? 1 - 0.3 * (a / 90) : 0.72 + 0.28 * ((a - 90) / 90)
    ;(outward ? p.flapOuter : p.flapInner).style.filter = `brightness(${shade.toFixed(3)}) ${FLAP_SHADOW}`
  }

  // Where the card waits inside the pocket: its top edge ~30% down the screen.
  const tucked = () => card.offsetHeight * 0.43 - vh() * 0.2

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${vh() * SCROLL_LENGTH}`,
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  })

  tl
    // 0 · camera eases in; 2.5D parallax — nearer layers travel further
    .to(p.env, { scale: 1.07, duration: 2, ease: 'power1.inOut' }, 0)
    .to(p.before, { autoAlpha: 0, y: () => vh() * -0.05, duration: 1.1, stagger: 0.08 }, 0.15)
    .to(p.fg, {
      scale: 1.55,
      xPercent: (i, el) => Number(el.dataset.fg) * 38,
      yPercent: (i, el) => (el.dataset.fgY ? Number(el.dataset.fgY) : 0) * 38,
      duration: 2.4, ease: 'power1.in',
    }, 0)
    .to(p.fg, { autoAlpha: 0, duration: 1 }, 1.4)

    // 1 · the seal gives
    .to(p.seal, { scale: 0.93, duration: 0.3, ease: 'power2.in' }, 1.25)
    .to(p.seal, { scale: 1, rotation: -5, duration: 0.5, ease: ease.settle }, 1.55)

    // 2 · the flap swings up and over
    .to(swing, { angle: 180, duration: 2.9, ease: 'power1.inOut', onUpdate: renderFlap }, 1.9)

    // 3 · card drawn out, envelope falls away (the open flap passes through)
    .fromTo(card, { y: tucked }, { y: 0, duration: 3.4, ease: ease.fold, immediateRender: true }, 4.3)
    .to(p.env, { y: () => vh() * 2.05, scale: 1.3, duration: 3.6, ease: ease.fold }, 4.3)

    // 4 · the card comes forward; the names are written
    .fromTo(card, { scale: 0.86 }, { scale: 1, duration: 2.6, ease: ease.fold, immediateRender: true }, 5.3)
    .fromTo(p.names,
      { clipPath: 'inset(-20% 105% -20% -5%)' },
      { clipPath: 'inset(-20% -5% -20% -5%)', duration: 1.7, ease: ease.ink }, 7.3)
    .from(p.print, { autoAlpha: 0, y: 8, duration: 0.8, stagger: 0.18, ease: ease.settle }, 7.4)
    .from(p.rule, { scaleX: 0, autoAlpha: 0, duration: 0.9, ease: ease.fold }, 7.9)
    .fromTo(p.after, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 8.6)
    .set(p.env, { autoAlpha: 0 }, 8.2)
    .to({}, { duration: 0.6 })          // a breath on the finished card before the page moves on

  return tl
}
