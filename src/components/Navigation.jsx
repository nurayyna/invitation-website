import { useState, useEffect } from 'react'

const links = [
  { href: '#invitation', label: 'Invitation' },
  { href: '#events',     label: 'Events'     },
  { href: '#rsvp',       label: 'RSVP'       },
]

export default function Navigation() {
  const [visible,     setVisible]     = useState(false)
  const [activeHref,  setActiveHref]  = useState('')

  // Show nav once envelope section scrolls off screen
  useEffect(() => {
    const onScroll = () => {
      const home = document.getElementById('home')
      if (!home) return
      setVisible(home.getBoundingClientRect().bottom <= 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy: highlight active section
  useEffect(() => {
    const ids      = ['invitation', 'events', 'rsvp']
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveHref('#' + e.target.id)
        })
      },
      { threshold: 0.35 },
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 transition-all duration-500"
      style={{
        background:     'rgba(28,53,32,0.95)',
        backdropFilter: 'blur(8px)',
        opacity:          visible ? 1 : 0,
        pointerEvents:    visible ? 'auto' : 'none',
        borderBottom:   '1px solid rgba(184,150,60,0.12)',
      }}
    >
      <a
        href="#home"
        className="font-serif italic text-cream tracking-[0.12em] hover:text-gold transition-colors duration-300"
        style={{ fontSize: '1.15rem' }}
      >
        A &amp; A
      </a>

      <ul className="flex gap-8 list-none">
        {links.map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              className="font-sans text-cream uppercase tracking-[0.28em] transition-opacity duration-300"
              style={{
                fontSize:   '0.65rem',
                opacity:    activeHref === href ? 1 : 0.55,
                fontWeight: activeHref === href ? 400 : 300,
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
