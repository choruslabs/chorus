from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from polis.routers import conversation, auth, moderation
from polis.settings import settings
from polis.database import db
from polis.models import *


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


app.include_router(auth.router, tags=["auth"])
app.include_router(conversation.router, tags=["conversation"])
app.include_router(moderation.router, tags=["moderation"])