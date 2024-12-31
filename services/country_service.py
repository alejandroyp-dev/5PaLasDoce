import requests
from decouple import config  # To manage API keys securely

REST_COUNTRIES_URL = "https://restcountries.com/v3.1/alpha"  # Base URL for the API

def obtener_datos_pais(code: str):
    """
    Gets the details of a country based on its code.
    """
    url = f"{REST_COUNTRIES_URL}/{code}"

    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        if data:
            country_data = data[0]
            country = {
                'name': country_data['name']['common'],
                'flag': country_data['flags']['svg'] if 'flags' in country_data and 'svg' in country_data['flags'] else "",
                'population': country_data['population'],
                'region': country_data['region'],
                'subregion': country_data.get('subregion', ""),
                'timezones': country_data['timezones'],
                'currency': {key: value['name'] for key, value in country_data['currencies'].items()} if 'currencies' in country_data else {}
            }
            return country
        else:
            raise Exception("No data found for this country code.")
    else:
        raise Exception(f"Error getting country data: {response.status_code}")