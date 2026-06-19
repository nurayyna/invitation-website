import { motion } from 'framer-motion'

const up = (delay = 0) => ({
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, delay, ease: [0.25, 0.1, 0.25, 1] } },
})

export default function RSVPSection() {
  return (
    <section id="rsvp" style={{ background: '#1C3520' }}>

      {/* ── Section hero ─────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center text-center py-28 px-6 gap-4">
        <motion.p
          className="font-sans text-cream uppercase tracking-[0.38em]"
          style={{ fontSize: '0.68rem', opacity: 0.55 }}
          variants={up(0)} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          Will you be joining us?
        </motion.p>

        <motion.h2
          className="font-serif italic text-gold"
          style={{ fontSize: 'clamp(2rem,6vw,3.8rem)', lineHeight: 1.1 }}
          variants={up(0.1)} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          RSVP
        </motion.h2>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-6 pb-28 flex flex-col items-center text-center gap-6">

        <span className="text-gold" style={{ fontSize: '0.65rem', letterSpacing: '0.35em' }}>◆</span>

        <motion.p
          className="font-serif italic text-cream"
          style={{ fontSize: 'clamp(1.05rem,2.2vw,1.3rem)', lineHeight: 1.85 }}
          variants={up(0)} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          We would love to know if you can make it.<br />
          Please let us know by <em>15 June 2027</em>.
        </motion.p>

        <p
          className="font-sans text-cream uppercase tracking-[0.22em]"
          style={{ fontSize: '0.68rem', opacity: 0.38 }}
        >
          Seats are limited &nbsp;·&nbsp; Early response appreciated
        </p>

        {/* Form area */}
        <motion.div
          className="w-full rounded-sm p-12 flex flex-col items-center gap-3"
          style={{
            border:     '1px solid rgba(184,150,60,0.18)',
            background: 'rgba(251,246,236,0.04)',
          }}
          variants={up(0.12)} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          {/*
            TO ADD GOOGLE FORM:
            1. Open your Google Form → Send → Embed (</> icon)
            2. Copy the <iframe> and replace everything inside this div:
               <iframe
                 src="https://docs.google.com/forms/d/e/XXXXXX/viewform?embedded=true"
                 width="100%" height="640" frameBorder="0"
               >Loading…</iframe>
          */}
          <p
            className="font-serif italic text-cream"
            style={{ fontSize: '1.1rem', opacity: 0.45 }}
          >
            RSVP form coming soon
          </p>
          <p
            className="font-sans text-cream uppercase tracking-[0.2em]"
            style={{ fontSize: '0.65rem', opacity: 0.28 }}
          >
            Google Form will be embedded here
          </p>
        </motion.div>

      </div>
    </section>
  )
}
