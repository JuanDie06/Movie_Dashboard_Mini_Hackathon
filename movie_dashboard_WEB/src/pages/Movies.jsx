import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { moviesAPI, genresAPI } from '../services/api';

function Movies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchQuery = searchParams.get('search') || '';
  const selectedGenre = searchParams.get('genre') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [searchQuery, selectedGenre, currentPage]);

  const fetchGenres = async () => {
    try {
      const response = await genresAPI.getAll();
      setGenres(response.data || []);
    } catch (err) {
      console.error('Error fetching genres:', err);
    }
  };

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, per_page: 20 };
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      if (selectedGenre) {
        params.genre_id = selectedGenre;
      }
      
      const response = await moviesAPI.getAll(params);
      setMovies(response.data.movies || []);
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData.get('search');
    setSearchParams({ search, page: '1' });
  };

  const handleGenreFilter = (genreId) => {
    if (genreId) {
      setSearchParams({ genre: genreId, page: '1' });
    } else {
      setSearchParams({});
    }
  };

  // Calculate rating distribution
  const getRatingDistribution = () => {
    const distribution = {};
    for (let i = 0; i <= 10; i++) {
      distribution[i] = 0;
    }
    
    movies.forEach(movie => {
      const rating = Math.floor(movie.vote_average);
      if (rating >= 0 && rating <= 10) {
        distribution[rating]++;
      }
    });
    
    return Object.keys(distribution).map(key => ({
      rating: `${key}.0`,
      count: distribution[key]
    })).filter(item => item.count > 0);
  };

  return (
    <div className="container-app py-8">
      <h1 className="movies__title">Browse Movies</h1>

      {/* Rating Distribution Chart */}
      {!searchQuery && !selectedGenre && movies.length > 0 && (
        <div className="card p-6 mb-8">
          <h2 className="heading-section mb-4">Rating Distribution</h2>
          <RatingDistributionChart data={getRatingDistribution()} />
        </div>
      )}
      
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="movies__toolbar">
        <input
          type="text"
          name="search"
          defaultValue={searchQuery}
          placeholder="Search movies..."
          className="input flex-1 min-w-64"
        />
        <button
          type="submit"
          className="btn-primary"
        >
          Search
        </button>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className="btn-ghost"
          >
            Clear
          </button>
        )}
      </form>

      {/* Genre Filter */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold mb-3 text-[var(--color-text-muted)]">Filter by Genre:</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleGenreFilter('')}
            className={`genre-chip ${!selectedGenre ? 'genre-chip--active' : ''}`}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreFilter(genre.id)}
              className={`genre-chip ${selectedGenre === String(genre.id) ? 'genre-chip--active' : ''}`}
            >
              {genre.name} ({genre.movies_count})
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="text-center py-12 text-[var(--color-text-muted)]">Loading...</div>
      ) : movies.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-text-muted)]">
          No movies found. Try a different search or filter.
        </div>
      ) : (
        <div className="movies__grid">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className="movie-card"
            >
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-80 object-cover"
                />
              ) : (
                <div className="w-full h-80 bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
                  <span className="text-[var(--color-text-muted)]">No Image</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="movie-card__title text-[var(--color-text)]">{movie.title}</h3>
                <div className="movie-card__meta">
                  <span>{movie.release_date?.split('-')[0]}</span>
                  <span className="flex items-center">
                    {parseFloat(movie.vote_average).toFixed(1)}/10
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Rating Distribution Chart Component
function RatingDistributionChart({ data }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-2 rounded-lg shadow-lg">
          <p className="text-[var(--color-text)] font-semibold">Rating: {payload[0].payload.rating}</p>
          <p className="text-[var(--color-text)]">{payload[0].value} movies</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="text-[var(--color-text-muted)] text-sm mb-4">
      <p>Distribution of movie ratings across the database</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
          <XAxis 
            dataKey="rating" 
            tick={{ fill: 'var(--color-text)', fontSize: 12 }}
            label={{ value: 'Rating (0-10)', position: 'insideBottom', offset: -10, fill: 'var(--color-text)' }}
          />
          <YAxis 
            tick={{ fill: 'var(--color-text)', fontSize: 12 }}
            label={{ value: 'Number of Movies', angle: -90, position: 'insideLeft', fill: 'var(--color-text)' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Movies;

