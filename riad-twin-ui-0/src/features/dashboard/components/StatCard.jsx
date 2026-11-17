export default function StatCard({ label, value, unit, dotClass }) {
  return (
    <div className="rounded-xl bg-white/90 px-3 py-2 shadow-card backdrop-blur">
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-stone-500">
        <span className={`h-2 w-2 rounded-full ${dotClass}`} />
        {label}
      </div>
      <div className="mt-0.5 text-xl font-semibold text-stone-800">
        {value} <span className="text-xs font-medium text-stone-500">{unit}</span>
      </div>
    </div>
  )
}
