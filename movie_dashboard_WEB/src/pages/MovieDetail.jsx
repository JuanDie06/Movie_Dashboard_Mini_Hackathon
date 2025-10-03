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
      toast.success(`Added to ${statusName} list!`);
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
      toast.success('Review submitted successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.errors?.join(', ') || 'Failed to submit review';
      toast.error(errorMsg);
    }
  };

  if (loading) {
    return (
      <div className="container-app min-h-[60vh] grid place-items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--color-primary)]"></div>
          <div className="text-lg text-[var(--color-text)]">Loading movie details...</div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container-app min-h-[60vh] grid place-items-center">
        <div className="text-center">
          <div className="text-2xl mb-4 text-[var(--color-text)]">Movie not found</div>
          <Link to="/movies" className="text-[var(--color-primary)] hover:underline">
            Browse all movies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="detail-hero"
        style={{
          backgroundImage: movie.backdrop_path 
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : 'none'
        }}
      >
        <div className="detail-hero__overlay"></div>
        <div className="detail-hero__inner">
          <div className="flex gap-6 items-end">
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-48 rounded-xl shadow-2xl"
              />
            )}
            <div className="pb-4">
              <h1 className="detail__title">{movie.title}</h1>
              <div className="detail__meta">
                <span>{movie.release_date?.split('-')[0]}</span>
                <span>{parseFloat(movie.vote_average).toFixed(1)}/10</span>
                {movie.runtime && <span>{movie.runtime} min</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="detail__section">
        {/* Genres */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 text-[var(--color-text-muted)]">Genres</h3>
          <div className="flex gap-2 flex-wrap">
            {movie.genres?.map((genre) => (
              <Link
                key={genre.id}
                to={`/movies?genre=${genre.id}`}
                className="genre-link"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Watchlist Actions */}
        <div className="detail__panel">
          <h3 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Add to Watchlist</h3>
          <div className="actions-grid">
            <button
              onClick={() => handleAddToWatchlist('want_to_watch')}
              className="btn-primary"
            >
              Want to Watch
            </button>
            <button
              onClick={() => handleAddToWatchlist('watching')}
              className="btn-secondary"
            >
              Watching
            </button>
            <button
              onClick={() => handleAddToWatchlist('watched')}
              className="btn-ghost"
            >
              Watched
            </button>
          </div>
        </div>

        {/* Overview */}
        {movie.overview && (
          <div className="detail__panel">
            <h2 className="heading-section mb-3">Overview</h2>
            <p className="text-[var(--color-text-muted)] leading-relaxed">{movie.overview}</p>
          </div>
        )}

        {/* Reviews Section */}
        <div className="detail__panel">
          <div className="flex justify-between items-center mb-4">
            <h2 className="heading-section">Reviews ({movie.reviews?.length || 0})</h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn-primary"
            >
              {showReviewForm ? 'Cancel' : 'Write Review'}
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-white/5 border border-[var(--color-border)] rounded-[var(--radius-xl)]">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-[var(--color-text)]">Rating (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({...reviewForm, rating: parseInt(e.target.value)})}
                  className="input"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-[var(--color-text)]">Your Name</label>
                <input
                  type="text"
                  value={reviewForm.author_name}
                  onChange={(e) => setReviewForm({...reviewForm, author_name: e.target.value})}
                  className="input"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-[var(--color-text)]">Review (min 10 characters)</label>
                <textarea
                  value={reviewForm.content}
                  onChange={(e) => setReviewForm({...reviewForm, content: e.target.value})}
                  className="input h-32"
                  required
                  minLength={10}
                />
              </div>
              <button
                type="submit"
                className="btn-primary"
              >
                Submit Review
              </button>
            </form>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {movie.reviews?.length === 0 ? (
              <p className="text-[var(--color-text-muted)] text-center py-8">No reviews yet. Be the first to review!</p>
            ) : (
              movie.reviews?.map((review) => (
                <div key={review.id} className="border-b border-[var(--color-border)] pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-[var(--color-text)]">{review.author_name}</h4>
                      <div className="text-sm text-[var(--color-text-muted)]">
                        {new Date(review.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-yellow-400 font-bold">{review.rating}/10</div>
                  </div>
                  <p className="text-[var(--color-text-muted)]">{review.content}</p>
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

