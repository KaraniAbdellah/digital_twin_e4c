import { useRiad } from '../../../global/context/RiadContext'
import { STAT_DOT } from '../constants'
import { formatNumber } from '../utils/format'
import StatCard from './StatCard'

export default function StatsBar() {
  const { status } = useRiad()
  if (!status) return null

  const gridImport = status.grid_kw >= 0

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <StatCard label="Solar" value={formatNumber(status.solar_kw)} unit="kW" dotClass={STAT_DOT.solar} />
      <StatCard
        label="Consumption"
        value={formatNumber(status.consumption_kw)}
        unit="kW"
        dotClass={STAT_DOT.consumption}
      />
      <StatCard
        label={gridImport ? 'Grid import' : 'Grid export'}
        value={formatNumber(Math.abs(status.grid_kw))}
        unit="kW"
        dotClass={STAT_DOT.grid}
      />
      <StatCard label="Outdoor" value={formatNumber(status.outdoor_temp)} unit="°C" dotClass={STAT_DOT.outdoor} />
    </div>
  )
}
