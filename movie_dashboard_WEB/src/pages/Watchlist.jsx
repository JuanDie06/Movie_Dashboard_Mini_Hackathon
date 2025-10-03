import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

      {/* Watchlist Items */}
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
        <div className="space-y-4">
          {watchlists.map((item) => (
            <div
              key={item.id}
              className="item"
            >
              <Link to={`/movies/${item.movie.id}`}>
                {item.movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${item.movie.poster_path}`}
                    alt={item.movie.title}
                    className="w-24 rounded"
                  />
                ) : (
                  <div className="w-24 h-36 bg-gradient-to-br from-slate-800 to-slate-700 rounded flex items-center justify-center">
                    <span className="text-[var(--color-text-muted)] text-xs">No Image</span>
                  </div>
                )}
              </Link>
              
              <div className="flex-1">
                <Link to={`/movies/${item.movie.id}`} className="item__title">
                  {item.movie.title}
                </Link>
                <div className="item__meta">
                  {item.movie.release_date?.split('-')[0]} · {parseFloat(item.movie.vote_average).toFixed(1)}/10
                </div>
                <div className="flex gap-2 flex-wrap mb-2">
                  {item.movie.genres?.map((genre) => (
                    <span key={genre.id} className="item__genre">
                      {genre.name}
                    </span>
                  ))}
                </div>
                {item.notes && (
                  <p className="text-sm text-[var(--color-text-muted)] italic">"{item.notes}"</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <select
                  value={item.status}
                  onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                  className="item__actions"
                >
                  <option value="want_to_watch">Want to Watch</option>
                  <option value="watching">Watching</option>
                  <option value="watched">Watched</option>
                </select>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="btn-danger text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Watchlist;

