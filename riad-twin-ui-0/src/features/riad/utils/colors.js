import * as THREE from 'three'
import { TEMP_MIN, TEMP_COMFORT, TEMP_MAX } from '../constants'

const COLD = new THREE.Color('#3b82f6')
const NEUTRAL = new THREE.Color('#f3e9d8')
const HOT = new THREE.Color('#ef4444')

const clamp01 = (value) => Math.min(1, Math.max(0, value))

// Turns a temperature into a color: blue when cold, cream when comfortable, red when hot.
export function tempToColor(temp) {
  const color = new THREE.Color()
  if (temp <= TEMP_COMFORT) {
    color.copy(COLD).lerp(NEUTRAL, clamp01((temp - TEMP_MIN) / (TEMP_COMFORT - TEMP_MIN)))
  } else {
    color.copy(NEUTRAL).lerp(HOT, clamp01((temp - TEMP_COMFORT) / (TEMP_MAX - TEMP_COMFORT)))
  }
  return `#${color.getHexString()}`
}
