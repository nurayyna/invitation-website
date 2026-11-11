import { useRef } from 'react'
import { useReveal } from '../../lib/useReveal'

/**
 * Page section. `tone` picks the paper it is printed on (forest | ivory |
 * sage | burgundy) and wires up the shared scroll-reveal vocabulary.
 */
export default function Section({ id, tone = 'forest', className = '', children, ...rest }) {
  const ref = useRef(null)
  useReveal(ref)
  return (
    <section id={id} ref={ref} className={`section section--${tone} ${className}`} {...rest}>
      {children}
    </section>
  )
}
