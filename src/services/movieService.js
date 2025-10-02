const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const searchMovies = async (query, type) => {
  try {
    let url = `${API_BASE_URL}?apikey=${API_KEY}`;
    
    if (type === 'title') {
      url += `&s=${encodeURIComponent(query)}`;
    } else if (type === 'year') {
      url += `&s=${encodeURIComponent(query)}&y=${encodeURIComponent(query)}`;
    } else if (type === 'director') {
      // Först sök brett på titel (OMDb saknar direkt regissörssökning)
      url += `&s=${encodeURIComponent(query)}`;
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error('Kunde inte hämta filmer');
    const data = await response.json();
    
    if (data.Response === 'False') throw new Error(data.Error || 'Inga filmer hittades');
    const baseList = data.Search.map((movie) => ({
      imdbID: movie.imdbID,
      title: movie.Title,
      release_date: movie.Year ? `${movie.Year}-01-01` : null,
      poster_path: movie.Poster !== 'N/A' ? movie.Poster : null,
    }));

    if (type !== 'director') return baseList;

    // Hämta detaljer och filtrera på Director
    const details = await Promise.all(
      baseList.map(async (m) => {
        try {
          const d = await getMovieDetails(m.imdbID);
          return { ...m, _director: d?.Director || '' };
        } catch {
          return { ...m, _director: '' };
        }
      })
    );

    const q = query.toLowerCase();
    return details
      .filter((m) => m._director.toLowerCase().includes(q))
      .map(({ _director, ...rest }) => rest);
  } catch (err) {
    throw new Error(err.message);
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const url = `${API_BASE_URL}?i=${movieId}&apikey=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Kunde inte hämta filmdetaljer');
    const data = await response.json();
    
    if (data.Response === 'False') throw new Error(data.Error || 'Film hittades inte');
    
    return data;
  } catch (err) {
    throw new Error(err.message);
  }
};
