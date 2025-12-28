import { useState, useEffect } from 'react';
import './AnalogClock.css';

function AnalogClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();

    const hourDeg = (hours % 12 + minutes / 60) * 30;
    const minuteDeg = minutes * 6;
    const secondDeg = seconds * 6;

    return (
        <div className="analog-clock">
            <div className="clock-face">
                {[...Array(12)].map((_, i) => (
                    <div 
                        key={i} 
                        className="hour-mark" 
                        style={{ transform: `rotate(${i * 30}deg)` }}
                    />
                ))}
                <div className="hand hour" style={{ transform: `rotate(${hourDeg}deg)` }} />
                <div className="hand minute" style={{ transform: `rotate(${minuteDeg}deg)` }} />
                <div className="hand second" style={{ transform: `rotate(${secondDeg}deg)` }} />
                <div className="center-dot" />
            </div>
        </div>
    );
}

export default AnalogClock;
