import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { tempToColor, tempToThreeColor, tempToWallColor } from '../utils/colors'
import { SCENE_COLORS } from '../constants'

// One room of the riad. The door side (+z in local space) always faces the courtyard.
// Walls and the floor glow change color smoothly with the temperature.
export default function Room({ name, temp, position, rotationY, width }) {
  const wallMaterial = useRef()
  const glowMaterial = useRef()
  const glowWidth = Math.min(width * 0.6, 7)
  const labelColor = tempToColor(temp)

  useFrame(() => {
    wallMaterial.current?.color.lerp(tempToWallColor(temp), 0.08)
    glowMaterial.current?.color.lerp(tempToThreeColor(temp), 0.08)
  })

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* building block */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, 3.2, 3]} />
        <meshStandardMaterial ref={wallMaterial} color={SCENE_COLORS.wall} />
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

      {/* bright floor glow in front of the door = room temperature */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6 + 0.03, 2.7]}>
        <planeGeometry args={[glowWidth, 2]} />
        <meshBasicMaterial ref={glowMaterial} color={labelColor} transparent opacity={0.85} />
      </mesh>

      <Html position={[0, 1.6 + 0.9, 1.6]} center distanceFactor={14} zIndexRange={[10, 0]}>
        <div
          className="pointer-events-none flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-card transition-colors duration-700"
          style={{ backgroundColor: labelColor }}
        >
          {name} · {temp}°C
        </div>
      </Html>
    </group>
  )
}
