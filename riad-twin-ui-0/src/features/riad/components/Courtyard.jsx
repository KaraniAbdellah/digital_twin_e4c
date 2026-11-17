import { useMemo } from 'react'
import { createFloorTexture } from '../utils/tiles'
import { SCENE_COLORS } from '../constants'

const COLUMN_POSITIONS = [
  [-4.5, -4.5],
  [-2.2, -4.5],
  [2.2, -4.5],
  [4.5, -4.5],
  [-4.5, -2.2],
  [-4.5, 2.2],
  [4.5, -2.2],
  [4.5, 2.2],
]

const PLANT_POSITIONS = [
  [-4.2, 4.2],
  [4.2, 4.2],
  [-3.4, -3.6],
  [3.4, -3.6],
]

function Column({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.2, 3, 16]} />
        <meshStandardMaterial color={SCENE_COLORS.marble} />
      </mesh>
      <mesh position={[0, 3.05, 0]} castShadow>
        <boxGeometry args={[0.5, 0.2, 0.5]} />
        <meshStandardMaterial color={SCENE_COLORS.marble} />
      </mesh>
    </group>
  )
}

function Plant({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.28, 0.7, 16]} />
        <meshStandardMaterial color={SCENE_COLORS.terracotta} />
      </mesh>
      <mesh position={[0, 1.1, 0]} castShadow>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshStandardMaterial color="#3f7d3a" />
      </mesh>
      <mesh position={[0.2, 1.6, 0.1]} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#4f9a47" />
      </mesh>
    </group>
  )
}

// Cushioned day bed, like the yellow ones in the riad photos.
function DayBed({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[1.1, 0.5, 2.6]} />
        <meshStandardMaterial color={SCENE_COLORS.cushion} />
      </mesh>
      <mesh position={[0, 0.65, -0.9]} castShadow>
        <boxGeometry args={[0.8, 0.3, 0.6]} />
        <meshStandardMaterial color="#ef6c3b" />
      </mesh>
    </group>
  )
}

// South wall with a gate, so the riad looks closed from the street.
function Gate() {
  return (
    <group position={[0, 0, 6.5]}>
      {[-5, 5].map((x) => (
        <mesh key={x} position={[x, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[6, 1.5, 0.8]} />
          <meshStandardMaterial color={SCENE_COLORS.wall} />
        </mesh>
      ))}
      {[-2, 2].map((x) => (
        <mesh key={x} position={[x, 1.3, 0]} castShadow>
          <boxGeometry args={[0.4, 2.6, 0.8]} />
          <meshStandardMaterial color={SCENE_COLORS.wall} />
        </mesh>
      ))}
      <mesh position={[0, 2.6, 0]} castShadow>
        <torusGeometry args={[2, 0.15, 8, 32, Math.PI]} />
        <meshStandardMaterial color={SCENE_COLORS.gold} />
      </mesh>
    </group>
  )
}

export default function Courtyard() {
  const floorTexture = useMemo(() => createFloorTexture(), [])

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial map={floorTexture} />
      </mesh>

      {COLUMN_POSITIONS.map((position) => (
        <Column key={position.join()} position={[position[0], 0, position[1]]} />
      ))}
      {PLANT_POSITIONS.map((position) => (
        <Plant key={position.join()} position={[position[0], 0, position[1]]} />
      ))}

      <DayBed position={[-3.6, 0, 1.8]} />
      <DayBed position={[3.6, 0, 1.8]} />
      <Gate />
    </group>
  )
}
