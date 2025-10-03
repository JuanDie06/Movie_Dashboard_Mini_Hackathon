import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Film, Home, Grid3x3, Bookmark, Calendar, Search, Users } from 'lucide-react';

function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/movies?search=${encodeURIComponent(q)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="hdr">
      <div className="hdr__wrap">
        <div className="hdr__row">
          {/* Brand */}
          <NavLink to="/" className="hdr__brand" aria-label="Movie Dashboard">
            <Film size={32} className="hdr__brandIcon" />
            <span className="hdr__brandText">CineHub</span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hdr__nav--desktop">
            <NavLink 
              to="/" 
              className={({isActive}) => `hdr__link ${isActive ? 'hdr__link--active' : ''}`}
            >
              <Home size={18} />
              <span>Home</span>
            </NavLink>
            <NavLink 
              to="/movies" 
              className={({isActive}) => `hdr__link ${isActive ? 'hdr__link--active' : ''}`}
            >
              <Grid3x3 size={18} />
              <span>Browse</span>
            </NavLink>
            <NavLink 
              to="/watchlist" 
              className={({isActive}) => `hdr__link ${isActive ? 'hdr__link--active' : ''}`}
            >
              <Bookmark size={18} />
              <span>Watchlist</span>
            </NavLink>
            <NavLink 
              to="/actors" 
              className={({isActive}) => `hdr__link ${isActive ? 'hdr__link--active' : ''}`}
            >
              <Users size={18} />
              <span>Actors</span>
            </NavLink>
            <NavLink 
              to="/sites" 
              className={({isActive}) => `hdr__link ${isActive ? 'hdr__link--active' : ''}`}
            >
              <Calendar size={18} />
              <span>Sites</span>
            </NavLink>
          </nav>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hdr__search--desktop">
            <div className="hdr__searchBox">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="hdr__searchInput"
                aria-label="Search movies"
              />
              <Search size={18} className="hdr__searchIcon" />
            </div>
            <button type="submit" className="hdr__searchBtn">Search</button>
          </form>
        </div>

        {/* Mobile Nav */}
        <nav className="hdr__nav--mobile">
          <NavLink 
            to="/" 
            className={({isActive}) => `hdr__link--mobile ${isActive ? 'hdr__link--mobileActive' : ''}`}
          >
            <Home size={20} />
            <span>Home</span>
          </NavLink>
          <NavLink 
            to="/movies" 
            className={({isActive}) => `hdr__link--mobile ${isActive ? 'hdr__link--mobileActive' : ''}`}
          >
            <Grid3x3 size={20} />
            <span>Browse</span>
          </NavLink>
          <NavLink 
            to="/watchlist" 
            className={({isActive}) => `hdr__link--mobile ${isActive ? 'hdr__link--mobileActive' : ''}`}
          >
            <Bookmark size={20} />
            <span>Watchlist</span>
          </NavLink>
          <NavLink 
            to="/actors" 
            className={({isActive}) => `hdr__link--mobile ${isActive ? 'hdr__link--mobileActive' : ''}`}
          >
            <Users size={20} />
            <span>Actors</span>
          </NavLink>
          <NavLink 
            to="/sites" 
            className={({isActive}) => `hdr__link--mobile ${isActive ? 'hdr__link--mobileActive' : ''}`}
          >
            <Calendar size={20} />
            <span>Sites</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;


