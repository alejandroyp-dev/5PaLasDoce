import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { fetchCountry, fetchTime } from '../api';
import CONFIG from '../config';
import Footer from '../components/Footer';
import './CountryDetails.css';

function CountryDetails() {
    const { code } = useParams();
    const [searchParams] = useSearchParams();
    const zone = searchParams.get('zone');
    const navigate = useNavigate();

    const [country, setCountry] = useState(null);
    const [currentTime, setCurrentTime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const redirected = useRef(false);

    useEffect(() => {
        if (!code || !zone) {
            navigate('/');
            return;
        }

        Promise.all([fetchCountry(code), fetchTime(zone)])
            .then(([countryData, timeData]) => {
                setCountry(countryData);
                setCurrentTime(new Date(timeData.time));
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [code, zone, navigate]);

    useEffect(() => {
        if (!currentTime) return;

        const interval = setInterval(() => {
            setCurrentTime(prev => new Date(prev.getTime() + 1000));
        }, 1000);

        return () => clearInterval(interval);
    }, [currentTime]);

    useEffect(() => {
        if (!currentTime || redirected.current) return;

        const hour = currentTime.getHours();
        const minute = currentTime.getMinutes();
        const day = currentTime.getDate();
        const month = currentTime.getMonth();

        if (month === 11 && day === 31 && hour === CONFIG.COUNTDOWN_TARGET_HOUR && minute >= CONFIG.COUNTDOWN_TARGET_MINUTE) {
            redirected.current = true;
            window.location.href = CONFIG.NEW_YEAR_VIDEO_URL;
        }
    }, [currentTime]);

    const formatTime = (date) => {
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getCountdown = () => {
        if (!currentTime) return '00:00:00';

        const day = currentTime.getDate();
        const month = currentTime.getMonth();

        if (month !== 11 || day !== 31) {
            return '¡Feliz Año Nuevo! 🎉';
        }

        const target = new Date(currentTime);
        target.setHours(23, 55, 0, 0);

        if (currentTime >= target) {
            return '¡Es hora! 🎊';
        }

        const diff = target - currentTime;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const isAlmostTime = () => {
        if (!currentTime) return false;
        const target = new Date(currentTime);
        target.setHours(23, 55, 0, 0);
        const diff = target - currentTime;
        return diff > 0 && diff < 5 * 60 * 1000;
    };

    const formatNumber = (num) => new Intl.NumberFormat('es-ES').format(num);

    const getCurrencies = () => {
        if (!country?.currency) return 'No disponible';
        return Object.entries(country.currency)
            .map(([code, name]) => `${name} (${code})`)
            .join(', ');
    };

    if (loading) {
        return (
            <div className="country-details loading-state">
                <div className="spinner"></div>
                <p>Cargando información...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="country-details error-state">
                <p>Error: {error}</p>
                <button onClick={() => navigate('/')}>Volver</button>
            </div>
        );
    }

    return (
        <div className="country-details">
            <header className="details-header">
                <button className="back-btn" onClick={() => navigate('/')}>← Volver</button>
                <h1>{country.name}</h1>
            </header>

            <main className="details-content">
                <div className="flag-card">
                    <img src={country.flag} alt={`Bandera de ${country.name}`} />
                </div>

                <div className="time-card">
                    <div className="digital-time">{currentTime && formatTime(currentTime)}</div>
                    <div className="date">{currentTime && formatDate(currentTime)}</div>
                    <div className="countdown-section">
                        <span className="countdown-label">Tiempo para 5 pa' las 12:</span>
                        <span className={`countdown ${isAlmostTime() ? 'almost-time' : ''}`}>
                            {getCountdown()}
                        </span>
                    </div>
                </div>

                <div className="info-card">
                    <h2>Información</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="label">Población</span>
                            <span className="value">{formatNumber(country.population)}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Región</span>
                            <span className="value">{country.region}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Subregión</span>
                            <span className="value">{country.subregion || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Moneda</span>
                            <span className="value">{getCurrencies()}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Zona Horaria</span>
                            <span className="value">{country.timezones.join(', ')}</span>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default CountryDetails;
