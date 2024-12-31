import requests
from decouple import config  # To manage API keys securely
import aiohttp

TIMEZONE_API_KEY = config("TIMEZONE_API_KEY")  # Your TimeZoneDB API key
TIMEZONE_API_URL = "http://api.timezonedb.com/v2.1/list-time-zone"  # Base URL for the API

async def obtener_lista_paises():
    """
    Gets the list of countries with their codes from the TimeZoneDB API.
    """
    params = {
        'key': TIMEZONE_API_KEY,  # API key
        'format': 'json'
    }

    async with aiohttp.ClientSession() as session:
        response = await session.get(TIMEZONE_API_URL, params=params, timeout=5)

        if response.status == 200:
            try:
                data = await response.json()
                countries = []
                # Collect available countries and their codes
                for result in data.get("zones", []):
                    countries.append({
                        'name': result['countryName'],
                        'code': result['countryCode'],
                        'zoneName': result['zoneName']
                    })
                # Remove duplicates
                unique_countries = {country['code']: country for country in countries}.values()
                return list(unique_countries)
            except (KeyError, TypeError, ValueError) as e:
                raise Exception(f"Error processing the response: {e}")
            except Exception as e:
                raise Exception(e)
            finally:
                response.close()
        else:
            raise Exception(f"Error getting countries: {response.status}")
