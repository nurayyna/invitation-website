import { useState, useEffect, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'

import IntroScreen      from './components/IntroScreen'
import Navigation       from './components/Navigation'
import EnvelopeHero     from './components/EnvelopeHero'
import InvitationSection from './components/InvitationSection'
import EventsSection    from './components/EventsSection'
import RSVPSection      from './components/RSVPSection'
import Footer           from './components/Footer'
import MusicButton      from './components/MusicButton'

export default function App() {
  const [ready, setReady]               = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const audioRef                        = useRef(null)

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 })

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  // Sync audio element with musicPlaying state
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (musicPlaying) {
      audio.volume = 0.5
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [musicPlaying])

  const handleIntroComplete = () => {
    setReady(true)
    setMusicPlaying(true)
  }

  return (
    <>
      <AnimatePresence>
        {!ready && (
          <IntroScreen key="intro" onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      <Navigation />
      <EnvelopeHero ready={ready} />
      <InvitationSection />
      <EventsSection />
      <RSVPSection />
      <Footer />

      <MusicButton
        playing={musicPlaying}
        onToggle={() => setMusicPlaying(p => !p)}
      />

      <audio ref={audioRef} loop preload="none">
        <source src="/assets/background.mp3" type="audio/mpeg" />
      </audio>
    </>
  )
}
