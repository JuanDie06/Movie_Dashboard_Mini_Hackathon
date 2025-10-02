import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { moviesAPI, reviewsAPI, watchlistsAPI } from '../services/api';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, content: '', author_name: '' });

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      setLoading(true);
      const response = await moviesAPI.getById(id);
      setMovie(response.data);
    } catch (err) {
      console.error('Error fetching movie:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatchlist = async (status) => {
    const statusName = status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    try {
      await watchlistsAPI.create({
        movie_id: parseInt(id),
        status,
        notes: `Added to ${statusName}`
      });
      toast.success(`✅ Added to ${statusName} list!`);
    } catch (err) {
      if (err.response?.data?.errors) {
        toast.error(err.response.data.errors.join(', '));
      } else {
        toast.error('Failed to add to watchlist');
      }
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await reviewsAPI.create({
        movie_id: parseInt(id),
        review: reviewForm
      });
      setShowReviewForm(false);
      setReviewForm({ rating: 5, content: '', author_name: '' });
      fetchMovieDetails(); // Refresh to show new review
      toast.success('⭐ Review submitted successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.join(', ') || 'Failed to submit review';
      toast.error(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          <div className="text-xl text-gray-600">Loading movie details...</div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-2xl mb-4">🎬 Movie not found</div>
          <Link to="/movies" className="text-blue-600 hover:underline">
            Browse all movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage: movie.backdrop_path 
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : 'none'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="container mx-auto px-4 h-full flex items-end pb-8 relative z-10">
          <div className="flex gap-6 items-end">
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-48 rounded-lg shadow-2xl"
              />
            )}
            <div className="text-white pb-4">
              <h1 className="text-5xl font-bold mb-2">{movie.title}</h1>
              <div className="flex gap-4 text-lg">
                <span>{movie.release_date?.split('-')[0]}</span>
                <span>⭐ {parseFloat(movie.vote_average).toFixed(1)}/10</span>
                {movie.runtime && <span>{movie.runtime} min</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Genres */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Genres</h3>
          <div className="flex gap-2 flex-wrap">
            {movie.genres?.map((genre) => (
              <Link
                key={genre.id}
                to={`/movies?genre=${genre.id}`}
                className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Watchlist Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold mb-4">📝 Add to Watchlist</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleAddToWatchlist('want_to_watch')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md hover:shadow-lg"
            >
              <span>📌</span>
              <span>Want to Watch</span>
            </button>
            <button
              onClick={() => handleAddToWatchlist('watching')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition shadow-md hover:shadow-lg"
            >
              <span>▶️</span>
              <span>Watching</span>
            </button>
            <button
              onClick={() => handleAddToWatchlist('watched')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition shadow-md hover:shadow-lg"
            >
              <span>✅</span>
              <span>Watched</span>
            </button>
          </div>
        </div>

        {/* Overview */}
        {movie.overview && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-gray-700 leading-relaxed">{movie.overview}</p>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Reviews ({movie.reviews?.length || 0})</h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {showReviewForm ? 'Cancel' : 'Write Review'}
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Rating (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  value={reviewForm.author_name}
                  onChange={(e) => setReviewForm({...reviewForm, author_name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Review (min 10 characters)</label>
                <textarea
                  value={reviewForm.content}
                  onChange={(e) => setReviewForm({...reviewForm, content: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg h-32"
                  required
                  minLength={10}
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Submit Review
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {movie.reviews?.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
            ) : (
              movie.reviews?.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold">{review.author_name}</h4>
                      <div className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-yellow-500 font-bold">⭐ {review.rating}/10</div>
                  </div>
                  <p className="text-gray-700">{review.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;

