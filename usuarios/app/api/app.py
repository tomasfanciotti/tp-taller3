from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.user import router as ClientRouter
from app.schemas import users
from app.db.database import engine

users.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(ClientRouter, tags=["Users"], prefix="/users")


@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Hello World!"}
