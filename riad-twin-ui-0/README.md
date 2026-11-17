# Riad Energy Twin – UI

React + Vite (JavaScript) + Tailwind (CDN) + React Three Fiber.
A 3D Moroccan riad whose state is controlled by an AI agent through a REST API.

## Run

```bash
npm i
npm run dev
```

Open the URL shown in the terminal. With no backend, the UI runs in **demo mode**
(fake simulation + keyword agent), so you can try it right away.

## Connect your FastAPI backend

```bash
cp .env.example .env     # VITE_API_URL=http://localhost:8000
```

Enable CORS in FastAPI (`CORSMiddleware`, allow origin `http://localhost:5173`).

### API contract

`GET /status` →

```json
{
  "time": "13:05",
  "solar_kw": 11.8,
  "consumption_kw": 9.4,
  "grid_kw": -2.4,
  "outdoor_temp": 28.5,
  "target_temp": 24,
  "ac_power_kw": 1.2,
  "fountain_on": false,
  "shade_closed": false,
  "rooms": [{ "id": "salon", "name": "Salon", "temp": 25.1 }],
  "ev_chargers": [{ "id": "ev1", "name": "Charger 1", "status": "charging", "power_kw": 7 }]
}
```

- Room ids: `salon`, `bedroom`, `kitchen`
- Charger ids: `ev1`, `ev2`; status: `charging` | `idle` | `delayed`

`POST /chat` with `{ "message": "..." }` →

```json
{ "reply": "Done. EV charging delayed until 13:00.", "state": { "...same as /status..." } }
```

`state` is optional (the UI polls `/status` every 2 s anyway).

## Structure

```
src/
  features/
    riad/        3D scene, status API, mock backend
    chat/        chat panel, chat API
    dashboard/   header and stat cards
  global/
    context/     RiadContext (status, messages, sendMessage)
```

## Try these prompts

- How much solar are we producing?
- Delay EV charging until solar peaks
- Cool the Riad to 22°C
- Set the temperature to 5 (guardrail refuses)
