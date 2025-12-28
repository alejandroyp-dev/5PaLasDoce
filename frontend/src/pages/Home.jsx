import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCountries } from '../api';
import AnalogClock from '../components/AnalogClock';
import Footer from '../components/Footer';
import './Home.css';

function Home() {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCountries()
            .then(data => {
                const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
                setCountries(sorted);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const handleSelect = (e) => {
        const selected = countries.find(c => c.code === e.target.value);
        if (selected) {
            navigate(`/country/${selected.code}?zone=${encodeURIComponent(selected.zoneName)}`);
        }
    };

    return (
        <div className="home">
            <header className="home-header">
                <h1>5 Pa' Las Doce</h1>
                <span className="version">v4.0</span>
            </header>

            <AnalogClock />

            <div className="select-container">
                {loading && <p className="loading">Cargando países...</p>}
                {error && <p className="error">{error}</p>}
                {!loading && !error && (
                    <select onChange={handleSelect} defaultValue="">
                        <option value="" disabled>Selecciona tu país...</option>
                        {countries.map(country => (
                            <option key={country.code} value={country.code}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Home;
