import { wedding } from '../../content/wedding'
import Section from '../ui/Section'
import PhotoFrame from '../ui/PhotoFrame'
import { Rule } from '../ui/SectionHeading'

export default function Venue() {
  const { venue, dateLong, time } = wedding

  return (
    <Section id="venue" tone="sage" className="venue" aria-labelledby="venue-title">
      <div className="venue__grid">
        <PhotoFrame
          src={venue.photo}
          alt={venue.name}
          shape="arch"
          placeholder="Venue photograph to come"
          className="venue__frame"
        />

        <div className="venue__text">
          <p className="label" data-reveal>The Venue</p>
          <h2 id="venue-title" className="heading__title" data-reveal="lines">{venue.name}</h2>
          <Rule />

          <address className={`venue__address ${venue.address ? '' : 'is-placeholder'}`} data-reveal>
            {venue.address ?? 'Address to be confirmed'}
          </address>
          <p className="venue__when" data-reveal>{dateLong} · {time}</p>

          <div data-reveal>
            {venue.mapsUrl ? (
              <a className="btn" href={venue.mapsUrl} target="_blank" rel="noopener noreferrer">
                Get Directions
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <p className="venue__pending is-placeholder">Directions will be shared here soon.</p>
            )}
          </div>
        </div>
      </div>
    </Section>
  )
}
