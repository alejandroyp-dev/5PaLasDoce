from decouple import config
import aiohttp

TIMEZONE_API_KEY = config("TIMEZONE_API_KEY")
TIMEZONE_API_URL = "https://api.timezonedb.com/v2.1/list-time-zone"


async def obtener_lista_paises():
    params = {
        'key': TIMEZONE_API_KEY,
        'format': 'json'
    }

    async with aiohttp.ClientSession() as session:
        response = await session.get(TIMEZONE_API_URL, params=params, timeout=5)

        if response.status == 200:
            try:
                data = await response.json()
                countries = []
                for result in data.get("zones", []):
                    countries.append({
                        'name': result['countryName'],
                        'code': result['countryCode'],
                        'zoneName': result['zoneName']
                    })
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
