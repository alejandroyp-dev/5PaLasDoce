from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from services.region_service import obtener_lista_paises
from services.country_service import obtener_datos_pais
from services.timezone_service import obtener_hora_actual
from models.country_model import Country

app = FastAPI()

# Allow CORS from any origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/countries", response_model=List[dict])
async def listar_paises():
    """
    Returns the list of available countries with their codes.
    """
    try:
        countries = await obtener_lista_paises()
        return countries
    except Exception as e:
        return {"error": str(e)}

@app.get("/country/{code}", response_model=Country)
async def obtener_pais(code: str):
    """
    Returns the details of a country based on its code.
    """
    try:
        country = obtener_datos_pais(code)
        return country
    except Exception as e:
        return {"error": str(e)}

@app.get("/time")
async def obtener_hora(zone: str):
    """
    Returns the current time of a country based on its time zone.
    """
    try:
        #zone = str(zone)
        #zone = "Asia/Dhaka"
        time = await obtener_hora_actual(zone)
        return {"time": time}
    except Exception as e:
        return {"error": str(e)}