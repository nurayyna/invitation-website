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

  // Scroll positions are measured once type has loaded and again when the
  // page is released, so reveals fire where they should.
  useEffect(() => {
    let live = true
    document.fonts.ready.then(() => live && ScrollTrigger.refresh())
    return () => { live = false }
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

      <main ref={pageRef}>
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
