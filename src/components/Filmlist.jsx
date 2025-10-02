import React from 'react';
import { useNavigate } from 'react-router-dom';
import FilmCard from './FilmCard';
import { useFavorites } from '../context/FavoritesContext.jsx';

const Filmlist = ({ movies = [] }) => {
  const navigate = useNavigate();
  const { isFavorite } = useFavorites();
  const handleCardClick = (imdbID) => {
    navigate(`/movie/${imdbID}`);
  };

  return (
    <div className="film-list">
      {movies.map((movie) => (
        <div key={movie.imdbID} onClick={() => handleCardClick(movie.imdbID)}>
          <FilmCard
            title={movie.title}
            year={movie.release_date ? movie.release_date.substring(0, 4) : 'Okänt'}
            image={movie.poster_path ? movie.poster_path : null}
            imdbID={movie.imdbID}
            isFavorite={isFavorite(movie.imdbID)}
          />
        </div>
      ))}
    </div>
  );
};

export default Filmlist;
