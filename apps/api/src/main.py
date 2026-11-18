from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.config import get_settings
from src.interfaces.http.v1 import router as v1_router

settings = get_settings()

app = FastAPI(title="Moriá Cerâmica API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    # Site no Cloudflare Pages (e prévias) e o domínio próprio, com ou sem www.
    allow_origin_regex=(
        r"^https://(([a-z0-9-]+\.)?moria-ceramica\.pages\.dev|(www\.)?moriaceramica\.com\.br)$"
    ),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router, prefix="/api/v1")
