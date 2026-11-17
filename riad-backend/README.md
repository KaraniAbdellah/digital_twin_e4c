# Riad Energy Twin – Backend

FastAPI + SQLite + LangGraph agent (Gemini).

## Run

```bash
uv venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
uv pip install -r requirements.txt
cp .env.example .env               # add your GOOGLE_API_KEY
uvicorn app.main:app --reload --port 8000
```

Docs: http://localhost:8000/docs

## Endpoints

| Method | Path      | What it does                                   |
|--------|-----------|------------------------------------------------|
| GET    | /status   | Current state (UI polls this every 2 s)        |
| POST   | /chat     | `{ "message": "..." }` -> agent reply + state  |
| POST   | /reset    | Back to the starting state (handy before demo) |

## Data (SQLite, file `riad.db`)

Created automatically on first start.

- `solar_profile(hour, kw)` and `weather(hour, temp_c)`: hourly data, read by the simulation.
  If you already have these tables, they are kept (only empty tables are filled).
- `state`, `rooms`, `ev_chargers`: live state changed by the agent.

## Layers

`main.py` (routes) -> `agent.py` (tools) -> `services.py` (logic + guardrails) -> `db.py` (SQLite)

The agent never writes to the DB directly; it only calls the tools, and `services.py`
validates every value (target temp 16-30 C, valid charger ids, valid hours).
