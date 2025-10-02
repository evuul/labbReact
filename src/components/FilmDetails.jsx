import React, { useState, useEffect } from 'react';
import { getMovieDetails } from '../services/movieService';
import { useFavorites } from '../context/FavoritesContext.jsx';

const FilmDetails = ({ movieId }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getMovieDetails(movieId);
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [movieId]);

  const handleToggleFavorite = () => {
    if (!movie) return;
    toggleFavorite({
      imdbID: movie.imdbID,
      title: movie.Title,
      release_date: movie.Year ? `${movie.Year}-01-01` : null,
      poster_path: movie.Poster !== 'N/A' ? movie.Poster : null,
    });
  };

  if (loading) return <div className="film-details">Laddar...</div>;
  if (error) return <div className="film-details">Fel: {error}</div>;
  if (!movie) return null;

  return (
    <div className="film-details">
      <h2>{movie.Title}</h2>
      <img
        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
        alt={movie.Title}
      />
      <p>År: {movie.Year || 'Okänt'}</p>
      <p>Regissör: {movie.Director || 'Okänd'}</p>
      <p>Översikt: {movie.Plot || 'Ingen beskrivning tillgänglig'}</p>
      <button onClick={handleToggleFavorite} aria-pressed={isFavorite(movie.imdbID)}>
        {isFavorite(movie.imdbID) ? '💔 Ta bort favorit' : '❤️ Lägg till favorit'}
      </button>
    </div>
  );
};

export default FilmDetails;
