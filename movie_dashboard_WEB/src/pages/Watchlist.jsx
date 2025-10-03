import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { watchlistsAPI } from '../services/api';

function Watchlist() {
  const [watchlists, setWatchlists] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeFilter, setActiveFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchlist();
    fetchStats();
  }, [activeFilter]);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = activeFilter
        ? await watchlistsAPI.getByStatus(activeFilter)
        : await watchlistsAPI.getAll();
      setWatchlists(response.data.watchlists || []);
    } catch (err) {
      console.error('Error fetching watchlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await watchlistsAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const statusName = newStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    try {
      await watchlistsAPI.update(id, { status: newStatus });
      fetchWatchlist();
      fetchStats();
      toast.success(`Moved to ${statusName}!`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleRemove = async (id) => {
    if (confirm('Remove from watchlist?')) {
      try {
        await watchlistsAPI.delete(id);
        fetchWatchlist();
        fetchStats();
        toast.success('Removed from watchlist');
      } catch (err) {
        toast.error('Failed to remove from watchlist');
      }
    }
  };

  return (
    <div className="container-app py-8">
      <h1 className="watchlist__title">My Watchlist</h1>

      {/* Stats */}
      {stats && (
        <div className="stats">
          <div className="stat-card">
            <div className="stat-card__value">{stats.total}</div>
            <div className="text-[var(--color-text-muted)]">Total Movies</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">{stats.want_to_watch}</div>
            <div className="text-[var(--color-text-muted)]">Want to Watch</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">{stats.watching}</div>
            <div className="text-[var(--color-text-muted)]">Watching</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">{stats.watched}</div>
            <div className="text-[var(--color-text-muted)]">Watched</div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="tabs">
        <button
          onClick={() => setActiveFilter('')}
          className={`tab ${activeFilter === '' ? 'tab--active' : ''}`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('want_to_watch')}
          className={`tab ${activeFilter === 'want_to_watch' ? 'tab--active' : ''}`}
        >
          Want to Watch
        </button>
        <button
          onClick={() => setActiveFilter('watching')}
          className={`tab ${activeFilter === 'watching' ? 'tab--active' : ''}`}
        >
          Watching
        </button>
        <button
          onClick={() => setActiveFilter('watched')}
          className={`tab ${activeFilter === 'watched' ? 'tab--active' : ''}`}
        >
          Watched
        </button>
      </div>

      {/* Watchlist Items - Carousel */}
      {loading ? (
        <div className="text-center py-12 text-[var(--color-text-muted)]">Loading...</div>
      ) : watchlists.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-text-muted)]">
          <p className="text-xl mb-4">Your watchlist is empty</p>
          <Link to="/movies" className="text-[var(--color-primary)] hover:underline">
            Browse movies to add
          </Link>
        </div>
      ) : (
        <WatchlistCarousel 
          watchlists={watchlists} 
          onUpdateStatus={handleUpdateStatus}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
}

// Watchlist Carousel Component
function WatchlistCarousel({ watchlists, onUpdateStatus, onRemove }) {
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
          {watchlists.map((item) => (
            <div
              key={item.id}
              className="carousel__item"
            >
              <Link
                to={`/movies/${item.movie.id}`}
                className="movie-card"
              >
                <div className="relative overflow-hidden">
                  {item.movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.movie.poster_path}`}
                      alt={item.movie.title}
                      className="w-full h-80 object-cover"
                    />
                  ) : (
                    <div className="w-full h-80 bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
                      <span className="text-[var(--color-text-muted)] text-sm">No Image</span>
                    </div>
                  )}
                  <div className="rating-chip">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span>{parseFloat(item.movie.vote_average).toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="movie-card__title text-[var(--color-text)]">
                    {item.movie.title}
                  </h3>
                  <div className="movie-card__meta mb-3">
                    <span>{item.movie.release_date?.split('-')[0] || 'N/A'}</span>
                    <span>{parseFloat(item.movie.vote_average).toFixed(1)}/10</span>
                  </div>
                  
                  {/* Genre Tags */}
                  <div className="flex gap-1 flex-wrap mb-3">
                    {item.movie.genres?.slice(0, 2).map((genre) => (
                      <span key={genre.id} className="text-xs px-2 py-1 bg-white/10 rounded text-[var(--color-text-muted)]">
                        {genre.name}
                      </span>
                    ))}
                  </div>

                  {/* Notes */}
                  {item.notes && (
                    <p className="text-xs text-[var(--color-text-muted)] italic mb-3 line-clamp-2">
                      "{item.notes}"
                    </p>
                  )}
                </div>
              </Link>

              {/* Action Buttons - Outside the Link */}
              <div className="px-4 pb-4 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                <select
                  value={item.status}
                  onChange={(e) => {
                    e.preventDefault();
                    onUpdateStatus(item.id, e.target.value);
                  }}
                  className="w-full px-3 py-2 text-sm bg-white/8 border border-[var(--color-border)] rounded-lg text-[var(--color-text)] cursor-pointer hover:bg-white/12 transition"
                >
                  <option value="want_to_watch">Want to Watch</option>
                  <option value="watching">Watching</option>
                  <option value="watched">Watched</option>
                </select>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onRemove(item.id);
                  }}
                  className="w-full px-3 py-2 text-sm bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition flex items-center justify-center gap-2"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Overlay Arrow Buttons */}
      {watchlists && watchlists.length > 3 && (
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

export default Watchlist;

