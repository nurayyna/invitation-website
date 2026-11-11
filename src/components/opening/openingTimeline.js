// Choreography for the invitation opening. No React, no content — it receives
// DOM nodes and returns GSAP timelines, so the motion can be tuned in isolation.
import { gsap, ease } from '../../lib/motion'
import { ENVELOPE } from './envelopeGeometry'

const parts = (els) => {
  const q = gsap.utils.selector(els.section)
  return {
    flapOuter: q('[data-flap="outer"]')[0],
    flapInner: q('[data-flap="inner"]')[0],
    seal:      q('.envelope__seal')[0],
    names:     q('[data-anim="names"]')[0],
    rule:      q('[data-anim="rule"]')[0],
    print:     q('[data-anim="print"]'),
    after:     q('[data-after]'),
    env:       [els.back, els.front],
  }
}

// Where the card sits while tucked inside the envelope.
function restPose({ front, card }) {
  return {
    scale: (front.offsetWidth * ENVELOPE.cardFit) / card.offsetWidth,
    y: front.offsetHeight * ENVELOPE.cardDrop,
  }
}

/** Sealed-state layout. Safe to call again on resize. */
export function placeSealed(els) {
  const { flapOuter, flapInner, after } = parts(els)
  gsap.set(els.card, restPose(els))
  gsap.set([flapOuter, flapInner], {
    transformPerspective: els.front.offsetWidth * 2.2,
    transformOrigin: `50% ${ENVELOPE.hingeY}`,
  })
  gsap.set(after, { autoAlpha: 0 })
}

/** The envelope arriving on screen + its resting float. */
export function buildEntrance(els, { reduced }) {
  const { env } = parts(els)
  const tl = gsap.timeline({ defaults: { ease: ease.settle } })

  if (reduced) {
    return tl.from([...env, els.intro, els.controls], { autoAlpha: 0, duration: 0.4 })
  }

  tl.from(env, { autoAlpha: 0, y: 28, duration: 1.6 }, 0)
    .from(els.intro.children, { autoAlpha: 0, y: 14, duration: 1.1, stagger: 0.14 }, 0.35)
    .from(els.controls, { autoAlpha: 0, y: 10, duration: 0.9 }, 1.0)
  return tl
}

export function buildFloat(els) {
  const { env } = parts(els)
  return gsap.to(env, { y: -6, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
}

/** Seal → flap → card → hero. Returned paused; play() or progress(1) to skip. */
export function buildOpening(els, { reduced, onComplete }) {
  const p = parts(els)
  const { section, intro, controls, card } = els
  const tl = gsap.timeline({
    paused: true,
    onComplete() {
      // Hand the card back to CSS so the hero stays correct on resize.
      gsap.set([card, p.names, p.rule, ...p.print], { clearProps: 'all' })
      onComplete?.()
    },
  })

  if (reduced) {
    return tl
      .to([intro, controls, card, ...p.env], { autoAlpha: 0, duration: 0.3, ease: 'none' })
      .set(card, { scale: 1, y: 0 })
      .to([card, ...p.after], { autoAlpha: 1, duration: 0.4, ease: 'none' })
  }

  const envH   = els.front.offsetHeight
  const vh     = section.clientHeight
  const rest   = restPose(els)
  const cardHs = card.offsetHeight * rest.scale
  // Card rises as far as the viewport allows; the envelope sinks to make up the rest.
  const cardUp  = Math.min(envH * 0.62, Math.max(0, vh / 2 - cardHs / 2 - 12))
  const envDown = envH * 0.97 - cardUp

  // One value drives both flap faces so they can never drift apart.
  const swing = { angle: 0 }
  const renderFlap = () => {
    const a = swing.angle
    const outward = a < 90
    gsap.set([p.flapOuter, p.flapInner], { rotationX: a })
    p.flapOuter.style.visibility = outward ? 'visible' : 'hidden'
    p.flapInner.style.visibility = outward ? 'hidden' : 'visible'
    // Paper darkens as it turns edge-on to the light.
    const shade = outward ? 1 - 0.32 * (a / 90) : 0.7 + 0.3 * ((a - 90) / 90)
    ;(outward ? p.flapOuter : p.flapInner).style.filter = `brightness(${shade.toFixed(3)})`
  }

  tl.addLabel('seal', 0)
    .to([intro, controls], { autoAlpha: 0, y: -8, duration: 0.6, ease: ease.leave, stagger: 0.05 }, 'seal')
    .to(p.env, { y: 0, duration: 0.5, ease: ease.settle }, 'seal')
    // 1 · the seal is pressed, then gives
    .to(p.seal, { scale: 0.92, duration: 0.24, ease: 'power2.in' }, 'seal+=0.2')
    .to(p.seal, { scale: 1, rotation: -4, duration: 0.7, ease: ease.settle }, '>')

    // 2 · the flap unfolds
    .addLabel('flap', 'seal+=0.95')
    .to(swing, { angle: 180, duration: 1.6, ease: ease.fold, onUpdate: renderFlap }, 'flap')

    // 3 · the card is drawn out
    .addLabel('rise', 'flap+=1.25')
    .to(card, { y: -cardUp, duration: 1.7, ease: ease.paper }, 'rise')
    .to(p.env, { y: envDown, duration: 1.7, ease: ease.paper }, 'rise')

    // 4 · the envelope falls away, the card comes forward
    .addLabel('present', 'rise+=1.55')
    .to(p.env, { y: envDown + vh * 0.45, autoAlpha: 0, duration: 1.2, ease: ease.leave }, 'present')
    .to(card, { y: 0, scale: 1, duration: 1.6, ease: ease.paper }, 'present')

    // 5 · the names are written, the rest of the page arrives
    .addLabel('ink', 'present+=1.05')
    .fromTo(p.names,
      { clipPath: 'inset(-20% 105% -20% -5%)' },
      { clipPath: 'inset(-20% -5% -20% -5%)', duration: 1.6, ease: ease.ink }, 'ink')
    .from(p.print, { autoAlpha: 0, y: 8, duration: 0.9, stagger: 0.16, ease: ease.settle }, 'ink+=0.2')
    .from(p.rule, { scaleX: 0, autoAlpha: 0, duration: 1.0, ease: ease.fold }, 'ink+=0.7')
    .fromTo(p.after, { autoAlpha: 0, y: 14 },
      { autoAlpha: 1, y: 0, duration: 1.2, stagger: 0.15, ease: ease.settle }, 'ink+=0.6')

  return tl
}
