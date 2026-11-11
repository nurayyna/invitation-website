import { useEffect, useState } from 'react'

const pad = (n) => String(n).padStart(2, '0')

/** Ticks once a second until `isoDate`; all parts are zero-padded strings. */
export function useCountdown(isoDate) {
  const [parts, setParts] = useState({ days: '--', hours: '--', minutes: '--', seconds: '--', done: false })

  useEffect(() => {
    const target = new Date(isoDate).getTime()
    const tick = () => {
      const diff = Math.max(0, target - Date.now())
      setParts({
        days:    pad(Math.floor(diff / 864e5)),
        hours:   pad(Math.floor((diff % 864e5) / 36e5)),
        minutes: pad(Math.floor((diff % 36e5) / 6e4)),
        seconds: pad(Math.floor((diff % 6e4) / 1e3)),
        done:    diff === 0,
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [isoDate])

  return parts
}
