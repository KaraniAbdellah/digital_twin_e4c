"""SQLite access. All table definitions and seed data live here.

If you already have your own tables (solar / weather), keep the names
`solar_profile(hour, kw)` and `weather(hour, temp_c)`, or change the SQL in services.py.
"""
import math
import sqlite3
import time
from contextlib import contextmanager

from .config import DB_PATH, START_HOUR

SCHEMA = """
CREATE TABLE IF NOT EXISTS state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    target_temp REAL NOT NULL,
    ac_power_kw REAL NOT NULL,
    fountain_on INTEGER NOT NULL,
    shade_closed INTEGER NOT NULL,
    clock_start_ts REAL NOT NULL,
    clock_start_min REAL NOT NULL,
    last_tick_ts REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, temp REAL NOT NULL
);
CREATE TABLE IF NOT EXISTS ev_chargers (
    id TEXT PRIMARY KEY, name TEXT NOT NULL,
    status TEXT NOT NULL,            -- charging | idle | delayed
    power_kw REAL NOT NULL,
    resume_at REAL                   -- simulated minute when a delayed charger restarts
);
CREATE TABLE IF NOT EXISTS solar_profile (hour INTEGER PRIMARY KEY, kw REAL NOT NULL);
CREATE TABLE IF NOT EXISTS weather (hour INTEGER PRIMARY KEY, temp_c REAL NOT NULL);
"""


@contextmanager
def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def reset_state(conn):
    """Put the Riad back to its starting state (does not touch solar / weather data)."""
    now = time.time()
    conn.execute("DELETE FROM state")
    conn.execute("DELETE FROM rooms")
    conn.execute("DELETE FROM ev_chargers")
    conn.execute(
        "INSERT INTO state VALUES (1, 24, 1.2, 0, 0, ?, ?, ?)",
        (now, START_HOUR * 60, now),
    )
    conn.executemany(
        "INSERT INTO rooms VALUES (?, ?, ?)",
        [("salon", "Salon", 25), ("bedroom", "Bedroom", 24), ("kitchen", "Kitchen", 26)],
    )
    conn.executemany(
        "INSERT INTO ev_chargers VALUES (?, ?, ?, ?, NULL)",
        [("ev1", "Charger 1", "charging", 7), ("ev2", "Charger 2", "idle", 0)],
    )


def _seed_profiles(conn):
    if conn.execute("SELECT COUNT(*) FROM solar_profile").fetchone()[0] == 0:
        rows = []
        for h in range(24):
            kw = 12 * max(0.0, math.sin(math.pi * (h - 6) / 13)) ** 1.2 if 6 <= h <= 19 else 0
            rows.append((h, round(kw, 2)))
        conn.executemany("INSERT INTO solar_profile VALUES (?, ?)", rows)
    if conn.execute("SELECT COUNT(*) FROM weather").fetchone()[0] == 0:
        rows = [(h, round(20 + 10 * math.sin(math.pi * (h - 9) / 12), 1)) for h in range(24)]
        conn.executemany("INSERT INTO weather VALUES (?, ?)", rows)


def init_db():
    with get_conn() as conn:
        conn.executescript(SCHEMA)
        _seed_profiles(conn)  # only fills empty tables, your own data is kept
        if conn.execute("SELECT COUNT(*) FROM state").fetchone()[0] == 0:
            reset_state(conn)
