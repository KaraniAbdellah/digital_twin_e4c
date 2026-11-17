"""Riad logic: simulation + reads + guarded writes. Used by the API and by the agent tools."""
import time

from . import config
from .db import get_conn, reset_state


def _interp(conn, table, column, hour):
    """Linear interpolation between hourly values stored in SQLite."""
    values = {r["hour"]: r[column] for r in conn.execute(f"SELECT hour, {column} FROM {table}")}
    h0 = int(hour) % 24
    h1 = (h0 + 1) % 24
    frac = hour - int(hour)
    return values[h0] * (1 - frac) + values[h1] * frac


def _tick(conn):
    """Advance the simulation (room temperatures, delayed chargers). Returns clock info."""
    state = conn.execute("SELECT * FROM state WHERE id = 1").fetchone()
    now = time.time()
    dt = min(max(now - state["last_tick_ts"], 0), 5)
    sim_min = state["clock_start_min"] + (now - state["clock_start_ts"]) * config.MINUTES_PER_REAL_SECOND
    hour = (sim_min / 60) % 24
    outside = _interp(conn, "weather", "temp_c", hour)

    for room in conn.execute("SELECT * FROM rooms").fetchall():
        temp = room["temp"] + (outside - room["temp"]) * (0.002 if state["shade_closed"] else 0.004) * dt
        if state["fountain_on"]:
            temp -= 0.01 * dt
        if state["ac_power_kw"] > 0:
            temp += (state["target_temp"] - temp) * min(0.06 * state["ac_power_kw"] * dt, 1)
        conn.execute("UPDATE rooms SET temp = ? WHERE id = ?", (temp, room["id"]))

    conn.execute(
        "UPDATE ev_chargers SET status = 'charging', power_kw = ?, resume_at = NULL "
        "WHERE status = 'delayed' AND resume_at <= ?",
        (config.CHARGER_POWER_KW, sim_min),
    )
    conn.execute("UPDATE state SET last_tick_ts = ? WHERE id = 1", (now,))
    return sim_min, hour, outside


def _format_time(sim_min):
    total = int(sim_min) % 1440
    return f"{total // 60:02d}:{total % 60:02d}"


def _build_status(conn, sim_min, hour, outside):
    state = conn.execute("SELECT * FROM state WHERE id = 1").fetchone()
    rooms = conn.execute("SELECT id, name, temp FROM rooms").fetchall()
    chargers = conn.execute("SELECT id, name, status, power_kw FROM ev_chargers").fetchall()

    solar = _interp(conn, "solar_profile", "kw", hour)
    charging_kw = sum(c["power_kw"] for c in chargers)
    consumption = 1.5 + state["ac_power_kw"] + (0.2 if state["fountain_on"] else 0) + charging_kw

    return {
        "time": _format_time(sim_min),
        "solar_kw": round(solar, 1),
        "consumption_kw": round(consumption, 1),
        "grid_kw": round(consumption - solar, 1),
        "outdoor_temp": round(outside, 1),
        "target_temp": state["target_temp"],
        "ac_power_kw": round(state["ac_power_kw"], 1),
        "fountain_on": bool(state["fountain_on"]),
        "shade_closed": bool(state["shade_closed"]),
        "rooms": [{"id": r["id"], "name": r["name"], "temp": round(r["temp"], 1)} for r in rooms],
        "ev_chargers": [dict(c) for c in chargers],
    }


def get_status():
    with get_conn() as conn:
        sim_min, hour, outside = _tick(conn)
        return _build_status(conn, sim_min, hour, outside)


def _write(change):
    """Run a write inside one transaction, then return the fresh status."""
    with get_conn() as conn:
        sim_min, hour, outside = _tick(conn)
        message = change(conn, sim_min)
        return message, _build_status(conn, sim_min, hour, outside)


def set_ev_charging(action, charger_id=None, resume_hour=None):
    """action: 'delay' | 'start' | 'stop'. charger_id None = all chargers."""
    if action not in ("delay", "start", "stop"):
        raise ValueError("action must be 'delay', 'start' or 'stop'")

    def change(conn, sim_min):
        ids = [r["id"] for r in conn.execute("SELECT id FROM ev_chargers")]
        if charger_id is not None and charger_id not in ids:
            raise ValueError(f"unknown charger '{charger_id}', valid: {ids}")
        targets = [charger_id] if charger_id else ids

        for cid in targets:
            if action == "start":
                conn.execute(
                    "UPDATE ev_chargers SET status='charging', power_kw=?, resume_at=NULL WHERE id=?",
                    (config.CHARGER_POWER_KW, cid),
                )
            elif action == "stop":
                conn.execute("UPDATE ev_chargers SET status='idle', power_kw=0, resume_at=NULL WHERE id=?", (cid,))
            else:
                hour = resume_hour
                if hour is None:  # default: the hour of peak solar production, read from SQLite
                    hour = conn.execute("SELECT hour FROM solar_profile ORDER BY kw DESC LIMIT 1").fetchone()["hour"]
                if not 0 <= hour <= 23:
                    raise ValueError("resume_hour must be between 0 and 23")
                day_start = (sim_min // 1440) * 1440
                resume_at = day_start + hour * 60
                if resume_at <= sim_min:
                    resume_at += 1440
                conn.execute(
                    "UPDATE ev_chargers SET status='delayed', power_kw=0, resume_at=? WHERE id=?",
                    (resume_at, cid),
                )
        return f"EV charging action '{action}' applied to {', '.join(targets)}."

    return _write(change)


def set_target_temperature(temp):
    if not config.MIN_TARGET_TEMP <= temp <= config.MAX_TARGET_TEMP:
        raise ValueError(
            f"target must be between {config.MIN_TARGET_TEMP} and {config.MAX_TARGET_TEMP} C, got {temp}"
        )

    def change(conn, _):
        avg = conn.execute("SELECT AVG(temp) AS t FROM rooms").fetchone()["t"]
        ac = min(config.MAX_AC_POWER_KW, max(0.5, 1 + (avg - temp) * 0.4))
        conn.execute("UPDATE state SET target_temp=?, ac_power_kw=? WHERE id=1", (temp, ac))
        return f"Target set to {temp} C, AC power set to {ac:.1f} kW."

    return _write(change)


def set_fountain(on):
    def change(conn, _):
        conn.execute("UPDATE state SET fountain_on=? WHERE id=1", (int(on),))
        return f"Fountain turned {'on' if on else 'off'}."

    return _write(change)


def set_shade(closed):
    def change(conn, _):
        conn.execute("UPDATE state SET shade_closed=? WHERE id=1", (int(closed),))
        return f"Courtyard shade {'closed' if closed else 'opened'}."

    return _write(change)


def reset():
    with get_conn() as conn:
        reset_state(conn)
    return get_status()
