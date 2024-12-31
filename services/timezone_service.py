import requests

TIMEZONEDB_API_KEY = "L4Q722HGWTLZ"
TIMEZONEDB_URL = "http://api.timezonedb.com/v2.1/get-time-zone" # URL to get the list of time zones, not used in this example
TIMEZONEDB_TIME_URL = "http://api.timezonedb.com/v2.1/get-time-zone"

def obtener_hora_actual(zone: str):
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
    print(TIMEZONEDB_URL , params)
    response = requests.get(TIMEZONEDB_TIME_URL, params=params)
    if response.status_code == 200:
        try:
            data = response.json()
            print(f"API Response for zone {zone}: {data}")  # Print the API response for debugging
            return data.get("formatted", "Could not get the time")
        except (KeyError, TypeError, ValueError) as e:
            raise Exception(f"Error processing the response: {e}")
    else:
        raise Exception(f"Error getting the time: {response.status_code}")