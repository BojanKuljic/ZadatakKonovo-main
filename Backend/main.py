from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from product import router as product_router

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Welcome to Konovo Backend API"}


# CORS – za React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Uključivanje ruta za proizvode
app.include_router(product_router, prefix="/api")
