import { Html } from '@react-three/drei'
import { MAX_SOLAR_KW } from '../constants'

const PANEL_X = [-5.4, -1.8, 1.8, 5.4]

// Panels on the roof of the north building.
// Night: dark blue. Strong sun: bright glowing orange-yellow.
export default function SolarPanels({ solarKw }) {
  const intensity = Math.min(1, solarKw / MAX_SOLAR_KW)
  const color = intensity > 0.05 ? '#f59e0b' : '#1e3a8a'

  return (
    <group>
      {PANEL_X.map((x) => (
        <mesh key={x} position={[x, 3.5, -6.5]} rotation={[-0.35, 0, 0]} castShadow>
          <boxGeometry args={[3, 0.1, 1.8]} />
          <meshStandardMaterial
            color="#1e3a8a"
            emissive={color}
            emissiveIntensity={intensity * 2.5}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      ))}

      <Html position={[0, 5.2, -6.5]} center distanceFactor={14} zIndexRange={[10, 0]}>
        <div
          className="pointer-events-none whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-card transition-colors duration-700"
          style={{ backgroundColor: intensity > 0.5 ? '#16a34a' : intensity > 0.15 ? '#f59e0b' : '#6b7280' }}
        >
          Solar · {solarKw} kW
        </div>
      </Html>
    </group>
  )
}
