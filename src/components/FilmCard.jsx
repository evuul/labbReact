import React from 'react';
import { useFavorites } from '../context/FavoritesContext.jsx';

const FilmCard = ({ title, year, image, imdbID, isFavorite: isFavProp }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const fav = isFavProp ?? isFavorite(imdbID);

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    const movie = {
      imdbID,
      title,
      release_date: year ? `${year}-01-01` : null,
      poster_path: image || null,
    };
    toggleFavorite(movie);
  };

  return (
    <div className="film-card">
      {fav && <span className="fav-badge" aria-hidden>❤</span>}
      <img
        src={image || 'https://via.placeholder.com/300x450?text=No+Image'}
        alt={title}
      />
      <h3>{title || 'Okänd'}</h3>
      <p>{year || 'Okänt'}</p>
      <button onClick={handleToggleFavorite} aria-pressed={fav}>
        {fav ? '💔 Ta bort favorit' : '❤️ Lägg till favorit'}
      </button>
    </div>
  );
};

export default FilmCard;
