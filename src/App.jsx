import { useState, useEffect, useRef } from 'react'
import { ScrollTrigger } from './lib/motion'

import Opening          from './components/opening/Opening'
import Navigation       from './components/Navigation'
import Garden           from './components/sections/Garden'
import Story            from './components/sections/Story'
import Invitation       from './components/sections/Invitation'
import Events           from './components/sections/Events'
import Venue            from './components/sections/Venue'
import DressCode        from './components/sections/DressCode'
import Rsvp             from './components/sections/Rsvp'
import Closing          from './components/sections/Closing'
import MusicButton      from './components/MusicButton'

export default function App() {
  const [musicPlaying, setMusicPlaying] = useState(false)
  const audioRef                        = useRef(null)

  // Scroll positions are measured again once type has loaded, so the pinned
  // opening and the reveals below it fire where they should.
  useEffect(() => {
    let live = true
    history.scrollRestoration = 'manual'
    document.fonts.ready.then(() => live && ScrollTrigger.refresh())
    return () => { live = false }
  }, [])

  // Browsers only allow sound after a tap, click or key press — scrolling alone
  // does not count — so the music starts on the guest's first such gesture.
  useEffect(() => {
    const start = (e) => {
      if (e.target.closest?.('.music')) return     // the toggle speaks for itself
      setMusicPlaying(true)
    }
    const opts = { once: true, passive: true }
    window.addEventListener('pointerup', start, opts)
    window.addEventListener('keydown', start, opts)
    return () => {
      window.removeEventListener('pointerup', start)
      window.removeEventListener('keydown', start)
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

  return (
    <>
      <Navigation />
      <Opening />

      <main>
        <Garden />
        <Story />
        <Invitation />
        <Events />
        <Venue />
        <DressCode />
        <Rsvp />
        <Closing />
      </main>

      <MusicButton
        playing={musicPlaying}
        onToggle={() => setMusicPlaying(p => !p)}
      />

      <audio ref={audioRef} loop preload="none">
        <source src="/assets/nanti-kita-seperti-ini.mp3" type="audio/mpeg" />
      </audio>
    </>
  )
}
