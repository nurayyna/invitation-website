import { useEffect } from 'react'
import { motion }    from 'framer-motion'
import gsap          from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

export default function IntroScreen({ onComplete }) {
  // Entrance animations on mount
  useEffect(() => {
    let ctx
    document.fonts.ready.then(() => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        tl.from('.intro-eyebrow', { opacity: 0, y: 10, duration: 0.6 }, 0.3)

        const namesEl = document.querySelector('.intro-names')
        if (namesEl) {
          const split = new SplitText(namesEl, { type: 'chars' })
          tl.from(split.chars, { opacity: 0, y: 22, stagger: 0.04, duration: 0.85 }, 0.5)
        }

        tl.from('.intro-rule', {
          scaleX: 0,
          transformOrigin: 'center',
          duration: 0.5,
        }, 1.0)

        tl.from('.intro-date', { opacity: 0, duration: 0.5 }, 1.2)
      })
    })

    return () => ctx?.revert()
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center cursor-pointer overflow-hidden"
      style={{ background: '#1C3520' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.85, ease: 'easeInOut' }}
      onClick={onComplete}
    >
      {/* Organza corner drapes */}
      <img
        src="/assets/organza-2.png"
        className="absolute pointer-events-none select-none"
        style={{
          top: '-2%', right: '-2%',
          width: 'clamp(200px,26vw,380px)',
          mixBlendMode: 'screen',
          opacity: 0.55,
        }}
        alt="" aria-hidden="true"
      />
      <img
        src="/assets/organza-2.png"
        className="absolute pointer-events-none select-none rotate-180"
        style={{
          bottom: '-2%', left: '-2%',
          width: 'clamp(200px,26vw,380px)',
          mixBlendMode: 'screen',
          opacity: 0.55,
        }}
        alt="" aria-hidden="true"
      />

      {/* Content */}
      <div className="flex flex-col items-center text-center gap-5 px-6">
        <p
          className="intro-eyebrow font-sans text-cream uppercase tracking-[0.38em]"
          style={{ fontSize: '0.7rem', opacity: 0.55 }}
        >
          A Wedding Invitation
        </p>

        <h1
          className="intro-names font-serif italic text-cream"
          style={{ fontSize: 'clamp(2.6rem, 9vw, 5.5rem)', lineHeight: 1.1 }}
        >
          Amelia <span className="not-italic font-light">&amp;</span> Andy
        </h1>

        <div
          className="intro-rule bg-gold"
          style={{ width: '5rem', height: '1px', transformOrigin: 'center' }}
        />

        <p
          className="intro-date font-sans text-gold uppercase tracking-[0.3em]"
          style={{ fontSize: '0.7rem', opacity: 0.8 }}
        >
          2 &nbsp;·&nbsp; July &nbsp;·&nbsp; 2027
        </p>

        {/* Begin button — always visible so users know to click */}
        <button
          className="flex items-center gap-3 mt-4 font-sans text-cream uppercase tracking-[0.38em] opacity-45 hover:opacity-75 transition-opacity duration-300"
          style={{ fontSize: '0.65rem' }}
          aria-label="Begin"
        >
          <span className="block h-px w-8 bg-cream" />
          Begin
          <span className="block h-px w-8 bg-cream" />
        </button>
      </div>
    </motion.div>
  )
}
