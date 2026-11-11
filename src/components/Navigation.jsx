import { useState, useEffect } from 'react'
import { wedding } from '../content/wedding'

const links = [
  { id: 'story',      label: 'Story',      secondary: true },
  { id: 'invitation', label: 'Invitation' },
  { id: 'events',     label: 'Events' },
  { id: 'venue',      label: 'Venue',      secondary: true },
  { id: 'rsvp',       label: 'RSVP' },
]

export default function Navigation() {
  const [visible, setVisible] = useState(false)
  const [active, setActive]   = useState('')

  // Appears once the opening hero has scrolled away
  useEffect(() => {
    const home = document.getElementById('home')
    if (!home) return
    const io = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting))
    io.observe(home)
    return () => io.disconnect()
  }, [])

  // Scroll-spy: whichever section crosses the middle of the viewport
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    links.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  const [a, b] = wedding.couple.monogram

  return (
    <nav className="nav" data-visible={visible} aria-label="Sections">
      <a href="#home" className="nav__monogram" aria-label="Back to the invitation">
        {a} <span>&amp;</span> {b}
      </a>
      <ul className="nav__links">
        {links.map(({ id, label, secondary }) => (
          <li key={id} data-secondary={secondary || undefined}>
            <a href={`#${id}`} aria-current={active === id ? 'true' : undefined}>{label}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
