// Backend address. If VITE_API_URL is not set, the UI runs in demo mode (fake data).
export const API_URL = import.meta.env.VITE_API_URL || ''
export const USE_MOCK = !API_URL

export const POLL_INTERVAL_MS = 2000
export const REQUEST_TIMEOUT_MS = 4000

// Used to scale the sun light and the solar panel glow.
export const MAX_SOLAR_KW = 12

// Temperature range used to color the rooms (blue = cold, red = hot).
export const TEMP_MIN = 20
export const TEMP_COMFORT = 24
export const TEMP_MAX = 30

// Where each room sits in the 3D scene. Keys match the room ids sent by the backend.
export const ROOM_LAYOUT = {
  salon: { position: [0, 1.6, -6.5], rotationY: 0, width: 16 },
  bedroom: { position: [-6.5, 1.6, 0], rotationY: Math.PI / 2, width: 10 },
  kitchen: { position: [6.5, 1.6, 0], rotationY: -Math.PI / 2, width: 10 },
}

// Where each EV charger sits (outside the south gate).
export const CHARGER_POSITIONS = {
  ev1: [-3.5, 0, 11],
  ev2: [3.5, 0, 11],
}

export const CHARGER_STATUS_COLOR = {
  charging: '#22c55e',
  idle: '#9ca3af',
  delayed: '#f59e0b',
}

export const SCENE_COLORS = {
  wall: '#f3e9d8',
  wood: '#8b5a2b',
  woodDark: '#5a3a22',
  terracotta: '#c9825b',
  zellige: '#0f8f7a',
  water: '#2aa9a4',
  waterActive: '#3fd0c9',
  marble: '#efece6',
  gold: '#d9a441',
  cushion: '#f2c230',
  ground: '#eadfc8',
}
