import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap, useGSAP, REDUCED_MOTION } from '../../lib/motion'
import { EnvelopeBack, EnvelopeFront } from './Envelope'
import InvitationCard from './InvitationCard'
import { placeSealed, buildEntrance, buildFloat, buildOpening } from './openingTimeline'
import './opening.css'

/**
 * The signature moment: a sealed envelope that opens into the page's hero.
 * state: 'sealed' → 'opening' → 'open'. Once open, the envelope is unmounted
 * and the card simply *is* the hero — no transforms left behind.
 *
 * onOpenStart fires on the user's gesture (use it for audio).
 * onOpened fires when the page is ready to be scrolled.
 */
export default function Opening({ onOpenStart, onOpened }) {
  const [state, setState]             = useState('sealed')
  const [assetsReady, setAssetsReady] = useState(false)

  const section  = useRef(null)
  const intro    = useRef(null)
  const controls = useRef(null)
  const back     = useRef(null)
  const front    = useRef(null)
  const card     = useRef(null)
  const heading  = useRef(null)

  const stateRef = useRef(state)
  stateRef.current = state
  const motion = useRef({ entrance: null, float: null, opening: null })

  const els = () => ({
    section: section.current, intro: intro.current, controls: controls.current,
    back: back.current, front: front.current, card: card.current,
  })
  const prefersReduced = () => window.matchMedia(REDUCED_MOTION).matches

  // Hold the scene until the envelope artwork has decoded, so the card is
  // never seen sitting on an empty stage.
  useEffect(() => {
    let live = true
    const imgs = [...section.current.querySelectorAll('.envelope img')]
    const done = () => live && setAssetsReady(true)
    Promise.all(imgs.map((img) => img.decode().catch(() => {}))).then(done)
    const fallback = setTimeout(done, 4000)
    return () => { live = false; clearTimeout(fallback) }
  }, [])

  // Sealed layout + entrance + idle float.
  const { contextSafe } = useGSAP(() => {
    if (stateRef.current !== 'sealed') return
    placeSealed(els())
    if (!assetsReady) return

    const mm = gsap.matchMedia()
    mm.add({ reduced: REDUCED_MOTION, full: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
      if (stateRef.current !== 'sealed') return
      const { reduced } = ctx.conditions
      motion.current.entrance = buildEntrance(els(), { reduced })
      if (!reduced) {
        motion.current.entrance.eventCallback('onComplete', () => {
          if (stateRef.current === 'sealed') motion.current.float = buildFloat(els())
        })
      }
    })
    return () => mm.revert()
  }, { scope: section, dependencies: [assetsReady] })

  // Keep the tucked-in card aligned if the viewport changes before opening.
  useEffect(() => {
    if (state !== 'sealed') return
    const onResize = () => placeSealed(els())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [state])

  const begin = contextSafe(() => {
    const m = motion.current
    m.entrance?.progress(1).kill()
    m.float?.kill()
    m.opening = buildOpening(els(), {
      reduced: prefersReduced(),
      onComplete: () => { setState('open'); onOpened?.() },
    })
    setState('opening')
    onOpenStart?.()
    return m.opening
  })

  const open = useCallback(() => {
    if (stateRef.current !== 'sealed') return
    begin().play()
  }, [begin])

  const skip = useCallback(() => {
    if (stateRef.current === 'open') return
    const tl = stateRef.current === 'sealed' ? begin() : motion.current.opening
    tl.progress(1)
  }, [begin])

  // Escape skips, from anywhere.
  useEffect(() => {
    if (state === 'open') return
    const onKey = (e) => { if (e.key === 'Escape') skip() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state, skip])

  // The controls are gone once open — move focus to the heading they revealed.
  useEffect(() => {
    if (state === 'open') heading.current?.focus({ preventScroll: true })
  }, [state])

  const sealed = state === 'sealed'

  return (
    <section
      id="home"
      ref={section}
      className="opening"
      data-state={state}
      data-ready={assetsReady}
      aria-label="Wedding invitation"
    >
      <div className="opening__atmosphere" aria-hidden="true" />

      {state !== 'open' && (
        <>
          <div ref={intro} className="opening__intro">
            <p className="label">A Wedding Invitation</p>
            <p className="opening__headline">You are cordially invited</p>
          </div>

          <div ref={controls} className="opening__controls">
            <button type="button" className="opening__open" onClick={open} disabled={!sealed}>
              Open Invitation
            </button>
          </div>

          <button type="button" className="opening__skip" onClick={skip}>
            Skip
          </button>
        </>
      )}

      <div className="opening__stage">
        {state !== 'open' && <EnvelopeBack ref={back} />}
        <InvitationCard ref={card} headingRef={heading} />
        {state !== 'open' && <EnvelopeFront ref={front} onClick={open} />}
      </div>

      <p className="opening__topline label" data-after>You are cordially invited</p>

      <a className="opening__scroll label" href="#invitation" data-after>
        Scroll
        <span aria-hidden="true" />
      </a>
    </section>
  )
}
