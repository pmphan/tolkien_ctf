import os
import logging.config
from pyaml_env import parse_config
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.endpoints import endpoints
from app.api.router import router


def init_logging():
    env = os.getenv("SERVICE_ENV", "dev")
    config = parse_config("config/logging.yml").get(env)
    logging.config.dictConfig(config)
    return config


def load_config():
    env = os.getenv("SERVICE_ENV", "dev")
    config = parse_config("config/config.yml").get(env)
    return config

async def on_startup():
    config = load_config()
    endpoints.init_config(config)
    await endpoints.init_db()

def create_app():
    init_logging()

    app = FastAPI(title="Backend Service")

    app.include_router(router, prefix="/api/v1/auth")
    app.add_event_handler('startup', on_startup)
    return app
