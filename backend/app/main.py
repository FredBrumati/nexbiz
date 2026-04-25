from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes import transactions, dashboard

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NexBiz API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"message": "NexBiz API funcionando"}