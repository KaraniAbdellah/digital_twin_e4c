import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Cloth canopy above the courtyard. It fades in when the agent closes the shade.
export default function Shade({ closed }) {
  const mesh = useRef()

  useFrame(() => {
    if (!mesh.current) return
    const material = mesh.current.material
    material.opacity = THREE.MathUtils.lerp(material.opacity, closed ? 0.6 : 0, 0.08)
    mesh.current.visible = material.opacity > 0.01
  })

  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, 3.4, 0]} visible={false}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#f5e6c8" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}
