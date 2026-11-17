import { useEffect, useRef, useState } from 'react'
import { TONE_STYLES } from '../constants'

// Card with a colored border/value (tone) that pulses when the value changes.
export default function StatCard({ label, value, unit, tone }) {
  const [flash, setFlash] = useState(false)
  const previous = useRef(value)
  const style = TONE_STYLES[tone] || TONE_STYLES.good

  useEffect(() => {
    if (previous.current === value) return
    previous.current = value
    setFlash(true)
    const timer = setTimeout(() => setFlash(false), 700)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div
      className={`rounded-xl border-l-4 px-3 py-2 shadow-card transition-all duration-500 ${style.card} ${
        flash ? 'scale-105 ring-2 ring-white' : ''
      }`}
    >
      <div className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">{label}</div>
      <div className={`mt-0.5 text-2xl font-bold transition-colors duration-500 ${style.value}`}>
        {value} <span className="text-xs font-medium text-stone-500">{unit}</span>
      </div>
    </div>
  )
}
