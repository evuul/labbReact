import React from 'react';
import Filmlist from './Filmlist';
import { useFavorites } from '../context/FavoritesContext.jsx';

const Favorites = () => {
  const { favorites, clearFavorites } = useFavorites();

  return (
    <div>
      <h2>Mina favoriter ({favorites.length})</h2>
      {favorites.length > 0 ? (
        <>
          <button className="btn btn-outline" onClick={clearFavorites}>Rensa alla</button>
          <Filmlist movies={favorites} />
        </>
      ) : (
        <p>Du har inga favoriter ännu.</p>
      )}
    </div>
  );
};

export default Favorites;
