// Shared motion language. Every animated component imports gsap from here so
// plugins are registered exactly once and timings stay consistent.
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, SplitText)

// Slow, weighted, no overshoot — paper and wax, not rubber.
export const ease = {
  paper:  'power3.inOut', // large physical moves (card, envelope)
  fold:   'power2.inOut', // hinged moves (flap)
  settle: 'power2.out',   // things arriving at rest
  leave:  'power2.in',    // things departing
  ink:    'power1.inOut', // writing / drawing reveals
}

export const duration = {
  quick:  0.45,
  base:   0.9,
  slow:   1.5,
}

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

export { gsap, SplitText, useGSAP }
