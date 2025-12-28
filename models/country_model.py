from pydantic import BaseModel
from typing import List, Optional


class CountryListItem(BaseModel):
    name: str
    code: str
    zoneName: str


class Country(BaseModel):
    name: str
    flag: str
    population: int
    region: str
    subregion: str
    timezones: List[str]
    currency: Optional[dict] = None
