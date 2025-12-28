import aiohttp
from decouple import config

TIMEZONEDB_API_KEY = config("TIMEZONE_API_KEY")
TIMEZONEDB_TIME_URL = "https://api.timezonedb.com/v2.1/get-time-zone"


async def obtener_hora_actual(zone: str):
    params = {
        "key": TIMEZONEDB_API_KEY,
        "format": "json",
        "by": "zone",
        "zone": zone,
        "fields": "formatted"
    }

    async with aiohttp.ClientSession() as session:
        response = await session.get(TIMEZONEDB_TIME_URL, params=params, timeout=5)
        if response.status == 200:
            try:
                data = await response.json()
                return data.get("formatted", "Could not get the time")
            except (KeyError, TypeError, ValueError) as e:
                raise Exception(f"Error processing the response: {e}")
            except Exception as e:
                raise Exception(e)
            finally:
                response.close()
        else:
            raise Exception(f"Error getting the time: {response.status}")
