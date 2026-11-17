import { MAX_SOLAR_KW } from '../constants'

const PANEL_X = [-5.4, -1.8, 1.8, 5.4]

// Panels on the roof of the north building. They glow more when solar production is high.
export default function SolarPanels({ solarKw }) {
  const intensity = Math.min(1, solarKw / MAX_SOLAR_KW)

  return (
    <group>
      {PANEL_X.map((x) => (
        <mesh key={x} position={[x, 3.5, -6.5]} rotation={[-0.35, 0, 0]} castShadow>
          <boxGeometry args={[3, 0.08, 1.8]} />
          <meshStandardMaterial
            color="#1e3a8a"
            emissive="#facc15"
            emissiveIntensity={intensity * 0.6}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}
