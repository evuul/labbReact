import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('favorites');
      if (raw) setFavorites(JSON.parse(raw));
    } catch {}
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const isFavorite = (imdbID) => favorites.some((m) => m.imdbID === imdbID);

  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.some((m) => m.imdbID === movie.imdbID);
      if (exists) return prev.filter((m) => m.imdbID !== movie.imdbID);
      return [...prev, movie];
    });
  };

  const clearFavorites = () => setFavorites([]);

  const value = useMemo(() => ({ favorites, isFavorite, toggleFavorite, clearFavorites }), [favorites]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
};

