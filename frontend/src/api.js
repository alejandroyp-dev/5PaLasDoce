import CONFIG from './config';

export async function fetchCountries() {
    const response = await fetch(`${CONFIG.API_URL}/api/countries`);
    if (!response.ok) throw new Error('Error loading countries');
    return response.json();
}

export async function fetchCountry(code) {
    const response = await fetch(`${CONFIG.API_URL}/api/country/${code}`);
    if (!response.ok) throw new Error('Error loading country');
    return response.json();
}

export async function fetchTime(zone) {
    const response = await fetch(`${CONFIG.API_URL}/api/time?zone=${encodeURIComponent(zone)}`);
    if (!response.ok) throw new Error('Error loading time');
    return response.json();
}

export async function fetchTestTime(secondsBefore = 30) {
    const response = await fetch(`${CONFIG.API_URL}/api/time/test?seconds_before=${secondsBefore}`);
    if (!response.ok) throw new Error('Error loading test time');
    return response.json();
}
