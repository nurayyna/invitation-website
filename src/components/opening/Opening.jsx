import { useRef } from 'react'
import { wedding } from '../../content/wedding'
import { gsap, useGSAP, REDUCED_MOTION, FULL_MOTION } from '../../lib/motion'
import { EnvelopeBack, EnvelopeFront } from './Envelope'
import InvitationCard from './InvitationCard'
import { buildScrollOpening, showOpened } from './openingTimeline'
import './opening.css'

/**
 * The opening: the whole viewport is a close-up of a sealed, lace-trimmed
 * envelope. Scrolling is the interaction — the scene is pinned while one
 * scrubbed timeline moves the camera in, opens the flap and draws out the
 * card, which is left behind as the page's hero.
 *
 * "Scroll to open" plays the same scroll automatically for keyboard and
 * assistive-tech users; "Skip" jumps straight to the opened invitation.
 */
export default function Opening() {
  const section = useRef(null)
  const back    = useRef(null)
  const front   = useRef(null)
  const card    = useRef(null)
  const heading = useRef(null)
  const scene   = useRef(null)      // the scrubbed timeline, when motion is on

  useGSAP(() => {
    const els = { section: section.current, back: back.current, front: front.current, card: card.current }
    const mm = gsap.matchMedia()
    mm.add(FULL_MOTION, () => {
      scene.current = buildScrollOpening(els)
      return () => { scene.current = null }
    })
    mm.add(REDUCED_MOTION, () => showOpened(els))
  }, { scope: section })

  const sceneEnd = () => scene.current?.scrollTrigger.end ?? 0

  // Plays the scroll for the guest. Any wheel / touch input takes over again.
  const { contextSafe } = useGSAP({ scope: section })
  const play = contextSafe(() => {
    if (!scene.current) return
    const root = document.documentElement
    const restore = () => { root.style.scrollBehavior = '' }
    root.style.scrollBehavior = 'auto'          // CSS smooth-scroll would fight the tween
    gsap.to(window, {
      scrollTo: { y: sceneEnd(), autoKill: true },
      duration: 7,
      ease: 'power1.inOut',
      onComplete: () => { restore(); heading.current?.focus({ preventScroll: true }) },
      onInterrupt: restore,
    })
  })

  const skip = () => {
    window.scrollTo({ top: sceneEnd(), behavior: 'instant' })
    heading.current?.focus({ preventScroll: true })
  }

  const { couple } = wedding

  return (
    <section id="home" ref={section} className="opening" aria-label="Wedding invitation">
      {/* The table the invitation ends up on */}
      <div className="opening__ground" aria-hidden="true">
        <img className="keepsake lace-curtain" data-ground src="/assets/keepsakes/lace-drape.webp" alt="" />
        <span className="keepsake ground__bouquet ground__bouquet--a" data-ground>
          <img src="/assets/keepsakes/bouquet.webp" alt="" />
        </span>
        <span className="keepsake ground__bouquet ground__bouquet--b" data-ground>
          <img src="/assets/keepsakes/bouquet.webp" alt="" />
        </span>
      </div>

      <div className="opening__stage">
        <EnvelopeBack ref={back} />
        <InvitationCard ref={card} headingRef={heading} />
        <EnvelopeFront ref={front} />
      </div>

      {/* Lettering on the flap. The real heading is the names on the card. */}
      <div className="opening__title" data-before aria-hidden="true">
        <p className="opening__eyebrow">A Wedding Invitation</p>
        <p className="opening__names">
          {couple.first} <span>&amp;</span> {couple.second}
        </p>
      </div>

      {/* Foreground: nearest the camera, first to leave the frame */}
      <span className="opening__fg opening__fg--drape" data-fg="1" data-fg-y="0" aria-hidden="true">
        <img src="/assets/keepsakes/lace-drape.webp" alt="" />
      </span>
      <span className="opening__fg opening__fg--bouquet" data-fg="-1" data-fg-y="1" aria-hidden="true">
        <img src="/assets/keepsakes/bouquet.webp" alt="" />
      </span>

      <div className="opening__vignette" aria-hidden="true" />

      <button type="button" className="opening__hint" data-before onClick={play}>
        <span aria-hidden="true" className="opening__hint-rule" />
        Scroll to open
        <span aria-hidden="true" className="opening__hint-rule" />
      </button>

      <button type="button" className="opening__skip" data-before onClick={skip}>
        Skip
      </button>

      <a className="opening__scroll label" href="#garden" data-after>
        Scroll
        <span aria-hidden="true" />
      </a>
    </section>
  )
}
