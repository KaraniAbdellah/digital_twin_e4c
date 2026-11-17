import { Html } from '@react-three/drei'
import { tempToColor } from '../utils/colors'
import { SCENE_COLORS } from '../constants'

// One room of the riad. The door side (+z in local space) always faces the courtyard.
export default function Room({ name, temp, position, rotationY, width }) {
  const tempColor = tempToColor(temp)
  const glowWidth = Math.min(width * 0.5, 6)

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* building block */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, 3.2, 3]} />
        <meshStandardMaterial color={SCENE_COLORS.wall} />
      </mesh>

      {/* wooden door + arch */}
      <mesh position={[0, 1.1 - 1.6, 1.52]}>
        <boxGeometry args={[2.2, 2.2, 0.1]} />
        <meshStandardMaterial color={SCENE_COLORS.woodDark} />
      </mesh>
      <mesh position={[0, 2.2 - 1.6, 1.52]}>
        <torusGeometry args={[1.1, 0.12, 8, 24, Math.PI]} />
        <meshStandardMaterial color={SCENE_COLORS.gold} />
      </mesh>

      {/* carved wooden windows on each side of the door */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 3.2, 0.2, 1.52]}>
          <boxGeometry args={[1.2, 1.5, 0.08]} />
          <meshStandardMaterial color={SCENE_COLORS.wood} />
        </mesh>
      ))}

      {/* floor glow in front of the door shows the room temperature */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6 + 0.03, 2.6]}>
        <planeGeometry args={[glowWidth, 1.6]} />
        <meshBasicMaterial color={tempColor} transparent opacity={0.6} />
      </mesh>

      <Html position={[0, 1.6 + 0.9, 1.6]} center distanceFactor={14} zIndexRange={[10, 0]}>
        <div className="pointer-events-none whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-700 shadow-card">
          {name} · <span style={{ color: tempColor === '#f3e9d8' ? '#78716c' : undefined }}>{temp}°C</span>
        </div>
      </Html>
    </group>
  )
}
