import { useRef } from 'react'
import { gsap, useGSAP, FULL_MOTION } from '../../lib/motion'
import InvitationCard from '../opening/InvitationCard'
import FlatLay from './FlatLay'
import { buildTransition } from './transitionTimeline'
import './keepsake.css'

// The paper each section is printed on, so a transition can begin and end
// as a seamless continuation of the sections either side of it.
const PAPER = {
  'story':      'section section--ivory section--emboss',
  'garden':     'kt__paper--garden',
  'invitation': 'section section--burgundy',
  'events':     'section section--forest',
  'venue':      'section section--sage',
  'dress-code': 'section section--ivory section--emboss',
  'rsvp':       'section section--forest',
  'closing':    'section section--forest kt__paper--closing',
}

/**
 * The camera move between two sections. It begins close on the paper of the
 * section just read (`from`), pulls back until that section is one piece of
 * stationery in the whole flat-lay, glides to the next piece (`to`) and moves
 * in until its paper fills the view — where the next section begins.
 *
 * `from="card"` is the move that follows the opening: it starts on a twin of
 * the opening's last frame (drawn with the opening's own card and stage
 * variables, so the hand-over cannot be seen) and pulls back to find that
 * card at the heart of the flat-lay.
 *
 * Purely visual: hidden from assistive tech, takes no input, and is left out
 * of the page altogether with reduced motion or without JavaScript, when the
 * sections simply follow one another.
 */
export default function KeepsakeTransition({ from, to }) {
  const root = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(FULL_MOTION, () => buildTransition(root.current, { from, to }))
  }, { scope: root })

  return (
    <div ref={root} className={`kt ${from === 'card' ? 'kt--after-opening' : ''}`} aria-hidden="true" inert="">
      <div className="kt__stage">
        <div className="opening__ground" />
        <FlatLay />
        {from === 'card' ? (
          <div className="opening kt__replica">
            <img className="keepsake lace-curtain" src="/assets/keepsakes/lace-drape.webp" alt="" />
            <InvitationCard />
            <span className="opening__scroll label kt__cue">Scroll<span /></span>
          </div>
        ) : (
          <div className={`kt__paper kt__paper--from ${PAPER[from]}`} />
        )}
        <div className={`kt__paper kt__paper--to ${PAPER[to]}`} />
        <div className="opening__vignette kt__vignette" />
      </div>
    </div>
  )
}
