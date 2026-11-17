// Small colored dot shown next to each stat.
export const STAT_DOT = {
  solar: 'bg-amber-400',
  consumption: 'bg-rose-400',
  grid: 'bg-sky-400',
  outdoor: 'bg-emerald-400',
}

// Card colors by meaning: good = green, warn = amber, bad = red, cold = blue.
export const TONE_STYLES = {
  good: { card: 'bg-emerald-50 border-emerald-400', value: 'text-emerald-700' },
  warn: { card: 'bg-amber-50 border-amber-400', value: 'text-amber-700' },
  bad: { card: 'bg-red-50 border-red-400', value: 'text-red-600' },
  cold: { card: 'bg-blue-50 border-blue-400', value: 'text-blue-700' },
}

export const MODE_BADGE = {
  live: { label: 'Live backend', className: 'bg-emerald-100 text-emerald-700' },
  demo: { label: 'Demo data (no backend)', className: 'bg-amber-100 text-amber-700' },
}
