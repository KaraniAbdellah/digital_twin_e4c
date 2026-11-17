import { Html } from '@react-three/drei'
import { CHARGER_STATUS_COLOR } from '../constants'

// Charger post + parked car. The screen color shows the status
// (green = charging, amber = delayed, gray = idle).
export default function EvCharger({ charger, position }) {
  const color = CHARGER_STATUS_COLOR[charger.status] || CHARGER_STATUS_COLOR.idle
  const isCharging = charger.status === 'charging'

  return (
    <group position={position}>
      {/* post */}
      <mesh position={[1.6, 0.8, 0]} castShadow>
        <boxGeometry args={[0.5, 1.6, 0.4]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh position={[1.6, 1.2, 0.22]}>
        <boxGeometry args={[0.3, 0.3, 0.04]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isCharging ? 1.2 : 0.4} />
      </mesh>

      {/* car */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.8, 0.6, 3.6]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      <mesh position={[0, 1.05, -0.2]} castShadow>
        <boxGeometry args={[1.5, 0.5, 2]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>

      <Html position={[0, 2.2, 0]} center distanceFactor={14} zIndexRange={[10, 0]}>
        <div className="pointer-events-none whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-700 shadow-card">
          <span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
          {charger.name} · {charger.status}
          {isCharging ? ` · ${charger.power_kw} kW` : ''}
        </div>
      </Html>
    </group>
  )
}
