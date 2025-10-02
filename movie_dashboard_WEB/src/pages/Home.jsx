import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { moviesAPI } from '../services/api';

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPopularMovies();
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          <div className="text-xl text-gray-600">Loading movies...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <button 
            onClick={fetchPopularMovies}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-8 text-white shadow-lg">
        <h1 className="text-5xl font-bold mb-4">Discover Amazing Movies</h1>
        <p className="text-xl opacity-90">Browse through trending and popular movies from around the world</p>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-3xl font-bold">Popular Right Now</h2>
        <CarouselArrows movies={movies} />
      </div>

      <CarouselRow movies={movies} />
    </div>
  );
}

export default Home;

// Simple scroll-snap carousel row (3 per view)
function CarouselRow({ movies }) {
  const rowRef = useRef(null);

  return (
    <div ref={rowRef} className="overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2">
      <div className="flex gap-6">
        {movies.map((movie) => (
          <Link
            key={movie.id}
            to={`/movies/${movie.id}`}
            className="snap-start basis-1/3 shrink-0 bg-white rounded-lg shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden group"
          >
            <div className="relative overflow-hidden">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-80 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              )}
              <div className="absolute top-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded-lg flex items-center gap-1">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span className="font-bold">{parseFloat(movie.vote_average).toFixed(1)}</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{movie.title}</h3>
              <div className="text-sm text-gray-600">
                <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CarouselArrows({ movies }) {
  const containerRef = useRef(null);
  // Use an effect to grab the sibling container for scrolling
  useEffect(() => {
    // parent is the header row; nextElementSibling is the CarouselRow wrapper
    const parent = refParent.current;
    if (!parent) return;
  }, []);

  const refParent = useRef(null);

  const scrollByAmount = (dir) => {
    const rowWrapper = refParent.current?.nextElementSibling; // CarouselRow wrapper
    const scroller = rowWrapper?.querySelector('[class*="overflow-x-auto"]');
    if (!scroller) return;
    const amount = scroller.clientWidth;
    scroller.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div ref={refParent} className="hidden md:flex gap-2">
      <button onClick={() => scrollByAmount(-1)} className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow">◀</button>
      <button onClick={() => scrollByAmount(1)} className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow">▶</button>
    </div>
  );
}

