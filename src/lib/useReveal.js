// One scroll-reveal vocabulary for the whole site. Mark elements in JSX:
//
//   data-reveal            soft rise + fade (siblings entering together stagger)
//   data-reveal="lines"    editorial line-by-line reveal (SplitText, masked)
//   data-reveal="image"    mask wipe on a frame while the picture settles
//   data-reveal="rule"     a hairline drawing itself from the centre
//   data-parallax="8"      drifts ±8% against the scroll (desktop only)
//
// Without JS, or with reduced motion, nothing is hidden: every tween is a
// `from`, created only inside the full-motion media query.
import { gsap, ScrollTrigger, SplitText, useGSAP, ease, duration, FULL_MOTION, DESKTOP } from './motion'

const START = 'top 86%'

export function useReveal(scope) {
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add({ full: FULL_MOTION, desktop: DESKTOP }, (ctx) => {
      const { full, desktop } = ctx.conditions
      if (!full) return
      const q = gsap.utils.selector(scope)

      // Soft rise — batched so neighbours arrive as a group, not all at once
      const rises = q('[data-reveal=""], [data-reveal="rise"]')
      if (rises.length) {
        gsap.set(rises, { autoAlpha: 0, y: 26 })
        ScrollTrigger.batch(rises, {
          start: START,
          once: true,
          onEnter: (batch) => gsap.to(batch, {
            autoAlpha: 1, y: 0, duration: duration.base + 0.2, stagger: 0.12, ease: ease.settle, overwrite: true,
          }),
        })
      }

      // Editorial headings, line by line
      q('[data-reveal="lines"]').forEach((el) => {
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) => gsap.from(self.lines, {
            yPercent: 110, duration: duration.slow - 0.3, stagger: 0.11, ease: ease.settle,
            scrollTrigger: { trigger: el, start: START, once: true },
          }),
        })
      })

      // Framed pictures: the frame unveils, the picture settles inside it
      q('[data-reveal="image"]').forEach((el) => {
        const inner = el.querySelector('[data-reveal-inner]')
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: START, once: true } })
        tl.from(el, { clipPath: 'inset(100% 0% 0% 0%)', duration: duration.slow, ease: ease.paper })
        if (inner) tl.from(inner, { scale: 1.14, duration: duration.slow + 0.4, ease: ease.settle }, 0)
      })

      q('[data-reveal="rule"]').forEach((el) => {
        gsap.from(el, {
          scaleX: 0, autoAlpha: 0, duration: duration.base + 0.2, ease: ease.fold,
          scrollTrigger: { trigger: el, start: START, once: true },
        })
      })

      if (desktop) {
        q('[data-parallax]').forEach((el) => {
          const amount = parseFloat(el.dataset.parallax) || 6
          gsap.fromTo(el, { yPercent: -amount }, {
            yPercent: amount, ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        })
      }
    })
  }, { scope })
}
