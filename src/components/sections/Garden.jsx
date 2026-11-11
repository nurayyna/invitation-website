import { useRef } from 'react'
import { wedding } from '../../content/wedding'
import { gsap, useGSAP, FULL_MOTION, DESKTOP } from '../../lib/motion'
import { useReveal } from '../../lib/useReveal'

const ART = '/assets/art'

/**
 * The English Garden — Constable's Wivenhoe Park, first seen as a framed
 * canvas, opening out to fill the view as the guest scrolls into it.
 */
export default function Garden() {
  const ref = useRef(null)
  useReveal(ref)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add({ full: FULL_MOTION, desktop: DESKTOP }, (ctx) => {
      const { full, desktop } = ctx.conditions
      if (!full) return
      const inset = desktop ? 'inset(14% 16% 14% 16%)' : 'inset(8% 7% 8% 7%)'
      gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'top 5%', scrub: 0.6 },
      })
        .fromTo('.garden__canvas', { clipPath: inset }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0)
        .fromTo('.garden__canvas img', { scale: 1.18 }, { scale: 1, ease: 'none' }, 0)
    })
  }, { scope: ref })

  const { couple, dateLong } = wedding

  return (
    <section id="garden" ref={ref} className="garden" aria-labelledby="garden-title">
      <div className="garden__canvas">
        <picture>
          <source media="(max-width: 640px) and (orientation: portrait)" srcSet={`${ART}/wivenhoe-park-portrait.webp`} />
          <img
            src={`${ART}/wivenhoe-park-2400.webp`}
            srcSet={`${ART}/wivenhoe-park-1400.webp 1400w, ${ART}/wivenhoe-park-2400.webp 2400w`}
            sizes="100vw"
            alt="An English country estate in summer: a pink house among oaks, cattle grazing, and two swans on a lake. Painting by John Constable."
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>

      <div className="garden__text">
        <p className="label" data-reveal>The English Garden</p>
        <h2 id="garden-title" className="garden__title" data-reveal="lines">
          {couple.first} <span>&amp;</span> {couple.second}
        </h2>
        <p className="garden__date" data-reveal>{dateLong}</p>
      </div>

      <p className="garden__credit">John Constable · Wivenhoe Park, Essex · 1816</p>
    </section>
  )
}
