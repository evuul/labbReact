import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, NavLink, useSearchParams, useParams } from 'react-router-dom';
import './App.css';
import Searchfield from './components/Searchfield';
import Filmlist from './components/Filmlist';
import FilmDetails from './components/FilmDetails';
import Favorites from './components/Favorites';
import Tutorialview from './components/Tutorialview';
import { searchMovies } from './services/movieService';
import { useFavorites } from './context/FavoritesContext.jsx';

function App() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { favorites } = useFavorites();
  const [theme, setTheme] = useState(''); // 'light' | 'dark'

  const exampleMovies = [
    {
      imdbID: 'tt0137523', // Fight Club
      title: 'Fight Club',
      release_date: '1999-10-15',
      poster_path: 'https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg',
    },
    {
      imdbID: 'tt0110912', // Pulp Fiction
      title: 'Pulp Fiction',
      release_date: '1994-09-10',
      poster_path: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
    },
  ];

  const handleSearchMovies = async (query, type) => {
    setError(null);
    setLoading(true);
    try {
      const results = await searchMovies(query, type);
      setMovies(results);
    } catch (err) {
      setError(err.message);
      setMovies(exampleMovies);
    }
    setLoading(false);
  };

  // Kör sökning när URL-parametrar ändras
  useEffect(() => {
    const q = searchParams.get('q');
    const t = searchParams.get('type') || 'title';
    if (q && q.trim()) {
      handleSearchMovies(q, t);
    } else {
      setMovies([]);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  // Theme handling
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
      document.documentElement.classList.toggle('theme-dark', saved === 'dark');
      return;
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('theme-dark', prefersDark);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('theme-dark', next === 'dark');
  };

  // Favoriter hanteras via FavoritesContext

  // Ta bort modal/egen details-hantering; routing visar detaljer

  const Home = () => (
    <>
      <Searchfield />
      {error && <p className="error">{error}</p>}
      {loading ? (
        <div className="loader">Laddar filmer…</div>
      ) : movies.length === 0 ? (
        <p className="muted">Ingen film att visa ännu. Sök efter något!</p>
      ) : (
        <Filmlist movies={movies} />
      )}
    </>
  );

  const FilmDetailsRoute = () => {
    const { id } = useParams();
    return <FilmDetails movieId={id} />;
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>FilmDatabas</h1>
        <div className="nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Sök</NavLink>
          <NavLink to="/favorites" className={({ isActive }) => isActive ? 'active' : ''}>Favoriter ({favorites.length})</NavLink>
          <NavLink to="/tutorial" className={({ isActive }) => isActive ? 'active' : ''}>Tutorial</NavLink>
        </div>
        <div className="theme-toggle-wrap">
          <button className="btn" onClick={toggleTheme} aria-label="Växla tema">
            {theme === 'dark' ? '☀️ Ljust läge' : '🌙 Mörkt läge'}
          </button>
        </div>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/tutorial" element={<Tutorialview />} />
          <Route path="/movie/:id" element={<FilmDetailsRoute />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
