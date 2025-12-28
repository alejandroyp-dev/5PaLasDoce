const CONFIG = {
    API_URL: window.ENV_API_URL || 'http://localhost:8000',
    NEW_YEAR_VIDEO_URL: 'https://youtu.be/RgbFLWG5wOI?si=OWonlOESWYlO5-Lo',
    COUNTDOWN_TARGET_HOUR: 23,
    COUNTDOWN_TARGET_MINUTE: 55,
    CLOCK_UPDATE_INTERVAL: 1000,
    TIME_SYNC_INTERVAL: 60000
};

Object.freeze(CONFIG);
