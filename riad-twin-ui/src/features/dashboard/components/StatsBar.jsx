import { useRiad } from '../../../global/context/RiadContext'
import { formatNumber } from '../utils/format'
import StatCard from './StatCard'

// Each card gets a color from its value: green = good, amber = careful, red = bad.
const solarTone = (kw) => (kw >= 6 ? 'good' : kw >= 2 ? 'warn' : 'bad')
const consumptionTone = (kw) => (kw <= 5 ? 'good' : kw <= 9 ? 'warn' : 'bad')
const gridTone = (kw) => (kw <= 0 ? 'good' : kw <= 3 ? 'warn' : 'bad')
const outdoorTone = (temp) => (temp <= 22 ? 'cold' : temp <= 28 ? 'warn' : 'bad')

export default function StatsBar() {
  const { status } = useRiad()
  if (!status) return null

  const gridImport = status.grid_kw >= 0

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <StatCard label="Solar" value={formatNumber(status.solar_kw)} unit="kW" tone={solarTone(status.solar_kw)} />
      <StatCard
        label="Consumption"
        value={formatNumber(status.consumption_kw)}
        unit="kW"
        tone={consumptionTone(status.consumption_kw)}
      />
      <StatCard
        label={gridImport ? 'Grid import' : 'Grid export'}
        value={formatNumber(Math.abs(status.grid_kw))}
        unit="kW"
        tone={gridTone(status.grid_kw)}
      />
      <StatCard
        label="Outdoor"
        value={formatNumber(status.outdoor_temp)}
        unit="°C"
        tone={outdoorTone(status.outdoor_temp)}
      />
    </div>
  )
}
