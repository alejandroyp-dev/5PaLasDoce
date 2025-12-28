from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from typing import List
from pathlib import Path
from services.region_service import obtener_lista_paises
from services.country_service import obtener_datos_pais
from services.timezone_service import obtener_hora_actual
from models.country_model import Country, CountryListItem

app = FastAPI(
    title="5PaLasDoce API",
    description="API para obtener información de países y zonas horarias",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/countries", response_model=List[CountryListItem])
async def listar_paises():
    try:
        countries = await obtener_lista_paises()
        return countries
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error fetching countries: {str(e)}")


@app.get("/country/{code}", response_model=Country)
async def obtener_pais(code: str):
    if not code or len(code) < 2:
        raise HTTPException(status_code=400, detail="Invalid country code")
    try:
        country = await obtener_datos_pais(code)
        return country
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Country not found: {str(e)}")


@app.get("/time")
async def obtener_hora(zone: str):
    if not zone:
        raise HTTPException(status_code=400, detail="Zone parameter is required")
    try:
        time = await obtener_hora_actual(zone)
        return {"time": time}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error fetching time: {str(e)}")


@app.get("/time/test")
async def obtener_hora_test(seconds_before: int = 30):
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    year = now.year
    target = datetime(year, 12, 31, 23, 55, 0, tzinfo=timezone.utc)
    if now > target:
        year += 1
        target = datetime(year, 12, 31, 23, 55, 0, tzinfo=timezone.utc)
    simulated = target.timestamp() - seconds_before
    return {"time": simulated}


STATIC_DIR = Path(__file__).parent / "static"

if STATIC_DIR.exists():
    @app.get("/")
    async def serve_index():
        return FileResponse(STATIC_DIR / "index.html")

    @app.get("/country/{code:path}")
    async def serve_country_page(code: str):
        return FileResponse(STATIC_DIR / "index.html")

    @app.get("/test/{code:path}")
    async def serve_test_page(code: str):
        return FileResponse(STATIC_DIR / "index.html")

    app.mount("/", StaticFiles(directory=STATIC_DIR), name="static")