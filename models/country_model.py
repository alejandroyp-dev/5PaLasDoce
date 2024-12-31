from pydantic import BaseModel
from typing import List, Optional

class Country(BaseModel):
    name: str
    flag: str
    population: int
    region: str
    subregion: str
    timezones: List[str]
    currency: Optional[dict]  # Puede ser None si no se encuentra información
