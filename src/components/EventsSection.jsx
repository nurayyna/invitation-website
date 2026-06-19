import { motion } from 'framer-motion'

const up = (delay = 0) => ({
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, delay, ease: [0.25, 0.1, 0.25, 1] } },
})

export default function EventsSection() {
  return (
    <section id="events" style={{ background: '#2E5933' }}>

      {/* ── Section hero ─────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center text-center py-28 px-6 gap-4">
        <motion.p
          className="font-sans text-cream uppercase tracking-[0.38em]"
          style={{ fontSize: '0.68rem', opacity: 0.55 }}
          variants={up(0)} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          Mark your calendar
        </motion.p>

        <motion.h2
          className="font-serif italic text-cream"
          style={{ fontSize: 'clamp(2rem,6vw,3.8rem)', lineHeight: 1.1 }}
          variants={up(0.1)} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          The <span className="not-italic text-gold">Events</span>
        </motion.h2>
      </div>

      {/* ── Cards ───────────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-6 pb-28 flex flex-col gap-6">

        <motion.span
          className="block text-center text-gold" style={{ fontSize: '0.65rem', letterSpacing: '0.35em' }}
          variants={up(0)} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          ◆
        </motion.span>

        <motion.p
          className="text-center font-sans text-cream uppercase tracking-[0.28em] mb-2"
          style={{ fontSize: '0.68rem', opacity: 0.45 }}
          variants={up(0.05)} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          Programme of the Day
        </motion.p>

        {/* Reception card */}
        <motion.div
          className="rounded-sm p-8 flex flex-col gap-4"
          style={{
            border:     '1px solid rgba(184,150,60,0.25)',
            background: 'rgba(251,246,236,0.05)',
          }}
          variants={up(0.1)} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          <p
            className="font-sans text-gold uppercase tracking-[0.32em]"
            style={{ fontSize: '0.6rem', opacity: 0.8 }}
          >
            Main Event
          </p>
          <h3
            className="font-serif italic text-cream"
            style={{ fontSize: 'clamp(1.3rem,3vw,1.8rem)' }}
          >
            Wedding Reception
          </h3>
          <div className="flex flex-col gap-2 font-sans text-cream" style={{ fontSize: '0.82rem', opacity: 0.7 }}>
            <span>
              <span className="text-gold" style={{ opacity: 0.7 }}>Date</span>
              &nbsp;&nbsp; Friday, 2 July 2027
            </span>
            <span>
              <span className="text-gold" style={{ opacity: 0.7 }}>Time</span>
              &nbsp;&nbsp; 1:00 PM onwards
            </span>
            <span>
              <span className="text-gold" style={{ opacity: 0.7 }}>Venue</span>
              &nbsp;&nbsp; Rumah Dusun
            </span>
            <span>
              <span className="text-gold" style={{ opacity: 0.7 }}>Address</span>
              &nbsp;&nbsp; To be confirmed
            </span>
          </div>
          <a
            href="#"
            className="font-sans text-gold uppercase tracking-[0.25em] hover:opacity-100 transition-opacity duration-300 mt-1 self-start"
            style={{ fontSize: '0.65rem', opacity: 0.75 }}
            target="_blank" rel="noopener"
          >
            ↗ View on Maps
          </a>
        </motion.div>

        {/* Dress code card */}
        <motion.div
          className="rounded-sm p-8 flex flex-col gap-3"
          style={{
            border:     '1px solid rgba(184,150,60,0.2)',
            background: 'rgba(107,27,42,0.18)',
          }}
          variants={up(0.18)} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          <p
            className="font-sans text-gold uppercase tracking-[0.32em]"
            style={{ fontSize: '0.6rem', opacity: 0.8 }}
          >
            Attire
          </p>
          <h3
            className="font-serif italic text-cream"
            style={{ fontSize: 'clamp(1.1rem,3vw,1.5rem)' }}
          >
            Dress Code
          </h3>
          <p
            className="font-serif italic text-cream"
            style={{ fontSize: 'clamp(1rem,2.2vw,1.2rem)', lineHeight: 1.85, opacity: 0.8 }}
          >
            Smart casual — in greens, creams, or earth tones.
          </p>
          <p
            className="font-sans text-cream"
            style={{ fontSize: '0.78rem', opacity: 0.42, letterSpacing: '0.04em' }}
          >
            Please avoid wearing white or black.
          </p>
        </motion.div>

      </div>
    </section>
  )
}
