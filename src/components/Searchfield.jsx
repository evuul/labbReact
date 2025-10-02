import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Searchfield = () => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('title');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('q') || '';
    const t = searchParams.get('type') || 'title';
    setQuery(q);
    setType(t);
  }, [searchParams]);

  const handleSearch = () => {
    if (query.trim()) {
      const params = new URLSearchParams({ q: query.trim(), type });
      navigate(`/?${params.toString()}`);
    }
  };
  const onKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="search-field">
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="title">Titel</option>
        <option value="year">År</option>
        <option value="director">Regissör</option>
      </select>
      <input
        type="text"
        placeholder="Sök efter film..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <button onClick={handleSearch}>Sök</button>
    </div>
  );
};

export default Searchfield;
