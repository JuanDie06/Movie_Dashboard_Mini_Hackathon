import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/layout/Header';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import Watchlist from './pages/Watchlist';

function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{ background: 'var(--color-bg-app)', color: 'var(--color-text)' }}>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: 'white',
              },
            },
          }}
        />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="*" element={
            <div className="container-app py-16 text-center">
              <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>404 - Page Not Found</h1>
              <p className="text-lg mb-8" style={{ color: 'var(--color-text-muted)' }}>The page you're looking for doesn't exist.</p>
              <a href="/" className="btn-primary">
                Go Home
              </a>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
