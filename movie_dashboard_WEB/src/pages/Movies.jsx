import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Browse Movies</h1>
      
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            name="search"
            defaultValue={searchQuery}
            placeholder="Search movies..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {/* Genre Filter */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Filter by Genre:</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleGenreFilter('')}
            className={`px-4 py-2 rounded-full transition ${
              !selectedGenre
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreFilter(genre.id)}
              className={`px-4 py-2 rounded-full transition ${
                selectedGenre === String(genre.id)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {genre.name} ({genre.movies_count})
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : movies.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No movies found. Try a different search or filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-80 object-cover"
                />
              ) : (
                <div className="w-full h-80 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              <div className="p-4">
                <h3 className="font-bold text-sm mb-2 line-clamp-2">{movie.title}</h3>
                <div className="flex justify-between items-center text-xs text-gray-600">
                  <span>{movie.release_date?.split('-')[0]}</span>
                  <span className="flex items-center">
                    ⭐ {parseFloat(movie.vote_average).toFixed(1)}
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

export default Movies;

