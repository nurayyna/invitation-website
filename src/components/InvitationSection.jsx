import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function useCountdown(isoDate) {
  const [parts, setParts] = useState({ days: '--', hours: '--', minutes: '--', seconds: '--' })

  useEffect(() => {
    const target = new Date(isoDate).getTime()

    const tick = () => {
      const diff = target - Date.now()
      if (diff <= 0) {
        setParts({ days: '00', hours: '00', minutes: '00', seconds: '00' })
        return
      }
      setParts({
        days:    String(Math.floor(diff / 864e5)).padStart(2, '0'),
        hours:   String(Math.floor((diff % 864e5) / 36e5)).padStart(2, '0'),
        minutes: String(Math.floor((diff % 36e5)  / 6e4)).padStart(2, '0'),
        seconds: String(Math.floor((diff % 6e4)   / 1e3)).padStart(2, '0'),
      })
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [isoDate])

  return parts
}

const up = (delay = 0) => ({
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, delay, ease: [0.25, 0.1, 0.25, 1] } },
})

export default function InvitationSection() {
  const countdown = useCountdown('2027-07-02T13:00:00')

  return (
    <section id="invitation" style={{ background: '#1C3520' }}>

      {/* ── Section hero ─────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center text-center py-28 px-6 gap-4">
        <motion.p
          className="font-sans text-cream uppercase tracking-[0.38em]"
          style={{ fontSize: '0.68rem', opacity: 0.55 }}
          variants={up(0)} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          Together with their families
        </motion.p>

        <motion.h1
          className="font-serif italic text-cream"
          style={{ fontSize: 'clamp(2.6rem,9vw,5.5rem)', lineHeight: 1.05 }}
          variants={up(0.1)} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          Amelia <span className="not-italic font-light text-gold">&amp;</span> Andy
        </motion.h1>

        <motion.p
          className="font-sans text-cream uppercase tracking-[0.25em]"
          style={{ fontSize: '0.75rem', opacity: 0.45 }}
          variants={up(0.2)} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          Rumah Dusun &nbsp;·&nbsp; 2 July 2027
        </motion.p>
      </div>

      {/* ── Cream invitation area ─────────────────────────────────────────── */}
      <div className="relative py-20 px-6" style={{ background: '#FBF6EC' }}>
        {/* Lace side decorations */}
        <img
          src="/assets/left-lace.png"
          className="absolute top-0 left-0 h-full pointer-events-none select-none object-cover"
          style={{ width: 'clamp(44px,7vw,90px)', mixBlendMode: 'multiply', opacity: 0.15 }}
          alt="" aria-hidden="true"
        />
        <img
          src="/assets/left-lace.png"
          className="absolute top-0 right-0 h-full pointer-events-none select-none object-cover scale-x-[-1]"
          style={{ width: 'clamp(44px,7vw,90px)', mixBlendMode: 'multiply', opacity: 0.15 }}
          alt="" aria-hidden="true"
        />

        <div className="max-w-xl mx-auto flex flex-col items-center text-center gap-7">

          <motion.span
            className="text-gold" style={{ fontSize: '0.65rem', letterSpacing: '0.35em' }}
            variants={up(0)} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            ◆
          </motion.span>

          <motion.p
            className="font-serif italic"
            style={{ fontSize: 'clamp(1.05rem,2.2vw,1.3rem)', lineHeight: 1.85, color: '#6B1B2A' }}
            variants={up(0.05)} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            request the pleasure of your company<br />
            at the celebration of their wedding reception
          </motion.p>

          {/* Detail block */}
          <motion.div
            className="w-full flex flex-col items-center gap-2 px-10 py-8 rounded-sm"
            style={{
              border:     '1px solid rgba(184,150,60,0.28)',
              background: 'rgba(184,150,60,0.04)',
            }}
            variants={up(0.12)} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            <p
              className="font-sans text-maroon uppercase tracking-[0.32em]"
              style={{ fontSize: '0.6rem', opacity: 0.65 }}
            >
              Reception
            </p>
            <p
              className="font-serif italic text-maroon"
              style={{ fontSize: 'clamp(1.3rem,3vw,1.9rem)' }}
            >
              Friday, 2 July 2027
            </p>
            <p
              className="font-sans text-maroon tracking-[0.1em]"
              style={{ fontSize: '0.82rem', opacity: 0.75 }}
            >
              1:00 PM onwards &nbsp;·&nbsp; Rumah Dusun
            </p>
          </motion.div>

          <motion.p
            className="font-serif italic"
            style={{ fontSize: 'clamp(1.05rem,2.2vw,1.3rem)', lineHeight: 1.85, color: '#6B1B2A' }}
            variants={up(0.18)} initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            Your presence and blessings mean the world to us.<br />
            We look forward to celebrating this joyful day with you.
          </motion.p>

        </div>
      </div>

      {/* ── Countdown ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center text-center py-24 px-6 gap-8">
        <motion.p
          className="font-sans text-cream uppercase tracking-[0.32em]"
          style={{ fontSize: '0.65rem', opacity: 0.45 }}
          variants={up(0)} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          Counting down to the big day
        </motion.p>

        <motion.div
          className="flex items-center gap-4 sm:gap-8"
          variants={up(0.08)} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          {[
            ['Days',    countdown.days   ],
            ['Hours',   countdown.hours  ],
            ['Minutes', countdown.minutes],
            ['Seconds', countdown.seconds],
          ].map(([label, val], i) => (
            <div key={label} className="flex items-center gap-4 sm:gap-8">
              {i > 0 && (
                <span className="font-serif text-gold" style={{ fontSize: '1.8rem', opacity: 0.35 }}>·</span>
              )}
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className="font-serif italic text-cream tabular-nums"
                  style={{ fontSize: 'clamp(2rem,6vw,3.5rem)' }}
                >
                  {val}
                </span>
                <span
                  className="font-sans text-cream uppercase tracking-[0.28em]"
                  style={{ fontSize: '0.58rem', opacity: 0.38 }}
                >
                  {label}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

    </section>
  )
}
