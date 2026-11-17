import os

from dotenv import load_dotenv

load_dotenv()

DB_PATH = os.getenv("DB_PATH", "riad.db")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2-flash-lite")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

# Guardrails: the agent can never go outside these limits.
MIN_TARGET_TEMP = 16
MAX_TARGET_TEMP = 30
MAX_AC_POWER_KW = 4.0
CHARGER_POWER_KW = 7.0

# Simulation clock: 1 real second = 1 simulated minute.
MINUTES_PER_REAL_SECOND = 1
START_HOUR = 10
