import * as THREE from 'three'
import { TEMP_MIN, TEMP_COMFORT, TEMP_MAX, SCENE_COLORS } from '../constants'

// Traffic-light style: blue = too cold, green = comfortable, red = too hot.
const COLD = new THREE.Color('#2563eb')
const COMFORT = new THREE.Color('#22c55e')
const HOT = new THREE.Color('#ef4444')
const WALL = new THREE.Color(SCENE_COLORS.wall)

const clamp01 = (value) => Math.min(1, Math.max(0, value))

// Returns a THREE.Color for a temperature.
export function tempToThreeColor(temp) {
  const color = new THREE.Color()
  if (temp <= TEMP_COMFORT) {
    color.copy(COLD).lerp(COMFORT, clamp01((temp - TEMP_MIN) / (TEMP_COMFORT - TEMP_MIN)))
  } else {
    color.copy(COMFORT).lerp(HOT, clamp01((temp - TEMP_COMFORT) / (TEMP_MAX - TEMP_COMFORT)))
  }
  return color
}

// Same color as a hex string, for HTML.
export function tempToColor(temp) {
  return `#${tempToThreeColor(temp).getHexString()}`
}

// Room wall color: the cream wall tinted with the temperature color.
export function tempToWallColor(temp) {
  return WALL.clone().lerp(tempToThreeColor(temp), 0.55)
}
