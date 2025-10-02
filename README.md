# Movie Dashboard - Mini Hackathon Project

A full-stack web application built in 24 hours featuring a Ruby on Rails REST API backend, React frontend, and PostgreSQL database with TMDB API integration.

## 🚀 Tech Stack

**Backend:**
- Ruby on Rails 8.0.3 (API-only mode)
- PostgreSQL 15
- TMDB API integration (external REST API)

**Frontend:**
- React 18 + Vite
- React Router
- Axios
- Tailwind CSS

**Infrastructure:**
- Docker Compose (PostgreSQL)
- Foreman (process management)

## 📊 Database Entities (5 Core Models)

1. **Movies** - Movie data from TMDB
2. **Genres** - Movie categories  
3. **MovieGenres** - Many-to-many join table
4. **Reviews** - User reviews for movies
5. **Watchlists** - Personal watchlist management

## 🎯 Features

- ✅ Full CRUD operations for all 5 entities
- ✅ TMDB API integration (fetch movies, genres, search)
- ✅ PostgreSQL database with relational schema
- ✅ RESTful API with JSON responses
- ✅ React SPA with routing
- ✅ Responsive UI with Tailwind CSS

## 🏗️ Project Structure

```
.
├── docker-compose.yml          # PostgreSQL container
├── Procfile                    # Process manager config
├── movie_dashboard_API/        # Rails backend
└── movie_dashboard_WEB/        # React frontend
```

## 🚦 Quick Start

### Prerequisites
- Ruby 3.3.5
- Node.js 22.13.0
- Docker & Docker Compose
- PostgreSQL client

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd "Mini Hackathon Oct 2025"
```

2. **Start PostgreSQL**
```bash
docker-compose up -d
```

3. **Setup Backend**
```bash
cd movie_dashboard_API
bundle install
rails db:create db:migrate db:seed
```

4. **Setup Frontend**
```bash
cd movie_dashboard_WEB
npm install
```

5. **Configure Environment Variables**

Backend (`movie_dashboard_API/.env`):
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/movie_dashboard_development
TMDB_API_KEY=ebff3040c7c0e3c70b26a29fa2dd78c4
TMDB_BASE_URL=https://api.themoviedb.org/3
FRONTEND_URL=http://localhost:5173
```

Frontend (`movie_dashboard_WEB/.env`):
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### Running the Application

**Option 1: Manual (two terminals)**
```bash
# Terminal 1 - Backend
cd movie_dashboard_API
rails s

# Terminal 2 - Frontend  
cd movie_dashboard_WEB
npm run dev
```

**Option 2: Using Foreman**
```bash
foreman start
```

### Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432

## 📚 API Endpoints

Base URL: `http://localhost:3000/api/v1`

### Movies
- `GET /movies` - List all movies (paginated)
- `GET /movies/:id` - Get movie details
- `POST /movies` - Create movie
- `PUT /movies/:id` - Update movie
- `DELETE /movies/:id` - Delete movie
- `GET /movies/search?q=query` - Search movies

### Genres
- `GET /genres` - List all genres
- `GET /genres/:id` - Get genre details
- `GET /genres/:id/movies` - Movies by genre

### Reviews
- `GET /reviews` - List all reviews
- `GET /movies/:movie_id/reviews` - Reviews for a movie
- `POST /reviews` - Create review
- `PUT /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

### Watchlists
- `GET /watchlists` - List watchlist items
- `POST /watchlists` - Add to watchlist
- `PUT /watchlists/:id` - Update watchlist item
- `DELETE /watchlists/:id` - Remove from watchlist

## 🧪 Testing

**Backend:**
```bash
cd movie_dashboard_API
rails console

# Test queries
Movie.count
Genre.all
Movie.first.genres
Review.highest_rated
```

**Database:**
```bash
# Check migrations
rails db:migrate:status

# Reset database
rails db:reset

# Re-seed data
rails db:seed
```

## 📦 Database Seed Data

The seed file automatically populates:
- 19 genres from TMDB
- 40 popular movies from TMDB
- ~100+ movie-genre associations
- 20 sample reviews
- 15 sample watchlist items

## 🛠️ Development Commands

```bash
# Database
docker-compose up -d              # Start PostgreSQL
docker-compose down               # Stop PostgreSQL
docker ps                         # Check container status

# Backend
rails s                           # Start server
rails console                     # Open Rails console
rails db:migrate                  # Run migrations
rails db:seed                     # Seed database
rails routes                      # View all routes

# Frontend
npm run dev                       # Start dev server
npm run build                     # Build for production
```

## 🎯 Hackathon Requirements

- ✅ Ruby on Rails backend
- ✅ React frontend with 3+ screens
- ✅ Docker Compose for database
- ✅ 5+ database entities
- ✅ External REST API (TMDB)
- ✅ Full CRUD operations

## 📖 Documentation

- `documentation/SETUP-COMPLETE.md` - Phase 1 setup guide
- `documentation/PHASE2-COMPLETE.md` - Backend models & migrations
- `documentation/TESTING-GUIDE.md` - Testing instructions
- `lower-priority-features.md` - Future enhancements

## 🚧 Current Status

**Completed:**
- ✅ Phase 1: Foundation (Docker, Rails, React setup)
- ✅ Phase 2: Backend Core (Models, TMDB service, seed data)

**In Progress:**
- 🔄 Phase 3: REST API Controllers

**Upcoming:**
- ⏳ Phase 4: Frontend Foundation
- ⏳ Phase 5: Frontend Features
- ⏳ Phase 6: Integration & Polish

## 👥 Team

Built for Mini Hackathon October 2025

## 📝 License

MIT License - Built for educational purposes

