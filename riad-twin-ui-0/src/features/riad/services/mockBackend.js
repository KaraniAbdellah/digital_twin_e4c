// Fake backend used in demo mode (when VITE_API_URL is not set or the server is down).
// It mimics what the FastAPI simulation + agent will do, so the UI can be tested alone.

const MINUTES_PER_REAL_SECOND = 1 // 1 real second = 1 simulated minute
const SOLAR_PEAK_HOUR = 13
const MIN_TARGET_TEMP = 16
const MAX_TARGET_TEMP = 30

const state = {
  simMinutes: 10 * 60, // simulation starts at 10:00
  targetTemp: 24,
  acPower: 1.2,
  fountainOn: false,
  shadeClosed: false,
  rooms: [
    { id: 'salon', name: 'Salon', temp: 25 },
    { id: 'bedroom', name: 'Bedroom', temp: 24 },
    { id: 'kitchen', name: 'Kitchen', temp: 26 },
  ],
  evChargers: [
    { id: 'ev1', name: 'Charger 1', status: 'charging', powerKw: 7, resumeAt: null },
    { id: 'ev2', name: 'Charger 2', status: 'idle', powerKw: 0, resumeAt: null },
  ],
}
let lastTick = Date.now()

const hourOfDay = () => (state.simMinutes / 60) % 24

function solarKw(hour) {
  if (hour < 6 || hour > 19) return 0
  return 12 * Math.pow(Math.sin((Math.PI * (hour - 6)) / 13), 1.2)
}

function outdoorTemp(hour) {
  return 20 + 10 * Math.sin((Math.PI * (hour - 9)) / 12)
}

function formatTime(minutes) {
  const total = Math.floor(minutes) % 1440
  const h = String(Math.floor(total / 60)).padStart(2, '0')
  const m = String(total % 60).padStart(2, '0')
  return `${h}:${m}`
}

// Moves the simulation forward by the real time elapsed since the last call.
function tick() {
  const now = Date.now()
  const dt = Math.min((now - lastTick) / 1000, 5)
  lastTick = now

  state.simMinutes += dt * MINUTES_PER_REAL_SECOND
  const outside = outdoorTemp(hourOfDay())

  state.rooms.forEach((room) => {
    let temp = room.temp + (outside - room.temp) * (state.shadeClosed ? 0.002 : 0.004) * dt
    if (state.fountainOn) temp -= 0.01 * dt
    if (state.acPower > 0) temp += (state.targetTemp - temp) * Math.min(0.06 * state.acPower * dt, 1)
    room.temp = temp
  })

  state.evChargers.forEach((charger) => {
    if (charger.status === 'delayed' && state.simMinutes >= charger.resumeAt) {
      charger.status = 'charging'
      charger.powerKw = 7
      charger.resumeAt = null
    }
  })
}

function buildStatus() {
  const solar = solarKw(hourOfDay())
  const chargingKw = state.evChargers.reduce((sum, c) => sum + c.powerKw, 0)
  const consumption = 1.5 + state.acPower + (state.fountainOn ? 0.2 : 0) + chargingKw
  const round = (value) => Math.round(value * 10) / 10

  return {
    time: formatTime(state.simMinutes),
    solar_kw: round(solar),
    consumption_kw: round(consumption),
    grid_kw: round(consumption - solar),
    outdoor_temp: round(outdoorTemp(hourOfDay())),
    target_temp: state.targetTemp,
    ac_power_kw: round(state.acPower),
    fountain_on: state.fountainOn,
    shade_closed: state.shadeClosed,
    rooms: state.rooms.map((r) => ({ id: r.id, name: r.name, temp: round(r.temp) })),
    ev_chargers: state.evChargers.map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      power_kw: c.powerKw,
    })),
  }
}

export function getMockStatus() {
  tick()
  return buildStatus()
}

// Very small "agent": keyword rules with guardrails. The real one will be LangGraph + Gemini.
export function runMockCommand(message) {
  tick()
  const text = message.toLowerCase()
  const number = text.match(/\b(\d{1,2})\b/)
  const wantsEv = /\b(ev|charg)/.test(text)
  let reply

  if (wantsEv && /(delay|postpone|later|wait)/.test(text)) {
    const dayStart = Math.floor(state.simMinutes / 1440) * 1440
    let resumeAt = dayStart + SOLAR_PEAK_HOUR * 60
    if (resumeAt <= state.simMinutes) resumeAt += 1440
    state.evChargers.forEach((c) => {
      c.status = 'delayed'
      c.powerKw = 0
      c.resumeAt = resumeAt
    })
    reply = `Done. EV charging is delayed until ${formatTime(resumeAt)}, when solar production peaks.`
  } else if (wantsEv && /(stop|pause)/.test(text)) {
    state.evChargers.forEach((c) => {
      c.status = 'idle'
      c.powerKw = 0
      c.resumeAt = null
    })
    reply = 'Done. All EV chargers are now idle.'
  } else if (wantsEv && /(start|resume|begin|now)/.test(text)) {
    state.evChargers.forEach((c) => {
      c.status = 'charging'
      c.powerKw = 7
      c.resumeAt = null
    })
    reply = 'Done. Both EV chargers are charging at 7 kW each.'
  } else if (/fountain/.test(text)) {
    state.fountainOn = !/(off|stop|close)/.test(text)
    reply = `Fountain turned ${state.fountainOn ? 'on' : 'off'}.`
  } else if (/(shade|canopy|cover)/.test(text)) {
    state.shadeClosed = !/open/.test(text)
    reply = `Courtyard shade ${state.shadeClosed ? 'closed' : 'opened'}.`
  } else if (/\b(cool|cooler|chill)\b/.test(text) || (/(set|keep|make)/.test(text) && number)) {
    const target = number ? Number(number[1]) : 22
    if (target < MIN_TARGET_TEMP || target > MAX_TARGET_TEMP) {
      reply = `I can't set ${target}°C. For safety, the target must stay between ${MIN_TARGET_TEMP}°C and ${MAX_TARGET_TEMP}°C. No change made.`
    } else {
      const average = state.rooms.reduce((sum, r) => sum + r.temp, 0) / state.rooms.length
      state.targetTemp = target
      state.acPower = Math.min(4, Math.max(0.5, 1 + (average - target) * 0.4))
      state.fountainOn = true
      state.shadeClosed = true
      reply = `Done. Target is ${target}°C. I closed the shade, turned on the fountain, and set AC power to ${state.acPower.toFixed(1)} kW.`
    }
  } else if (/(solar|produc|generat)/.test(text)) {
    reply = `Solar panels are producing ${buildStatus().solar_kw} kW right now (${buildStatus().time}).`
  } else if (/(consum|power|energy|usage|grid)/.test(text)) {
    const s = buildStatus()
    reply = `The Riad uses ${s.consumption_kw} kW and solar covers ${s.solar_kw} kW, so the grid supplies ${Math.max(0, s.grid_kw)} kW.`
  } else if (/(temp|hot|warm)/.test(text)) {
    const s = buildStatus()
    reply = `${s.rooms.map((r) => `${r.name}: ${r.temp}°C`).join(', ')}. Outside: ${s.outdoor_temp}°C.`
  } else {
    const s = buildStatus()
    reply = `It is ${s.time}. Solar ${s.solar_kw} kW, consumption ${s.consumption_kw} kW. Try: "Delay EV charging until solar peaks" or "Cool the Riad to 22°C".`
  }

  return { reply, state: buildStatus() }
}
