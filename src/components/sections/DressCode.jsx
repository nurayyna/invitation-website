import { wedding } from '../../content/wedding'
import Section from '../ui/Section'
import SectionHeading from '../ui/SectionHeading'

export default function DressCode() {
  const { summary, avoid, palette } = wedding.dressCode

  return (
    <Section id="dress-code" tone="ivory" className="dress" aria-labelledby="dress-title">
      <SectionHeading id="dress-title" eyebrow="Attire" title="Dress Code" />

      <p className="dress__summary" data-reveal>{summary}</p>

      <ul className="swatches" aria-label="Suggested colours">
        {palette.map((s) => (
          <li key={s.name} className="swatch" data-reveal>
            <span className="swatch__chip" style={{ '--chip': s.hex }} aria-hidden="true" />
            <span className="label">{s.name}</span>
          </li>
        ))}
      </ul>

      <p className="dress__avoid" data-reveal>{avoid}</p>
    </Section>
  )
}
