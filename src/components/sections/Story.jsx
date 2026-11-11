import { wedding } from '../../content/wedding'
import Section from '../ui/Section'
import SectionHeading from '../ui/SectionHeading'
import PhotoFrame from '../ui/PhotoFrame'

const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI']
const SHAPES   = ['arch', 'landscape', 'portrait']

export default function Story() {
  const { intro, chapters } = wedding.story

  return (
    <Section id="story" tone="ivory" className="story" aria-labelledby="story-title">
      <img
        className="botanical" src="/assets/art/redoute-rose.webp" alt="" aria-hidden="true"
        loading="lazy" decoding="async" data-parallax="7"
      />
      <SectionHeading id="story-title" eyebrow="How it began" title="Our Story" />

      <p className={`story__intro ${intro ? '' : 'is-placeholder'}`} data-reveal>
        {intro ?? 'A few opening lines about the two of you will appear here.'}
      </p>

      <ol className="story__chapters">
        {chapters.map((c, i) => (
          <li key={i} className="chapter">
            <PhotoFrame
              src={c.photo}
              alt={c.caption ?? ''}
              shape={SHAPES[i % SHAPES.length]}
              className="chapter__frame"
            />
            <div className="chapter__text">
              <span className="chapter__numeral" aria-hidden="true" data-reveal>{NUMERALS[i]}</span>
              <h3 className={`chapter__title ${c.title ? '' : 'is-placeholder'}`} data-reveal>
                {c.title ?? 'Chapter title'}
              </h3>
              <p className={`chapter__body ${c.text ? '' : 'is-placeholder'}`} data-reveal>
                {c.text ?? 'This part of your story is waiting to be written. Add the words whenever you are ready.'}
              </p>
              {c.caption && <p className="chapter__caption" data-reveal>{c.caption}</p>}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
