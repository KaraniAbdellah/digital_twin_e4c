import { useRiad } from '../../../global/context/RiadContext'
import { MODE_BADGE } from '../constants'

export default function Header() {
  const { status, mode } = useRiad()
  const badge = MODE_BADGE[mode] || MODE_BADGE.demo

  return (
    <header className="flex items-center justify-between gap-3 px-5 py-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-stone-800">Riad Energy Twin</h1>
        <p className="text-sm text-stone-500">Agentic AI for smart building control · simulated environment</p>
      </div>

      <div className="flex items-center gap-2">
        {status && (
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-600 shadow-card">
            {status.time}
          </span>
        )}
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}>{badge.label}</span>
      </div>
    </header>
  )
}
