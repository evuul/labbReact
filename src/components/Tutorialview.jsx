import React, { useEffect, useState } from 'react';
import { getMovieDetails } from '../services/movieService';

const IconSearch = (props) => (
  <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden {...props}>
    <circle cx="11" cy="11" r="7" stroke="#0f172a" strokeWidth="2" fill="none"/>
    <line x1="16.65" y1="16.65" x2="22" y2="22" stroke="#0f172a" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const IconHeart = (props) => (
  <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden {...props}>
    <path d="M12 21s-7-4.35-9.33-8A5.5 5.5 0 0 1 12 6.67 5.5 5.5 0 0 1 21.33 13C19 16.65 12 21 12 21z" fill="#ef4444"/>
  </svg>
);
const IconList = (props) => (
  <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden {...props}>
    <rect x="4" y="5" width="16" height="2" rx="1" fill="#0f172a"/>
    <rect x="4" y="11" width="16" height="2" rx="1" fill="#0f172a"/>
    <rect x="4" y="17" width="12" height="2" rx="1" fill="#0f172a"/>
  </svg>
);
const IconInfo = (props) => (
  <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden {...props}>
    <circle cx="12" cy="12" r="10" fill="#0f172a" opacity="0.06"/>
    <circle cx="12" cy="7.5" r="1.25" fill="#0f172a"/>
    <rect x="11" y="10.5" width="2" height="7" rx="1" fill="#0f172a"/>
  </svg>
);
const MockSearchBar = () => (
  <div className="mock-search">
    <div className="mock-select">Titel ▾</div>
    <div className="mock-input">Sök efter film…</div>
    <div className="mock-button">Sök</div>
  </div>
);

const MockCard = ({ favorited = false }) => (
  <div className="mock-card">
    <div className="mock-poster" />
    <div className="mock-title" />
    <div className="mock-sub" />
    <div className={`mock-heart ${favorited ? 'on' : ''}`}>❤</div>
  </div>
);

const MockModal = () => (
  <div className="mock-modal">
    <div className="mock-poster-lg" />
    <div className="mock-lines">
      <div className="line w60" />
      <div className="line w40" />
      <div className="line w90" />
      <div className="line w80" />
    </div>
  </div>
);

const ids = {
  godfather: 'tt0068646',
  darkKnight: 'tt0468569',
  hp1: 'tt0241527',
  lotr1: 'tt0120737',
  lotr2: 'tt0167261',
  lotr3: 'tt0167260',
};

const fallbacks = {
  [ids.godfather]: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmYtYTAwOS00ZjQxLTgxODItZmI1ZWI2NGQzODQ2XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
  [ids.darkKnight]: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
  [ids.hp1]: 'https://m.media-amazon.com/images/M/MV5BMDkzNmM1NTQtZTM3Ni00MDNmLThkYjUtMzY0MjE2ZTYzNjJhXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
  [ids.lotr1]: 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNmZiMC00N2QzLThmZjItYzViN2QzZTc4Y2JlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
  [ids.lotr2]: 'https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2E5Mi00N2U3LTgwNDctN2YzZTRkYzAyMDc2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
  [ids.lotr3]: 'https://m.media-amazon.com/images/M/MV5BNzA3ZDNlYzktN2YxOC00ZjQ3LWE1ZDMtOGE2ZjBkYjc3Y2QyXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
};

const Tutorialview = () => {
  const [details, setDetails] = useState({});
  const snippetSearch = [
    "import Searchfield from './components/Searchfield';",
    "import Filmlist from './components/Filmlist';",
    '',
    'const HomeView = ({ movies }) => (',
    '  <>',
    '    <Searchfield />',
    '    <Filmlist movies={movies} />',
    '  </>',
    ');',
  ];

  const snippetDetails = [
    "import { useParams } from 'react-router-dom';",
    "import FilmDetails from './components/FilmDetails';",
    '',
    'const FilmDetailsRoute = () => {',
    '  const { id } = useParams();',
    '  return <FilmDetails movieId={id} />;',
    '};',
  ];

  const snippetFavorite = [
    "import { useFavorites } from './context/FavoritesContext';",
    '',
    'const FavoriteButton = ({ movie }) => {',
    '  const { isFavorite, toggleFavorite } = useFavorites();',
    '  const saved = isFavorite(movie.imdbID);',
    '',
    '  return (',
    '    <button onClick={() => toggleFavorite(movie)}>',
    "      {saved ? 'Ta bort favorit' : 'Lägg till favorit'}",
    '    </button>',
    '  );',
    '};',
  ];

  const snippetList = [
    "import Favorites from './components/Favorites';",
    '',
    'const FavoritesPage = () => (',
    '  <section>',
    "    <h2>Mina favoriter</h2>",
    '    <Favorites />',
    '  </section>',
    ');',
  ];

  useEffect(() => {
    const load = async () => {
      const idsList = Object.values(ids);
      const results = await Promise.all(idsList.map(async (id) => {
        try {
          const d = await getMovieDetails(id);
          return [id, d];
        } catch {
          return [id, null];
        }
      }));
      setDetails(Object.fromEntries(results));
    };
    load();
  }, []);

  const poster = (id) => {
    const d = details[id];
    if (d && d.Poster && d.Poster !== 'N/A') return d.Poster;
    return fallbacks[id];
  };

  const title = (id, fallbackTitle) => details[id]?.Title || fallbackTitle;
  const year = (id, fallbackYear) => details[id]?.Year || fallbackYear;
  const director = (id, fallbackDirector) => details[id]?.Director || fallbackDirector;
  const imdb = (id, fallbackRating) => details[id]?.imdbRating || fallbackRating;
  const plot = (id, fallbackPlot) => details[id]?.Plot || fallbackPlot;

  return (
    <section className="tutorial">
      <h2 className="tutorial-title">Så fungerar FilmDatabas</h2>
      <p className="tutorial-subtitle muted">En snabb guide – från sökning till favoriter</p>

      <div className="tutorial-grid">
        <article className="tutorial-card">
          <div className="tutorial-head"><IconSearch /><h3>Sök efter filmer</h3></div>
          <p>Ange titel, år eller välj regissör. Tryck Enter för att söka.</p>
          <div className="tutorial-illustration" aria-label="Exempel på sökfält">
            <MockSearchBar />
          </div>
          <div className="code-text" aria-label="Kodexempel för Searchfield">
            {snippetSearch.map((line, index) => (
              <span key={`search-${index}`}>{line}</span>
            ))}
          </div>
        </article>

        <article className="tutorial-card">
          <div className="tutorial-head"><IconInfo /><h3>Öppna detaljer (The Godfather)</h3></div>
          <p>Klicka på en film i listan för att visa mer information.</p>
          <div className="tutorial-illustration godfather" aria-label="Exempel på filmdetaljer">
            <div className="mock-modal">
              <img className="poster-lg" alt="The Godfather poster" src={poster(ids.godfather)} />
              <div className="mock-lines">
                <div className="real-text">
                  <div><strong>Titel:</strong> {title(ids.godfather, 'The Godfather')}</div>
                  <div><strong>År:</strong> {year(ids.godfather, '1972')}</div>
                  <div><strong>Regissör:</strong> {director(ids.godfather, 'Francis Ford Coppola')}</div>
                  <div><strong>Plot:</strong> {plot(ids.godfather, 'En maffiaptriark överför kontrollen över sitt imperium till sin motvillige son.')}</div>
                  <div><strong>IMDb:</strong> {imdb(ids.godfather, '9.2')}/10</div>
                </div>
              </div>
            </div>
          </div>
          <div className="code-text" aria-label="Kodexempel för FilmDetails">
            {snippetDetails.map((line, index) => (
              <span key={`details-${index}`}>{line}</span>
            ))}
          </div>
        </article>

        <article className="tutorial-card">
          <div className="tutorial-head"><IconHeart /><h3>Lägg till i favoriter</h3></div>
          <p>Exempel: The Dark Knight.</p>
          <div className="tutorial-illustration" aria-label="Exempel på favoritmarkering">
            <div className="fav-item">
              <img src={poster(ids.darkKnight)} alt={title(ids.darkKnight, 'The Dark Knight')} />
              <div className="fav-meta">
                <div className="fav-title">{title(ids.darkKnight, 'The Dark Knight')}</div>
                <div className="fav-sub">{year(ids.darkKnight, '2008')} · {director(ids.darkKnight, 'Christopher Nolan')}</div>
              </div>
              <div className="mock-heart on" title="Favorit">❤</div>
            </div>
          </div>
          <div className="code-text" aria-label="Kodexempel för favoritknapp">
            {snippetFavorite.map((line, index) => (
              <span key={`favorite-${index}`}>{line}</span>
            ))}
          </div>
        </article>

        <article className="tutorial-card">
          <div className="tutorial-head"><IconList /><h3>Favoritlista (exempel)</h3></div>
          <p>Harry Potter och Sagan om ringen-trilogin.</p>
          <div className="tutorial-illustration" aria-label="Exempel på lista">
            <div className="fav-examples">
              <div className="fav-item">
                <img src={poster(ids.hp1)} alt={title(ids.hp1, "Harry Potter and the Sorcerer's Stone")} />
                <div className="fav-meta">
                  <div className="fav-title">{title(ids.hp1, "Harry Potter and the Sorcerer's Stone")}</div>
                  <div className="fav-sub">{year(ids.hp1, '2001')} · {director(ids.hp1, 'Chris Columbus')}</div>
                </div>
              </div>
              <div className="fav-item">
                <img src={poster(ids.lotr1)} alt={title(ids.lotr1, 'The Fellowship of the Ring')} />
                <div className="fav-meta">
                  <div className="fav-title">{title(ids.lotr1, 'The Fellowship of the Ring')}</div>
                  <div className="fav-sub">{year(ids.lotr1, '2001')} · {director(ids.lotr1, 'Peter Jackson')}</div>
                </div>
              </div>
              <div className="fav-item">
                <img src={poster(ids.lotr2)} alt={title(ids.lotr2, 'The Two Towers')} />
                <div className="fav-meta">
                  <div className="fav-title">{title(ids.lotr2, 'The Two Towers')}</div>
                  <div className="fav-sub">{year(ids.lotr2, '2002')} · {director(ids.lotr2, 'Peter Jackson')}</div>
                </div>
              </div>
              <div className="fav-item">
                <img src={poster(ids.lotr3)} alt={title(ids.lotr3, 'The Return of the King')} />
                <div className="fav-meta">
                  <div className="fav-title">{title(ids.lotr3, 'The Return of the King')}</div>
                  <div className="fav-sub">{year(ids.lotr3, '2003')} · {director(ids.lotr3, 'Peter Jackson')}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="code-text" aria-label="Kodexempel för favoritlista">
            {snippetList.map((line, index) => (
              <span key={`list-${index}`}>{line}</span>
            ))}
          </div>
        </article>
      </div>

      <div className="tutorial-notes">
        <p className="muted">
          Tips: Regissörsökning filtrerar resultaten genom att slå upp detaljer per träff. Sök kan även delas via URL, t.ex. <code>/?q=inception&amp;type=title</code>.
        </p>
      </div>
    </section>
  );
};

export default Tutorialview;
