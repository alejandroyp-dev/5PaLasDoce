import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CountryDetails from './pages/CountryDetails';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/country/:code" element={<CountryDetails />} />
            <Route path="/test/:code" element={<CountryDetails testMode />} />
        </Routes>
    );
}

export default App;
