import { wedding } from '../../content/wedding'
import { useCountdown } from '../../lib/useCountdown'
import Section from '../ui/Section'
import { Rule } from '../ui/SectionHeading'

export default function Invitation() {
  const { couple, hostLine, invitation, dateLong, time, venue, dateISO } = wedding

  return (
    <Section id="invitation" tone="burgundy" className="invitation" aria-labelledby="invitation-title">
      <div className="letter">
        <img className="keepsake letter__bouquet" src="/assets/keepsakes/bouquet.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <img className="keepsake letter__bouquet" src="/assets/keepsakes/bouquet.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <p className="label" data-reveal>{hostLine}</p>

        <h2 id="invitation-title" className="letter__names" data-reveal>
          <b className="sr-only">Wedding invitation: </b>
          {couple.first} <span>&amp;</span> {couple.second}
        </h2>

        <p className="letter__prose" data-reveal="lines">
          {invitation.request.map((line) => <span key={line}>{line}</span>)}
        </p>

        <Rule />

        <dl className="letter__details">
          <div data-reveal>
            <dt className="label">When</dt>
            <dd>{dateLong}</dd>
            <dd className="letter__sub">{time}</dd>
          </div>
          <div data-reveal>
            <dt className="label">Where</dt>
            <dd>{venue.name}</dd>
            <dd className={`letter__sub ${venue.address ? '' : 'is-placeholder'}`}>
              {venue.address ?? 'Address to be confirmed'}
            </dd>
          </div>
        </dl>

        <p className="letter__prose letter__prose--closing" data-reveal="lines">
          {invitation.closing.map((line) => <span key={line}>{line}</span>)}
        </p>

        <Countdown isoDate={dateISO} />
      </div>
    </Section>
  )
}

// Set into the foot of the letter like a printer's date line, not a widget.
function Countdown({ isoDate }) {
  const c = useCountdown(isoDate)
  const units = [['Days', c.days], ['Hours', c.hours], ['Minutes', c.minutes], ['Seconds', c.seconds]]

  return (
    <div id="countdown" className="countdown" data-reveal>
      <p className="label">{c.done ? 'The day has arrived' : 'Counting down to the big day'}</p>
      <div className="countdown__row" role="timer" aria-label={`${c.days} days, ${c.hours} hours and ${c.minutes} minutes to go`}>
        {units.map(([label, value]) => (
          <div key={label} className="countdown__unit" aria-hidden="true">
            <span className="countdown__value">{value}</span>
            <span className="countdown__label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
