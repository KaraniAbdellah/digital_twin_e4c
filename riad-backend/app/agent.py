"""LangGraph agent (Gemini). It can only change the Riad through these tools."""
from functools import lru_cache

from langchain_core.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.prebuilt import create_react_agent

from . import config, services

SYSTEM_PROMPT = (
    "You are the assistant of a simulated Moroccan riad with solar panels, rooms, a fountain, "
    "a courtyard shade and two EV chargers. Always call get_status before answering questions "
    "about energy or temperature. Use the control tools to apply changes. If a tool refuses a "
    "request, explain why. Answer in the user's language, in 1-3 short sentences."
)


def _run(func, *args):
    try:
        message, state = func(*args)
        return f"{message} Current state: {state}"
    except ValueError as error:
        return f"Refused: {error}"


@tool
def get_status() -> dict:
    """Get the current state: time, solar kW, consumption kW, grid kW, outdoor temp, rooms, EV chargers."""
    return services.get_status()


@tool
def set_ev_charging(action: str, charger_id: str | None = None, resume_hour: int | None = None) -> str:
    """Control EV chargers. action: 'delay' (restart at resume_hour, default = solar peak), 'start' or 'stop'.
    charger_id: 'ev1' or 'ev2'; leave empty for all chargers."""
    return _run(services.set_ev_charging, action, charger_id, resume_hour)


@tool
def set_target_temperature(temp: float) -> str:
    """Set the target room temperature in Celsius (allowed 16-30). Also adjusts AC power."""
    return _run(services.set_target_temperature, temp)


@tool
def set_fountain(on: bool) -> str:
    """Turn the courtyard fountain on or off."""
    return _run(services.set_fountain, on)


@tool
def set_shade(closed: bool) -> str:
    """Close (true) or open (false) the courtyard shade."""
    return _run(services.set_shade, closed)


TOOLS = [get_status, set_ev_charging, set_target_temperature, set_fountain, set_shade]


@lru_cache(maxsize=1)
def _agent():
    model = ChatGoogleGenerativeAI(model=config.GEMINI_MODEL, google_api_key=config.GOOGLE_API_KEY, temperature=0)
    return create_react_agent(model, TOOLS, prompt=SYSTEM_PROMPT)


def ask_agent(message: str) -> str:
    result = _agent().invoke({"messages": [("user", message)]})
    content = result["messages"][-1].content
    if isinstance(content, list):
        content = "".join(part.get("text", "") if isinstance(part, dict) else str(part) for part in content)
    return content
