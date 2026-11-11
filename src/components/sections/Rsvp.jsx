import { useRef, useState } from 'react'
import { wedding } from '../../content/wedding'
import Section from '../ui/Section'
import SectionHeading from '../ui/SectionHeading'

const FORM_NAME = 'rsvp'   // must match the static form in index.html (Netlify Forms)
const EMPTY = { name: '', attending: '', guests: '1', message: '' }

function validate(v) {
  const errors = {}
  if (v.name.trim().length < 2) errors.name = 'Please tell us your name.'
  if (!v.attending) errors.attending = 'Please let us know whether you can attend.'
  return errors
}

export default function Rsvp() {
  const { rsvp, couple } = wedding
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')   // idle | sending | sent | failed
  const formRef = useRef(null)
  const doneRef = useRef(null)

  const set = (key) => (e) => {
    const value = e.target.value
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return

    const found = validate(values)
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      formRef.current.querySelector(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    setStatus('sending')
    try {
      const body = new URLSearchParams({
        'form-name': FORM_NAME,
        name: values.name.trim(),
        attending: values.attending,
        guests: values.attending === 'yes' ? values.guests : '0',
        message: values.message.trim(),
        'bot-field': e.target.elements['bot-field'].value,
      })
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
      if (!res.ok) throw new Error(`RSVP failed: ${res.status}`)
      setStatus('sent')
      requestAnimationFrame(() => doneRef.current?.focus())
    } catch {
      setStatus('failed')
    }
  }

  const attending = values.attending === 'yes'

  return (
    <Section id="rsvp" tone="forest" className="rsvp" aria-labelledby="rsvp-title">
      <SectionHeading id="rsvp-title" eyebrow="Will you be joining us?" title="Kindly Reply" />

      <div className="reply" data-reveal>
        <img className="keepsake reply__sprig" src="/assets/keepsakes/sprig.webp" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <img className="reply__seal" src="/assets/opening/wax-seal.webp" alt="" aria-hidden="true" loading="lazy" />

        {status === 'sent' ? (
          <div className="reply__done" ref={doneRef} tabIndex={-1} role="status">
            <p className="label">Reply received</p>
            <h3 className="reply__thanks">Thank you, {values.name.trim().split(' ')[0]}.</h3>
            <p className="reply__prose">
              {attending
                ? `Your reply is on its way to ${couple.first} & ${couple.second}. We cannot wait to celebrate with you.`
                : `Your reply is on its way to ${couple.first} & ${couple.second}. You will be dearly missed.`}
            </p>
          </div>
        ) : (
          <form
            ref={formRef}
            name={FORM_NAME}
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={submit}
            noValidate
            className="reply__form"
          >
            <input type="hidden" name="form-name" value={FORM_NAME} />
            <p className="sr-only">
              <label>Leave this field empty <input name="bot-field" tabIndex={-1} autoComplete="off" /></label>
            </p>

            <p className="reply__prose">
              {rsvp.intro}<br />
              Please let us know by <em>{rsvp.deadline}</em>.
            </p>

            <div className="field">
              <label htmlFor="rsvp-name" className="label">Your name</label>
              <input
                id="rsvp-name" name="name" type="text" autoComplete="name"
                value={values.name} onChange={set('name')}
                aria-invalid={!!errors.name} aria-describedby={errors.name ? 'rsvp-name-error' : undefined}
                required
              />
              {errors.name && <p id="rsvp-name-error" className="field__error">{errors.name}</p>}
            </div>

            <fieldset
              className="field"
              aria-invalid={!!errors.attending}
              aria-describedby={errors.attending ? 'rsvp-attending-error' : undefined}
            >
              <legend className="label">Your reply</legend>
              <div className="choices">
                {[['yes', 'Joyfully accepts'], ['no', 'Regretfully declines']].map(([value, text]) => (
                  <label key={value} className="choice">
                    <input
                      type="radio" name="attending" value={value}
                      checked={values.attending === value} onChange={set('attending')}
                    />
                    <span>{text}</span>
                  </label>
                ))}
              </div>
              {errors.attending && <p id="rsvp-attending-error" className="field__error">{errors.attending}</p>}
            </fieldset>

            {attending && (
              <div className="field">
                <label htmlFor="rsvp-guests" className="label">Number attending, including you</label>
                <select id="rsvp-guests" name="guests" value={values.guests} onChange={set('guests')}>
                  {Array.from({ length: rsvp.maxGuests }, (_, i) => String(i + 1)).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="field">
              <label htmlFor="rsvp-message" className="label">A note for the couple <span>(optional)</span></label>
              <textarea id="rsvp-message" name="message" rows={3} value={values.message} onChange={set('message')} />
            </div>

            {status === 'failed' && (
              <p className="field__error field__error--form" role="alert">
                Your reply could not be sent just now. Please check your connection and try again.
              </p>
            )}

            <button type="submit" className="btn" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send Reply'}
            </button>

            <p className="reply__note">{rsvp.note}</p>
          </form>
        )}
      </div>
    </Section>
  )
}
