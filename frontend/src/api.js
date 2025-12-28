import CONFIG from './config';

export async function fetchCountries() {
    const response = await fetch(`${CONFIG.API_URL}/countries`);
    if (!response.ok) throw new Error('Error loading countries');
    return response.json();
}

export async function fetchCountry(code) {
    const response = await fetch(`${CONFIG.API_URL}/country/${code}`);
    if (!response.ok) throw new Error('Error loading country');
    return response.json();
}

export async function fetchTime(zone) {
    const response = await fetch(`${CONFIG.API_URL}/time?zone=${encodeURIComponent(zone)}`);
    if (!response.ok) throw new Error('Error loading time');
    return response.json();
}
