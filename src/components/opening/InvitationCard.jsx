import { forwardRef } from 'react'
import { wedding } from '../../content/wedding'

// The ivory card that lives inside the envelope and becomes the page's hero.
// Pure presentation: the opening timeline animates it via data-anim hooks.
const InvitationCard = forwardRef(function InvitationCard({ headingRef }, ref) {
  const { couple, hostLine, dateLong, venue } = wedding

  return (
    <article ref={ref} className="card">
      <p className="card__monogram" aria-hidden="true">
        {couple.monogram[0]} <span>&amp;</span> {couple.monogram[1]}
      </p>

      <p className="card__eyebrow" data-anim="print">{hostLine}</p>

      <h1 ref={headingRef} className="card__names" data-anim="names" tabIndex={-1}>
        {couple.first} <span className="card__amp">&amp;</span> {couple.second}
      </h1>

      <div className="card__rule" data-anim="rule" aria-hidden="true">
        <span /><i>◆</i><span />
      </div>

      <p className="card__date" data-anim="print">{dateLong}</p>
      <p className="card__venue" data-anim="print">{venue.name}</p>
    </article>
  )
})

export default InvitationCard
