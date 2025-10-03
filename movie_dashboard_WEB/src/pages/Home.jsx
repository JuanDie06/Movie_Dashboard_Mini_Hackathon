import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { moviesAPI, genresAPI } from '../services/api';

function Home() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPopularMovies();
    fetchGenres();
  }, []);

  const fetchPopularMovies = async () => {
    try {
      setLoading(true);
      const response = await moviesAPI.getPopular({ per_page: 12 });
      setMovies(response.data.movies || []);
      setError(null);
    } catch (err) {
      setError('Failed to load movies. Please try again.');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await genresAPI.getAll();
      setGenres(response.data || []);
    } catch (err) {
      console.error('Error fetching genres:', err);
    }
  };

  if (loading) {
    return (
      <div className="container-app min-h-[60vh] grid place-items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--color-primary)]"></div>
          <div className="text-lg text-[var(--color-text)]">Loading movies...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-app min-h-[60vh] grid place-items-center">
        <div className="text-center">
          <div className="text-rose-400 text-xl mb-4">{error}</div>
          <button 
            onClick={fetchPopularMovies}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      {/* Hero Section */}
      <div className="hero">
        <h1 className="hero__title">Discover Amazing Movies</h1>
        <p className="hero__subtitle">Browse through trending and popular movies from around the world</p>
      </div>

      <div className="section-head">
        <h2 className="section-head__title">Popular Right Now</h2>
      </div>

      <CarouselRow movies={movies} />

      {/* Genre Statistics */}
      {genres.length > 0 && (
        <div className="mt-12">
          <div className="section-head">
            <h2 className="section-head__title">Movies by Genre</h2>
          </div>
          <div className="card p-6">
            <GenreChart genres={genres} />
          </div>
        </div>
      )}
    </div>
  );
}

// Genre Popularity Chart Component
function GenreChart({ genres }) {
  // Sort by movie count and take top 10
  const chartData = genres
    .filter(genre => genre.movies_count > 0)
    .sort((a, b) => b.movies_count - a.movies_count)
    .slice(0, 10)
    .map(genre => ({
      name: genre.name,
      movies: genre.movies_count
    }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] px-3 py-2 rounded-lg shadow-lg">
          <p className="text-[var(--color-text)] font-semibold">{payload[0].payload.name}</p>
          <p className="text-[var(--color-text)]">{payload[0].value} movies</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
        <XAxis 
          dataKey="name" 
          angle={-45}
          textAnchor="end"
          height={100}
          tick={{ fill: 'var(--color-text)', fontSize: 12 }}
        />
        <YAxis 
          tick={{ fill: 'var(--color-text)', fontSize: 12 }}
          label={{ value: 'Number of Movies', angle: -90, position: 'insideLeft', fill: 'var(--color-text)' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="movies" fill="#2563EB" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default Home;

// Carousel with overlay arrows
function CarouselRow({ movies }) {
  const rowRef = useRef(null);

  const scrollByAmount = (dir) => {
    if (!rowRef.current) return;
    const amount = rowRef.current.clientWidth * 0.8;
    rowRef.current.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  return (
    <div className="carousel-wrapper">
      <div ref={rowRef} className="carousel">
        <div className="carousel__row">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className="carousel__item movie-card"
            >
              <div className="relative overflow-hidden">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-80 bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
                    <span className="text-[var(--color-text-muted)] text-sm">No Image</span>
                  </div>
                )}
                <div className="rating-chip">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span>{parseFloat(movie.vote_average).toFixed(1)}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="movie-card__title text-[var(--color-text)]">{movie.title}</h3>
                <div className="movie-card__meta">
                  <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                  <span>{parseFloat(movie.vote_average).toFixed(1)}/10</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Overlay Arrow Buttons */}
      {movies && movies.length > 3 && (
        <>
          <button 
            onClick={() => scrollByAmount(-1)} 
            className="carousel-arrow carousel-arrow--left"
            aria-label="Scroll left"
          >
            <ChevronLeft size={28} />
          </button>
          <button 
            onClick={() => scrollByAmount(1)} 
            className="carousel-arrow carousel-arrow--right"
            aria-label="Scroll right"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}
    </div>
  );
}

