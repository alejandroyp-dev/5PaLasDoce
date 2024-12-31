const API_URL = 'https://lrws3dl5-8000.use2.devtunnels.ms';  // API URL: hardcoded for missing deployment
let countryData = null;
let timeInterval = null;
let displayedSong = false;

// Get country code and zone name from URL
const urlParams = new URLSearchParams(window.location.search);
const countryCode = urlParams.get('country');
const zoneName = urlParams.get('zoneName');

// Format numbers with thousand separators
function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}

// Update digital clock and countdown
function updateClocks(timeString) {
    const currentTime = new Date(timeString);
    
    // Update digital clock
    const timeStr = currentTime.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
    });
    document.getElementById('digitalTime').textContent = timeStr;
    
    // Update date
    const dateStr = currentTime.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('currentDate').textContent = dateStr;

    // Calculate time until 23:55
    const target = new Date(currentTime);
    target.setHours(23, 55, 0, 0);
    if (currentTime >= target) {
        target.setDate(target.getDate() + 1);
    }

    const day = currentTime.getDate();

    const diff = target - currentTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // Update countdown
    document.getElementById('countdown').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (day !== 31) {
        document.getElementById('countdown').textContent = `Happy new year! 🎉`;
    }

    // Get current hour and minute
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    // Check if we reached 23:55
    if (currentHour == 23 && currentMinute >= 55 && !displayedSong) {
        // Redirect to YouTube video
        window.location.href = 'https://youtu.be/RgbFLWG5wOI?si=OWonlOESWYlO5-Lo';
        displayedSong = true;
    } else if (hours === 0 && minutes < 5) {
        // Add special style when less than 5 minutes remaining
        document.getElementById('countdown').classList.add('almost-time');
    }
}

// Cargar datos del país
async function loadCountryData() {
    try {
        // Obtener datos del país
        const countryResponse = await fetch(`${API_URL}/country/${countryCode}`);
        if (!countryResponse.ok) throw new Error('Error al cargar los datos del país');
        
        countryData = await countryResponse.json();
        
        // Actualizar la interfaz con los datos del país
        document.getElementById('countryName').textContent = countryData.name;
        document.getElementById('countryFlag').src = countryData.flag;
        document.getElementById('population').textContent = formatNumber(countryData.population);
        document.getElementById('region').textContent = countryData.region;
        document.getElementById('subregion').textContent = countryData.subregion;
        document.getElementById('timezone').textContent = countryData.timezones.join(', ');
        
        const currencies = Object.entries(countryData.currency)
            .map(([code, name]) => `${name} (${code})`)
            .join(', ');
        document.getElementById('currency').textContent = currencies;

        // Iniciar actualización de hora
        updateCountryTime();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los datos del país');
    }
}

// Update country time
async function updateCountryTime() {
    try {
        // Fetch the current time using the zone name
        const timeResponse = await fetch(`${API_URL}/time?zone=${zoneName}`);
        if (!timeResponse.ok) throw new Error('Error getting time');
        
        // Parse the response JSON
        const timeData = await timeResponse.json();
        console.log('Time data:', timeData); // Print the API response to the console for debugging

        // Update the clocks with the fetched time
        updateClocks(timeData.time);

        // Update every second
        if (timeInterval) clearInterval(timeInterval);
        timeInterval = setInterval(() => {
            const currentTime = new Date(timeData.time);
            currentTime.setSeconds(currentTime.getSeconds() + 1);
            timeData.time = currentTime.toISOString();
            updateClocks(timeData.time);
        }, 1000);

    } catch (error) {
        console.error('Error getting time:', error);
    }
}

// Initialize page
if (countryCode && zoneName) {
    loadCountryData();
} else {
    window.location.href = 'index.html';
}