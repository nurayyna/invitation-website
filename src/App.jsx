import { useState, useEffect, useRef } from 'react'

import Opening          from './components/opening/Opening'
import Navigation       from './components/Navigation'
import InvitationSection from './components/InvitationSection'
import EventsSection    from './components/EventsSection'
import RSVPSection      from './components/RSVPSection'
import Footer           from './components/Footer'
import MusicButton      from './components/MusicButton'

export default function App() {
  const [opened, setOpened]             = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const audioRef                        = useRef(null)
  const pageRef                         = useRef(null)

  // Until the invitation is opened the page below is held still and kept out
  // of the tab order, so the envelope is the only thing to interact with.
  useEffect(() => {
    history.scrollRestoration = 'manual'
    if (!opened) window.scrollTo(0, 0)
    document.documentElement.classList.toggle('is-sealed', !opened)
    if (pageRef.current) pageRef.current.inert = !opened
    return () => document.documentElement.classList.remove('is-sealed')
  }, [opened])

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

  return (
    <>
      <Navigation />
      <Opening
        onOpenStart={() => setMusicPlaying(true)}
        onOpened={() => setOpened(true)}
      />

      <div ref={pageRef}>
        <InvitationSection />
        <EventsSection />
        <RSVPSection />
        <Footer />
      </div>

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
