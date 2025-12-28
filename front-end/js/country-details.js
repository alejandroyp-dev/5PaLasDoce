let countryData = null;
let timeInterval = null;
let displayedSong = false;

const urlParams = new URLSearchParams(window.location.search);
const countryCode = urlParams.get('country');
const zoneName = urlParams.get('zoneName');

function formatNumber(num) {
    return new Intl.NumberFormat().format(num);
}

function updateClocks(timeString) {
    const currentTime = new Date(timeString);
    
    const timeStr = currentTime.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false 
    });
    document.getElementById('digitalTime').textContent = timeStr;
    
    const dateStr = currentTime.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('currentDate').textContent = dateStr;

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
    
    document.getElementById('countdown').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (day !== 31) {
        document.getElementById('countdown').textContent = `Happy new year! 🎉`;
    }

    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    if (currentHour == CONFIG.COUNTDOWN_TARGET_HOUR && currentMinute >= CONFIG.COUNTDOWN_TARGET_MINUTE && !displayedSong) {
        window.location.href = CONFIG.NEW_YEAR_VIDEO_URL;
        displayedSong = true;
    } else if (hours === 0 && minutes < 5) {
        document.getElementById('countdown').classList.add('almost-time');
    }
}

async function loadCountryData() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    try {
        const countryResponse = await fetch(`${CONFIG.API_URL}/country/${countryCode}`);
        if (!countryResponse.ok) throw new Error('Error al cargar los datos del país');
        
        countryData = await countryResponse.json();
        
        document.getElementById('countryName').textContent = countryData.name;
        document.getElementById('countryFlag').src = countryData.flag;
        document.getElementById('population').textContent = formatNumber(countryData.population);
        document.getElementById('region').textContent = countryData.region;
        document.getElementById('subregion').textContent = countryData.subregion;
        document.getElementById('timezone').textContent = countryData.timezones.join(', ');
        
        const currencies = countryData.currency 
            ? Object.entries(countryData.currency)
                .map(([code, name]) => `${name} (${code})`)
                .join(', ')
            : 'No disponible';
        document.getElementById('currency').textContent = currencies;

        loadingOverlay.classList.add('hidden');
        updateCountryTime();
        
    } catch (error) {
        console.error('Error:', error);
        loadingOverlay.classList.add('hidden');
        document.getElementById('countryName').textContent = 'Error al cargar';
        alert('Error al cargar los datos del país. Por favor, intente nuevamente.');
    }
}

async function updateCountryTime() {
    try {
        const timeResponse = await fetch(`${CONFIG.API_URL}/time?zone=${zoneName}`);
        if (!timeResponse.ok) throw new Error('Error getting time');
        
        const timeData = await timeResponse.json();
        updateClocks(timeData.time);

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

if (countryCode && zoneName) {
    loadCountryData();
} else {
    window.location.href = 'index.html';
}