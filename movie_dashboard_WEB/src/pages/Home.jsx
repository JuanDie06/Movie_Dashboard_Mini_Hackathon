import { useState, useEffect, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
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

  // Build slides of 3 (non-loop first)
  const slides = useMemo(() => {
    const list = (movies || []).slice(0, 12);
    const chunks = [];
    for (let i = 0; i < list.length; i += 3) chunks.push(list.slice(i, i + 3));
    return chunks;
  }, [movies]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    duration: 20, // ~400ms
  });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();
  const scrollTo = (i) => emblaApi && emblaApi.scrollTo(i);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-8 text-white shadow-lg">
        <h1 className="text-5xl font-bold mb-4">Discover Amazing Movies</h1>
        <p className="text-xl opacity-90">Browse through trending and popular movies from around the world</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold">Popular Right Now</h2>
        {slides.length > 1 && (
          <div className="hidden md:flex gap-2">
            <button onClick={scrollPrev} className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow">◀</button>
            <button onClick={scrollNext} className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition shadow">▶</button>
          </div>
        )}
      </div>

      {/* Embla viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, idx) => (
            <div key={idx} className="w-full shrink-0 px-1 md:px-2">
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {slide.map((movie) => (
                  <Link key={movie.id} to={`/movies/${movie.id}`} className="bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                    <div className="relative overflow-hidden">
                      {movie.poster_path ? (
                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-72 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                          <span className="text-gray-400 text-sm">No Image</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded-lg text-xs">
                        {Number(movie.vote_average ?? 0).toFixed(1)} / 10
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-base md:text-lg mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">{movie.title}</h3>
                      <div className="text-sm text-gray-600">{movie.release_date?.split('-')[0] || 'N/A'}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {slides.map((_, i) => (
            <button key={i} onClick={() => scrollTo(i)} className="h-2.5 w-2.5 rounded-full bg-gray-300 hover:bg-gray-400" />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;

