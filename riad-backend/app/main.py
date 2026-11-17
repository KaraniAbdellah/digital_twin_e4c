from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from . import config, services
from .db import init_db


@asynccontextmanager
async def lifespan(_app):
    init_db()
    yield


app = FastAPI(title="Riad Energy Twin API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/status")
def status():
    return services.get_status()


@app.post("/chat")
def chat(request: ChatRequest):
    if not config.GOOGLE_API_KEY:
        reply = "GOOGLE_API_KEY is missing in the backend .env file."
    else:
        try:
            from .agent import ask_agent  # imported here so /status works without agent deps

            reply = ask_agent(request.message)
        except Exception as error:  # show the problem in the chat instead of a silent failure
            reply = f"Agent error: {error}"
    return {"reply": reply, "state": services.get_status()}


@app.post("/reset")
def reset():
    return services.reset()
