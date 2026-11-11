import { wedding } from '../../content/wedding'
import Section from '../ui/Section'

export default function Closing() {
  const { couple, closing, dateLong, artwork } = wedding

  return (
    <Section id="closing" tone="forest" className="closing">
      <div className="closing__art" aria-hidden="true">
        <img src="/assets/art/wivenhoe-swans.webp" alt="" loading="lazy" decoding="async" data-parallax="5" />
      </div>

      <div className="closing__text">
        <p className="closing__message" data-reveal="lines">{closing.message}</p>
        <p className="closing__names" data-reveal>
          {couple.first} <span>&amp;</span> {couple.second}
        </p>
        <p className="label" data-reveal>{dateLong}</p>
      </div>

      <footer className="closing__footer">
        <a className="label" href="#home">Back to the invitation</a>
        <p className="closing__credits">
          Artwork: {artwork.join(' ')}
        </p>
      </footer>
    </Section>
  )
}
