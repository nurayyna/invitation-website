import { forwardRef } from 'react'

// The envelope is drawn in CSS so it can fill the whole viewport at any size
// (see opening.css). It is split into two groups so the card can sit between:
//   back  = interior wall + the flap once it has swung open (liner side)
//   front = pocket flaps + the closed flap, carrying the lace trim and seal
// Both flap faces share one hinge; the timeline shows whichever faces the viewer.
// Purely decorative — nothing here is exposed to assistive tech.

function LaceEdges() {
  return (
    <>
      <span className="flap__lace" />
      <span className="flap__lace flap__lace--right" />
    </>
  )
}

export const EnvelopeBack = forwardRef(function EnvelopeBack(_, ref) {
  return (
    <div ref={ref} className="env env--back" aria-hidden="true">
      <div className="env__plane env__interior" />
      <div className="flap" data-flap="inner">
        <div className="env__plane flap__paper flap__paper--inner" />
        <div className="env__plane flap__liner" />
        <LaceEdges />
      </div>
    </div>
  )
})

export const EnvelopeFront = forwardRef(function EnvelopeFront(_, ref) {
  return (
    <div ref={ref} className="env env--front" aria-hidden="true">
      <div className="env__plane env__side env__side--left" />
      <div className="env__plane env__side env__side--right" />
      <div className="env__cast">
        <div className="env__plane env__bottom" />
      </div>
      <div className="flap" data-flap="outer">
        <div className="env__plane flap__paper" />
        <LaceEdges />
        <img className="flap__seal" src="/assets/opening/seal-rose.webp" alt="" draggable="false" />
      </div>
    </div>
  )
})
