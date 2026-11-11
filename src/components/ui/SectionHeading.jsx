/** Eyebrow label, display title and a gold rule — the opening of every section. */
export default function SectionHeading({ eyebrow, title, id, align = 'center' }) {
  return (
    <header className={`heading heading--${align}`}>
      {eyebrow && <p className="label" data-reveal>{eyebrow}</p>}
      <h2 id={id} className="heading__title" data-reveal="lines">{title}</h2>
      <Rule />
    </header>
  )
}

export function Rule() {
  return (
    <div className="rule" data-reveal="rule" aria-hidden="true">
      <span /><i>◆</i><span />
    </div>
  )
}
