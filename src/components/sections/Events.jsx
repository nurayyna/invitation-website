import { wedding } from '../../content/wedding'
import Section from '../ui/Section'
import SectionHeading from '../ui/SectionHeading'

export default function Events() {
  const { schedule, dateLong } = wedding

  return (
    <Section id="events" tone="forest" className="events" aria-labelledby="events-title">
      <SectionHeading id="events-title" eyebrow={dateLong} title="Order of the Day" />

      <ol className="timeline">
        {schedule.map((e) => (
          <li key={e.time + e.title} className="timeline__item" data-reveal>
            <p className="timeline__time">{e.time}</p>
            <span className="timeline__mark" aria-hidden="true" />
            <div>
              <h3 className="timeline__title">{e.title}</h3>
              {e.detail && <p className="timeline__detail">{e.detail}</p>}
            </div>
          </li>
        ))}

        {schedule.length < 2 && (
          <li className="timeline__item timeline__item--pending" data-reveal>
            <p className="timeline__time" aria-hidden="true">·&nbsp;·&nbsp;·</p>
            <span className="timeline__mark" aria-hidden="true" />
            <div>
              <p className="timeline__detail is-placeholder">The rest of the day’s programme is to be announced.</p>
            </div>
          </li>
        )}
      </ol>
    </Section>
  )
}
