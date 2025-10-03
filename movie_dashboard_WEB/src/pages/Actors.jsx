import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { actorsAPI } from '../services/api';
import { Search, User, Calendar, MapPin } from 'lucide-react';

export default function Actors() {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort_by') || 'popularity';
  const currentPage = parseInt(searchParams.get('page') || '1');
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchActors();
  }, [searchQuery, sortBy, currentPage]);

  const fetchActors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        per_page: 20,
        sort_by: sortBy
      };
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const response = await actorsAPI.getAll(params);
      setActors(response.data.actors || []);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching actors:', err);
      setError('Failed to load actors. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData.get('search');
    
    const newParams = { page: '1' };
    if (search) newParams.search = search;
    if (sortBy !== 'popularity') newParams.sort_by = sortBy;
    
    setSearchParams(newParams);
  };

  const handleSortChange = (newSortBy) => {
    const newParams = { sort_by: newSortBy, page: '1' };
    if (searchQuery) newParams.search = searchQuery;
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = { page: newPage.toString() };
    if (searchQuery) newParams.search = searchQuery;
    if (sortBy !== 'popularity') newParams.sort_by = sortBy;
    setSearchParams(newParams);
  };

  const calculateAge = (birthday) => {
    if (!birthday) return null;
    const birth = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="container-app min-h-[60vh] grid place-items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--color-primary)]"></div>
          <div className="text-lg text-[var(--color-text-muted)]">Loading actors...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-app min-h-[60vh] grid place-items-center">
        <div className="text-center">
          <div className="text-rose-400 text-xl mb-4">{error}</div>
          <button onClick={fetchActors} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="heading-section mb-2">Browse Actors</h1>
        <p className="text-[var(--color-text-muted)]">
          Discover talented actors and explore their filmographies
        </p>
      </div>

      {/* Search & Sort */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={20} />
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Search actors by name..."
              className="input pl-10 w-full"
            />
          </div>
          <button type="submit" className="btn-primary">
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

        {/* Sort Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleSortChange('popularity')}
            className={sortBy === 'popularity' ? 'btn-primary' : 'btn-ghost'}
          >
            Popular
          </button>
          <button
            onClick={() => handleSortChange('name')}
            className={sortBy === 'name' ? 'btn-primary' : 'btn-ghost'}
          >
            A-Z
          </button>
        </div>
      </div>

      {/* Results Info */}
      {pagination && (
        <div className="mb-4 text-sm text-[var(--color-text-muted)]">
          Showing {actors.length} of {pagination.total_count} actors
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      )}

      {/* Actors Grid */}
      {actors.length === 0 ? (
        <div className="text-center py-12">
          <User className="mx-auto mb-4 text-[var(--color-text-muted)]" size={64} />
          <p className="text-xl text-[var(--color-text-muted)] mb-4">
            No actors found
          </p>
          {searchQuery && (
            <p className="text-[var(--color-text-muted)]">
              Try a different search term or{' '}
              <button
                onClick={() => setSearchParams({})}
                className="text-[var(--color-primary)] hover:underline"
              >
                browse all actors
              </button>
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
            {actors.map((actor) => (
              <Link
                key={actor.id}
                to={`/actors/${actor.id}`}
                className="card overflow-hidden hover:shadow-xl transition group"
              >
                {/* Actor Image */}
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-700">
                  {actor.profile_path || actor.thumbnail_url ? (
                    <img
                      src={actor.thumbnail_url || `https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center">
                      <User size={48} className="text-[var(--color-text-muted)]" />
                    </div>
                  )}
                  
                  {/* Popularity Badge */}
                  {actor.popularity && (
                    <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      ⭐ {parseFloat(actor.popularity).toFixed(1)}
                    </div>
                  )}
                </div>

                {/* Actor Info */}
                <div className="p-4">
                  <h3 className="font-bold text-base text-[var(--color-text)] mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
                    {actor.name}
                  </h3>
                  
                  <div className="text-xs text-[var(--color-text-muted)] space-y-1">
                    {actor.known_for_department && (
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        <span>{actor.known_for_department}</span>
                      </div>
                    )}
                    
                    {actor.birthday && (
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>
                          {actor['alive?'] !== false ? `Age ${calculateAge(actor.birthday)}` : '†'}
                        </span>
                      </div>
                    )}
                    
                    {actor.place_of_birth && (
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span className="truncate">{actor.place_of_birth}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.total_pages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="text-[var(--color-text)]">
                Page {pagination.current_page} of {pagination.total_pages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.total_pages}
                className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

