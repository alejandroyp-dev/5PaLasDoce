const countrySelect = document.getElementById('countrySelect');
const loadingMessage = document.getElementById('loadingMessage');
const errorMessage = document.getElementById('errorMessage');

function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    const hourDeg = (hours % 12 + minutes / 60) * 30;
    const minuteDeg = minutes * 6;
    const secondDeg = seconds * 6;

    document.getElementById('hourHand').style.transform = 
        `translateX(-50%) rotate(${hourDeg}deg)`;
    document.getElementById('minuteHand').style.transform = 
        `translateX(-50%) rotate(${minuteDeg}deg)`;
    document.getElementById('secondHand').style.transform = 
        `translateX(-50%) rotate(${secondDeg}deg)`;
}

setInterval(updateClock, 1000);
updateClock();

async function loadCountries() {
    try {
        loadingMessage.style.display = 'block';
        errorMessage.style.display = 'none';

        const response = await fetch(`${CONFIG.API_URL}/countries`);
        if (!response.ok) throw new Error('Error loading countries');
        
        const countries = await response.json();
        countries.sort((a, b) => a.name.localeCompare(b.name));

        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.code;
            option.textContent = country.name;
            option.setAttribute('data-zone-time', country.zoneName);
            countrySelect.appendChild(option);
        });

    } catch (error) {
        errorMessage.textContent = 'Error loading the list of countries. Please try again later.';
        errorMessage.style.display = 'block';
        console.error('Error:', error);
    } finally {
        loadingMessage.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', loadCountries);

countrySelect.addEventListener('change', async (e) => {
    const selectedCountryCode = e.target.value;
    const selectedZoneName = e.target.selectedOptions[0].getAttribute('data-zone-time');
    if (selectedCountryCode) {
        window.location.href = `country-details.html?country=${selectedCountryCode}&zoneName=${selectedZoneName}`;
    }
});