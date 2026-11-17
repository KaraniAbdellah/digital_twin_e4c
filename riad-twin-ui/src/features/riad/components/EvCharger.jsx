import { Html } from '@react-three/drei'
import { CHARGER_STATUS_COLOR } from '../constants'

// Charger post + parked car. Everything glows with the status color:
// green = charging, amber = delayed, gray = idle.
export default function EvCharger({ charger, position }) {
  const color = CHARGER_STATUS_COLOR[charger.status] || CHARGER_STATUS_COLOR.idle
  const isCharging = charger.status === 'charging'

  return (
    <group position={position}>
      {/* colored ground ring under the car */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[3.2, 5]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} />
      </mesh>

      {/* post */}
      <mesh position={[1.9, 0.9, 0]} castShadow>
        <boxGeometry args={[0.6, 1.8, 0.5]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isCharging ? 1.2 : 0.35} />
      </mesh>

      {/* car */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.8, 0.6, 3.6]} />
        <meshStandardMaterial color={isCharging ? '#bbf7d0' : '#e5e7eb'} />
      </mesh>
      <mesh position={[0, 1.05, -0.2]} castShadow>
        <boxGeometry args={[1.5, 0.5, 2]} />
        <meshStandardMaterial color="#9ca3af" />
      </mesh>

      <Html position={[0, 2.4, 0]} center distanceFactor={14} zIndexRange={[10, 0]}>
        <div
          className="pointer-events-none whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-card transition-colors duration-700"
          style={{ backgroundColor: color }}
        >
          {charger.name} · {charger.status}
          {isCharging ? ` · ${charger.power_kw} kW` : ''}
        </div>
      </Html>
    </group>
  )
}
