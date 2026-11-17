import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRiad } from '../../../global/context/RiadContext'
import { MAX_SOLAR_KW, ROOM_LAYOUT, CHARGER_POSITIONS, SCENE_COLORS } from '../constants'
import Courtyard from './Courtyard'
import Fountain from './Fountain'
import Room from './Room'
import SolarPanels from './SolarPanels'
import EvCharger from './EvCharger'
import Shade from './Shade'

function SceneContent({ status }) {
  const sunRatio = Math.min(1, status.solar_kw / MAX_SOLAR_KW)

  return (
    <>
      <color attach="background" args={['#f7efe2']} />
      <fog attach="fog" args={['#f7efe2', 40, 90]} />

      {/* Light follows solar production: brighter sun = more kW */}
      <ambientLight intensity={0.45 + sunRatio * 0.2} />
      <hemisphereLight args={['#fff4e0', '#c9a678', 0.35]} />
      <directionalLight
        position={[10, 16, 8]}
        intensity={0.25 + sunRatio * 1.3}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-16}
      />

      {/* ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={SCENE_COLORS.ground} />
      </mesh>

      <Courtyard />
      <Fountain on={status.fountain_on} />
      <Shade closed={status.shade_closed} />
      <SolarPanels solarKw={status.solar_kw} />

      {status.rooms.map((room) => {
        const layout = ROOM_LAYOUT[room.id]
        if (!layout) return null
        return <Room key={room.id} name={room.name} temp={room.temp} {...layout} />
      })}

      {status.ev_chargers.map((charger) => {
        const position = CHARGER_POSITIONS[charger.id]
        if (!position) return null
        return <EvCharger key={charger.id} charger={charger} position={position} />
      })}

      <OrbitControls
        target={[0, 1, 2]}
        minDistance={8}
        maxDistance={42}
        maxPolarAngle={Math.PI / 2.1}
        enablePan={false}
      />
    </>
  )
}

export default function RiadScene() {
  const { status } = useRiad()

  if (!status) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-stone-500">
        Loading Riad…
      </div>
    )
  }

  return (
    <Canvas shadows camera={{ position: [15, 13, 20], fov: 45 }}>
      <SceneContent status={status} />
    </Canvas>
  )
}
