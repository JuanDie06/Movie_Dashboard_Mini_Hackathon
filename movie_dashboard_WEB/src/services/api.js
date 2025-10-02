import axios from 'axios';

// Base URL from environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging (optional)
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ===== MOVIES API =====
export const moviesAPI = {
  // Get all movies with optional filters
  getAll: (params = {}) => api.get('/movies', { params }),
  
  // Get single movie by ID
  getById: (id) => api.get(`/movies/${id}`),
  
  // Search movies
  search: (query, params = {}) => api.get('/movies', { params: { search: query, ...params } }),
  
  // Filter by genre
  getByGenre: (genreId, params = {}) => api.get('/movies', { params: { genre_id: genreId, ...params } }),
  
  // Get popular movies
  getPopular: (params = {}) => api.get('/movies/popular', { params }),
  
  // Get recent movies
  getRecent: (params = {}) => api.get('/movies/recent', { params }),
  
  // Create movie
  create: (movieData) => api.post('/movies', { movie: movieData }),
  
  // Update movie
  update: (id, movieData) => api.put(`/movies/${id}`, { movie: movieData }),
  
  // Delete movie
  delete: (id) => api.delete(`/movies/${id}`),
  
  // Sync from TMDB
  syncFromTMDB: (tmdbId) => api.post('/movies/sync_from_tmdb', { tmdb_id: tmdbId }),
};

// ===== GENRES API =====
export const genresAPI = {
  // Get all genres
  getAll: () => api.get('/genres'),
  
  // Get single genre
  getById: (id) => api.get(`/genres/${id}`),
  
  // Get movies by genre
  getMovies: (id, params = {}) => api.get(`/genres/${id}/movies`, { params }),
  
  // Create genre
  create: (genreData) => api.post('/genres', { genre: genreData }),
  
  // Update genre
  update: (id, genreData) => api.put(`/genres/${id}`, { genre: genreData }),
  
  // Delete genre
  delete: (id) => api.delete(`/genres/${id}`),
};

// ===== REVIEWS API =====
export const reviewsAPI = {
  // Get all reviews
  getAll: (params = {}) => api.get('/reviews', { params }),
  
  // Get reviews for specific movie
  getByMovie: (movieId, params = {}) => api.get('/reviews', { params: { movie_id: movieId, ...params } }),
  
  // Get highest rated reviews
  getHighestRated: (params = {}) => api.get('/reviews/highest_rated', { params }),
  
  // Get single review
  getById: (id) => api.get(`/reviews/${id}`),
  
  // Create review
  create: (reviewData) => api.post('/reviews', reviewData),
  
  // Update review
  update: (id, reviewData) => api.put(`/reviews/${id}`, { review: reviewData }),
  
  // Delete review
  delete: (id) => api.delete(`/reviews/${id}`),
};

// ===== WATCHLISTS API =====
export const watchlistsAPI = {
  // Get all watchlist items
  getAll: (params = {}) => api.get('/watchlists', { params }),
  
  // Filter by status
  getByStatus: (status, params = {}) => api.get('/watchlists', { params: { status, ...params } }),
  
  // Get watchlist stats
  getStats: () => api.get('/watchlists/stats'),
  
  // Get single watchlist item
  getById: (id) => api.get(`/watchlists/${id}`),
  
  // Add to watchlist
  create: (watchlistData) => api.post('/watchlists', { watchlist: watchlistData }),
  
  // Update watchlist item
  update: (id, watchlistData) => api.put(`/watchlists/${id}`, { watchlist: watchlistData }),
  
  // Remove from watchlist
  delete: (id) => api.delete(`/watchlists/${id}`),
};

export default api;

