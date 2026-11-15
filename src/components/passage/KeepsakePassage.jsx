import { useRef } from 'react'
import { wedding } from '../../content/wedding'
import { gsap, useGSAP, FULL_MOTION } from '../../lib/motion'
import InvitationCard from '../opening/InvitationCard'
import { buildPassage } from './passageTimeline'
import './passage.css'

const A = '/assets/passage'

/**
 * Invitation → Our Story. The camera, resting on the invitation card the
 * opening leaves behind, pulls back to find it laid among the wedding
 * keepsakes, settles on a lace-framed portrait of the couple, and passes
 * through it into Our Story.
 *
 * Purely visual: everything a guest needs is in the opening card and in
 * Our Story, so the scene is hidden from assistive tech, takes no pointer
 * input (the opening's own "Scroll" link stays clickable beneath it), and
 * is left out entirely with reduced motion or without JavaScript.
 *
 * Its first frame is drawn with the opening's own card and stage variables
 * (the `opening` class on the stage), so where one hands over to the other
 * there is nothing to see.
 */
export default function KeepsakePassage() {
  const root = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add(FULL_MOTION, () => buildPassage(root.current))
  }, { scope: root })

  const { portrait } = wedding.story

  return (
    <div ref={root} className="passage" aria-hidden="true" inert="">
      <div className="opening passage__stage">
        {/* The same table the opening ends on */}
        <div className="opening__ground" />

        {/* World layers — moved together by one camera, at slightly different
            depths so nearer things travel further (2.5D parallax). */}
        <div className="passage__layer" data-depth="1">
          <img className="keepsake lace-curtain" src="/assets/keepsakes/lace-drape.webp" alt="" />
          <img className="ks ks--envelope"     src={`${A}/envelope-burgundy.webp`} alt="" />
          <img className="ks ks--handkerchief" src={`${A}/handkerchief.webp`} alt="" />
          <img className="ks ks--ribbon"       src={`${A}/ribbon.webp`} alt="" />
          <InvitationCard />
        </div>

        <div className="passage__layer" data-depth="1.05">
          <img className="ks ks--florals"  src={`${A}/florals-burgundy.webp`} alt="" />
          <img className="ks ks--lilies"   src={`${A}/calla-lilies.webp`} alt="" />
          <img className="ks ks--seal"     src={`${A}/seal-rose.webp`} alt="" />
          <img className="ks ks--orchid"   src={`${A}/orchid.webp`} alt="" />
          <img className="ks ks--whites"   src={`${A}/florals-white.webp`} alt="" />
        </div>

        {/* Quiets everything but the portrait while the camera settles on it */}
        <div className="passage__scrim" />

        {/* What lies through the portrait's window: the photograph, and behind
            it the linen of Our Story. Clipped to the window by the camera. */}
        <div className="passage__portal">
          <div className="passage__memory section--emboss" />
          <div className="passage__photo">
            {portrait ? (
              <img src={portrait} alt="" decoding="async" />
            ) : (
              <div className="frame__placeholder">
                <span className="frame__placeholder-mark">❦</span>
                <span className="label">Photograph to come</span>
              </div>
            )}
          </div>
        </div>

        {/* The portrait frame, in front of what it holds */}
        <div className="passage__layer passage__layer--frame" data-depth="1">
          <div className="ks ks--portrait" data-portrait>
            <span className="ks__gilt" />
            <img src={`${A}/portrait-lace-oval.webp`} alt="" />
          </div>
        </div>

        {/* Nearest the lens: soft, out of focus, first to leave the frame */}
        <div className="passage__layer passage__layer--near" data-depth="1.5">
          <img className="ks ks--near-left"  src="/assets/keepsakes/sprig.webp" alt="" />
          <img className="ks ks--near-right" src={`${A}/florals-white.webp`} alt="" />
        </div>

        <div className="opening__vignette passage__vignette" />

        {/* A twin of the opening's scroll cue, so the hand-over is invisible */}
        <span className="opening__scroll label passage__cue" data-cue>
          Scroll
          <span />
        </span>
      </div>
    </div>
  )
}
