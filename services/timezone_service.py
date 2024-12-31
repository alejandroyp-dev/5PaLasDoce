import requests
import aiohttp

TIMEZONEDB_API_KEY = "L4Q722HGWTLZ"
TIMEZONEDB_URL = "http://api.timezonedb.com/v2.1/get-time-zone" # URL to get the list of time zones, not used in this example
TIMEZONEDB_TIME_URL = "http://api.timezonedb.com/v2.1/get-time-zone"

async def obtener_hora_actual(zone: str):
    """
    Gets the current time of a country based on its time zone.
    """
    #zone = "America/Bogota"
    params = {
        "key": TIMEZONEDB_API_KEY,
        "format": "json",
        "by": "zone",
        "zone": zone,  
        "fields": "formatted"  # Customize the fields to display in the response
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
