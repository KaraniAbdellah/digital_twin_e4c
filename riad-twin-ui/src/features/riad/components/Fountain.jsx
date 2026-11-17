import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SCENE_COLORS } from '../constants'

const JET_OFFSETS = [
  [0, 0],
  [0.25, 0.25],
  [-0.25, 0.25],
  [0.25, -0.25],
  [-0.25, -0.25],
]

export default function Fountain({ on }) {
  const jets = useRef([])

  // Water jets grow when the fountain is on and shrink when it is off.
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    jets.current.forEach((jet, i) => {
      if (!jet) return
      const target = on ? 0.7 + 0.25 * Math.sin(t * 3 + i * 1.7) : 0.001
      jet.scale.y = THREE.MathUtils.lerp(jet.scale.y, target, 0.1)
      jet.position.y = 0.5 + jet.scale.y / 2
    })
  })

  return (
    <group>
      {/* green zellige border */}
      <mesh position={[0, 0.125, 0]} receiveShadow castShadow>
        <boxGeometry args={[5.2, 0.25, 3.6]} />
        <meshStandardMaterial color={SCENE_COLORS.zellige} />
      </mesh>

      {/* water */}
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[4.6, 0.04, 3]} />
        <meshStandardMaterial
          color={on ? SCENE_COLORS.waterActive : SCENE_COLORS.water}
          metalness={0.2}
          roughness={0.15}
        />
      </mesh>

      {/* center basin */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.45, 0.55, 0.3, 16]} />
        <meshStandardMaterial color={SCENE_COLORS.marble} />
      </mesh>

      {JET_OFFSETS.map(([x, z], i) => (
        <mesh
          key={i}
          ref={(el) => (jets.current[i] = el)}
          position={[x, 0.5, z]}
          scale={[1, 0.001, 1]}
        >
          <cylinderGeometry args={[0.035, 0.035, 1, 8]} />
          <meshStandardMaterial color="#bff4f2" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  )
}
