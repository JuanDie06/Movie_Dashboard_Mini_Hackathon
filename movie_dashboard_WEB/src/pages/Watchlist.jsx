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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">My Watchlist</h1>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-gray-600">Total Movies</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-green-600">{stats.want_to_watch}</div>
            <div className="text-gray-600">Want to Watch</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-yellow-600">{stats.watching}</div>
            <div className="text-gray-600">Watching</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-3xl font-bold text-gray-600">{stats.watched}</div>
            <div className="text-gray-600">Watched</div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveFilter('')}
          className={`px-6 py-2 rounded-lg transition ${
            activeFilter === ''
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('want_to_watch')}
          className={`px-6 py-2 rounded-lg transition ${
            activeFilter === 'want_to_watch'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Want to Watch
        </button>
        <button
          onClick={() => setActiveFilter('watching')}
          className={`px-6 py-2 rounded-lg transition ${
            activeFilter === 'watching'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Watching
        </button>
        <button
          onClick={() => setActiveFilter('watched')}
          className={`px-6 py-2 rounded-lg transition ${
            activeFilter === 'watched'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Watched
        </button>
      </div>

      {/* Watchlist Items */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : watchlists.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl mb-4">Your watchlist is empty</p>
          <Link to="/movies" className="text-blue-600 hover:underline">
            Browse movies to add
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {watchlists.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md p-4 flex gap-4 items-start"
            >
              <Link to={`/movies/${item.movie.id}`}>
                {item.movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${item.movie.poster_path}`}
                    alt={item.movie.title}
                    className="w-24 rounded"
                  />
                ) : (
                  <div className="w-24 h-36 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
              </Link>
              
              <div className="flex-1">
                <Link to={`/movies/${item.movie.id}`}>
                  <h3 className="font-bold text-lg hover:text-blue-600">{item.movie.title}</h3>
                </Link>
                <div className="text-sm text-gray-600 mb-2">
                  {item.movie.release_date?.split('-')[0]} · {parseFloat(item.movie.vote_average).toFixed(1)}/10
                </div>
                <div className="flex gap-2 flex-wrap mb-2">
                  {item.movie.genres?.map((genre) => (
                    <span key={genre.id} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {genre.name}
                    </span>
                  ))}
                </div>
                {item.notes && (
                  <p className="text-sm text-gray-600 italic">"{item.notes}"</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <select
                  value={item.status}
                  onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                  className="px-3 py-2 border rounded text-sm"
                >
                  <option value="want_to_watch">Want to Watch</option>
                  <option value="watching">Watching</option>
                  <option value="watched">Watched</option>
                </select>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
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

