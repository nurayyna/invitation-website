import { useRef, useEffect } from 'react'
import gsap          from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

export default function EnvelopeHero({ ready }) {
  const scrollZoneRef        = useRef(null)
  const envelopeRef          = useRef(null)
  const letterCardRef        = useRef(null)
  const rafRef               = useRef(null)
  const smoothPRef           = useRef(0)
  const targetPRef           = useRef(0)
  const letterAnimatedRef    = useRef(false)

  // ── Entrance animations (triggered once intro dismisses) ───────────────────
  useEffect(() => {
    if (!ready) return

    let ctx
    document.fonts.ready.then(() => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        // Organza drapes
        tl.from('.env-organza', {
          opacity: 0, scale: 0.88, duration: 1.4, stagger: 0.2,
        }, 0.1)

        // Eyebrow — split text
        const eyebrowEl = document.querySelector('.env-eyebrow')
        if (eyebrowEl) {
          const s = new SplitText(eyebrowEl, { type: 'chars' })
          tl.from(s.chars, { opacity: 0, y: 14, stagger: 0.035, duration: 0.65 }, 0.5)
        }

        // Envelope body (only opacity — JS owns transform)
        if (envelopeRef.current) {
          tl.from(envelopeRef.current, { opacity: 0, duration: 1.1 }, 0.25)
        }

        // Couple name — split text
        const namesEl = document.querySelector('.env-couple-name')
        if (namesEl) {
          const s = new SplitText(namesEl, { type: 'chars' })
          tl.from(s.chars, { opacity: 0, y: 10, stagger: 0.04, duration: 0.6 }, 1.1)
        }

        tl.from('.env-date-text',    { opacity: 0, y: 8, duration: 0.55 }, 1.55)
        tl.from('.env-scroll-hint',  { opacity: 0, duration: 0.6 }, 1.85)
      })
    })

    return () => ctx?.revert()
  }, [ready])

  // ── Scroll zoom (vanilla RAF — no ScrollTrigger needed) ────────────────────
  useEffect(() => {
    if (!ready) return
    if (!envelopeRef.current || !scrollZoneRef.current) return

    const envelope   = envelopeRef.current
    const letterCard = letterCardRef.current
    const scrollZone = scrollZoneRef.current

    // Kill the CSS float animation so JS fully owns transform every frame.
    // CSS @keyframes sit above inline styles in the cascade and would overwrite
    // every scale() we set — this one-liner prevents that.
    envelope.style.animation = 'none'

    const calcProgress = () => {
      const top  = scrollZone.offsetTop
      const dist = scrollZone.offsetHeight - window.innerHeight
      return dist > 0
        ? Math.max(0, Math.min(1, (window.scrollY - top) / dist))
        : 0
    }

    const animateLetterContent = () => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

      tl.from('.letter-ornament', { opacity: 0, y: 10, duration: 0.45 }, 0)
      tl.from('.letter-rule', {
        scaleX: 0, transformOrigin: 'center', duration: 0.45, stagger: 0.15,
      }, 0.15)

      const namesEl = document.querySelector('.letter-names')
      if (namesEl) {
        const s = new SplitText(namesEl, { type: 'chars' })
        tl.from(s.chars, { opacity: 0, y: 16, stagger: 0.04, duration: 0.65 }, 0.3)
      }

      tl.from('.letter-date', { opacity: 0, y: 8, duration: 0.45 }, 0.8)
      tl.from('.letter-hint', { opacity: 0, duration: 0.45 }, 1.0)
    }

    const applyZoom = (p) => {
      // Zoom — envelope grows from scale 1 to scale 15 over the scroll zone
      envelope.style.transform = `scale(${1 + p * 14})`

      // Guard: don't touch opacity before scrolling starts (let entrance fade play)
      if (p > 0.01) {
        // Envelope stays fully visible until p=0.58, then fades out quickly
        envelope.style.opacity = p < 0.58
          ? '1'
          : String(Math.max(0, 1 - (p - 0.58) / 0.22))

        // UI overlay elements (eyebrow, names, hint, drapes) fade out as user starts scrolling
        const uiAlpha = String(Math.max(0, 1 - p / 0.15))
        document.querySelectorAll('.env-ui-fade').forEach(el => {
          el.style.opacity = uiAlpha
        })
      }

      // Letter card (z-index: 8 — behind envelope's z-index: 10) fades in from behind
      if (letterCard && p > 0.64) {
        letterCard.style.opacity = String(
          Math.max(0, Math.min(1, (p - 0.65) / 0.30)),
        )
      }

      // Trigger letter content GSAP animation once at p≈0.82
      if (!letterAnimatedRef.current && p >= 0.82) {
        letterAnimatedRef.current = true
        animateLetterContent()
      }
    }

    // RAF lerp loop — smoothP chases targetP at 0.09 per frame ≈ buttery 60 fps
    const tick = () => {
      smoothPRef.current += (targetPRef.current - smoothPRef.current) * 0.09
      applyZoom(smoothPRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    const onScroll = () => {
      targetPRef.current = calcProgress()
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('scroll', onScroll)
    }
  }, [ready])

  return (
    // 250vh wrapper makes the sticky section scroll for 150vh before releasing
    <div ref={scrollZoneRef} style={{ height: '250vh', position: 'relative' }}>
      <section
        id="home"
        className="sticky top-0 overflow-hidden flex flex-col items-center justify-center"
        style={{
          height: '100vh',
          background: '#1C3520',
          backgroundImage: `
            radial-gradient(ellipse at 15% 60%, rgba(74,122,80,0.20) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 20%, rgba(107,27,42,0.13) 0%, transparent 45%)
          `,
        }}
      >
        {/* ── Organza drapes ─────────────────────────────────────────────── */}
        <img
          src="/assets/organza-2.png"
          className="env-organza env-ui-fade absolute pointer-events-none select-none"
          style={{
            top: '-2%', right: '-2%',
            width: 'clamp(200px,26vw,400px)',
            mixBlendMode: 'screen', opacity: 0.6, zIndex: 1,
          }}
          alt="" aria-hidden="true"
        />
        <img
          src="/assets/organza-2.png"
          className="env-organza env-ui-fade absolute pointer-events-none select-none rotate-180"
          style={{
            bottom: '-2%', left: '-2%',
            width: 'clamp(200px,26vw,400px)',
            mixBlendMode: 'screen', opacity: 0.6, zIndex: 1,
          }}
          alt="" aria-hidden="true"
        />

        {/* ── Eyebrow ─────────────────────────────────────────────────────── */}
        <p
          className="env-eyebrow env-ui-fade absolute font-sans text-cream uppercase tracking-[0.38em] whitespace-nowrap"
          style={{
            top: '1.75rem', left: '50%', transform: 'translateX(-50%)',
            fontSize: '0.68rem', opacity: 0.5, zIndex: 2,
          }}
        >
          You are cordially invited
        </p>

        {/* ── Stage: letter card + envelope ──────────────────────────────── */}
        <div className="relative" style={{ width: 'min(860px,88vw)' }}>

          {/* Letter card sits BEHIND the envelope (z-index: 8 < envelope z-index: 10).
              As the envelope zooms past and fades, the letter is revealed from behind. */}
          <div
            ref={letterCardRef}
            id="letterCard"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: 'min(760px,88vw)', opacity: 0, zIndex: 8 }}
          >
            <img
              src="/assets/square-lace.png"
              className="w-full h-auto block"
              style={{ mixBlendMode: 'screen' }}
              alt="" aria-hidden="true"
            />
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center"
              style={{ padding: '12% 18%' }}
            >
              <div
                className="letter-ornament font-serif text-gold tracking-[0.18em]"
                style={{ fontSize: 'clamp(0.8rem,2vw,1.05rem)', opacity: 0.8 }}
              >
                ✦ &nbsp; A &amp; A &nbsp; ✦
              </div>
              <div className="letter-rule w-8 h-px bg-gold" />
              <p
                className="letter-names font-serif italic"
                style={{ fontSize: 'clamp(1.6rem,5vw,2.6rem)', color: '#1C3520' }}
              >
                Amelia &amp; Andy
              </p>
              <div className="letter-rule w-8 h-px bg-gold" />
              <p
                className="letter-date font-sans uppercase tracking-[0.28em]"
                style={{ fontSize: 'clamp(0.72rem,1.8vw,0.88rem)', color: '#6B1B2A' }}
              >
                2 · 7 · 2027
              </p>
              <p
                className="letter-hint font-sans uppercase tracking-[0.3em] mt-1"
                style={{ fontSize: '0.6rem', color: '#6B1B2A', opacity: 0.45 }}
              >
                scroll to continue
              </p>
            </div>
          </div>

          {/* Envelope — JS owns all transforms here */}
          <div
            ref={envelopeRef}
            id="envelope"
            className="relative w-full"
            style={{ zIndex: 10 }}
          >
            <img
              src="/assets/envelope.png"
              alt="Wedding invitation envelope"
              className="w-full h-auto block"
              style={{ filter: 'drop-shadow(0 32px 72px rgba(0,0,0,0.5))' }}
            />
            {/* mix-blend-mode: multiply makes white bg transparent over the maroon envelope */}
            <img
              src="/assets/wax-seal-2.jpg"
              id="waxSeal"
              alt="Wax seal"
              className="absolute"
              style={{
                top: '54%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: '28%',
                mixBlendMode: 'multiply',
              }}
            />
          </div>
        </div>

        {/* ── Names + date (below envelope) ──────────────────────────────── */}
        <div
          className="env-ui-fade absolute text-center whitespace-nowrap"
          style={{
            bottom: '3.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 2,
          }}
        >
          <p
            className="env-couple-name font-serif italic text-cream tracking-[0.04em]"
            style={{ fontSize: 'clamp(1.3rem,2.8vw,1.9rem)' }}
          >
            Amelia &amp; Andy
          </p>
          <p
            className="env-date-text font-sans text-gold uppercase tracking-[0.22em] mt-1"
            style={{ fontSize: '0.68rem' }}
          >
            2 &nbsp;·&nbsp; July &nbsp;·&nbsp; 2027
          </p>
        </div>

        {/* ── Scroll hint ─────────────────────────────────────────────────── */}
        <p
          className="env-scroll-hint env-ui-fade absolute font-sans text-cream uppercase tracking-[0.28em] whitespace-nowrap"
          style={{
            bottom: '1.75rem', left: '50%', transform: 'translateX(-50%)',
            fontSize: '0.65rem', opacity: 0.3, zIndex: 2,
          }}
        >
          ↓ &nbsp; Scroll
        </p>
      </section>
    </div>
  )
}
