import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold hover:text-blue-100 transition">
            🎬 Movie Dashboard
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-blue-100 transition font-medium">
              Home
            </Link>
            <Link to="/movies" className="hover:text-blue-100 transition font-medium">
              Browse
            </Link>
            <Link to="/watchlist" className="hover:text-blue-100 transition font-medium">
              My Watchlist
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-800 transition"
            >
              Search
            </button>
          </form>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex gap-4 pb-4">
          <Link to="/" className="hover:text-blue-100 transition text-sm">
            Home
          </Link>
          <Link to="/movies" className="hover:text-blue-100 transition text-sm">
            Browse
          </Link>
          <Link to="/watchlist" className="hover:text-blue-100 transition text-sm">
            Watchlist
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;

