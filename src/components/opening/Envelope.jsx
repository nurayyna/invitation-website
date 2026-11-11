import { forwardRef } from 'react'

const SRC = '/assets/opening'

// The envelope is split into two groups so the card can sit *between* them:
//   back  = interior + the flap once it has swung open
//   front = pocket + the flap while it is still closed (carrying the seal)
// Both flap faces share one hinge; the timeline shows whichever faces the viewer.
// Purely decorative — the accessible control is the "Open Invitation" button.

export const EnvelopeBack = forwardRef(function EnvelopeBack(_, ref) {
  return (
    <div ref={ref} className="envelope envelope--back" aria-hidden="true">
      <img className="envelope__layer envelope__interior" src={`${SRC}/envelope-interior.webp`} alt="" draggable="false" />
      <div className="envelope__flap" data-flap="inner">
        <img className="envelope__layer" src={`${SRC}/envelope-flap-inner.webp`} alt="" draggable="false" />
      </div>
    </div>
  )
})

export const EnvelopeFront = forwardRef(function EnvelopeFront({ onClick }, ref) {
  return (
    <div ref={ref} className="envelope envelope--front" aria-hidden="true" onClick={onClick}>
      <img className="envelope__layer" src={`${SRC}/envelope-pocket.webp`} alt="" draggable="false" />
      <div className="envelope__flap" data-flap="outer">
        <img className="envelope__layer" src={`${SRC}/envelope-flap.webp`} alt="" draggable="false" />
        <img className="envelope__seal" src={`${SRC}/wax-seal.webp`} alt="" draggable="false" />
      </div>
    </div>
  )
})
