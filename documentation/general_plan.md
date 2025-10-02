# Project Overview

A full-stack movie dashboard application that integrates with TMDB API, featuring a Ruby on Rails REST API backend, React frontend, and PostgreSQL database.

#  Architecture Overview
## Technology Stack

Backend: Ruby on Rails 7.x (API-only mode)
Frontend: Vite + React 18 + React Router
Database: PostgreSQL 15
External API: TMDB (The Movie Database)
Containerization: Docker + docker-compose
Process Manager: Foreman

# Database Schema Design (5+ Entities)

## Core Entities:
1. Movies
    * id (PK)
    * tmdb_id (integer, unique, indexed)
    * title (string)
    * overview (text)
    * release_date (date)
    * poster_path (string)
    * backdrop_path (string)
    * vote_average (decimal)
    * vote_count (integer)
    * runtime (integer)
    * status (string)
    * created_at, updated_at

## Genres
    * id (PK)
    * tmdb_id (integer, unique)
    * name (string)
    * created_at, updated_at

## MovieGenres (Join Table)
    * id (PK)
    * movie_id (FK)
    * genre_id (FK)
    * created_at, updated_at

## Reviews
    * id (PK)
    * movie_id (FK)
    * user_id (FK) - nullable for now, required with auth
    * rating (integer, 1-10)
    * content (text)
    * author_name (string)
    * created_at, updated_at

## Watchlists
    * id (PK)
    * user_id (FK) - nullable for now
    * movie_id (FK)
    * status (enum: 'want_to_watch', 'watching', 'watched')
    * notes (text)
    * created_at, updated_at

## Actors (Bonus entity for richer data)
    * id (PK)
    * tmdb_id (integer, unique)
    * name (string)
    * profile_path (string)
    * biography (text)
    * created_at, updated_at

## MovieActors (Join Table)
    * id (PK)
    * movie_id (FK)
    * actor_id (FK)
    * character_name (string)
    * order (integer)
    * created_at, updated_at

## Relationships:
* Movies ↔ Genres (many-to-many)
* Movies ↔ Actors (many-to-many)
* Movies → Reviews (one-to-many)
* Movies → Watchlists (one-to-many)

# Backend Implementation Plan (movie_dashboard_API)
    
## Phase 1: Rails Setup & Configuration
1.1. Initialize Rails API
* rails new movie_dashboard_API --api --database=postgresql --skip-test

1.2.  Configure Database
* Update config/database.yml for Docker PostgreSQL connection
* Host: db (docker service name)
* Port: 5432
* Database: movie_dashboard_development

1.3. Essential Gems
* rack-cors - CORS handling
* httparty - TMDB API calls
* kaminari - Pagination
* active_model_serializers - JSON responses
* Nice-to-have: devise, rswag (Swagger)

## Phase 2: Models & Migrations
2.1 Generate models for all 7 entities

2.2 Add validations and associations

2.3 Create database migrations with proper indexes

2.4 Add seeds for initial genres from TMDB

## Phase 3: TMDB Service Layer
3.1 TmdbService class (app/services/tmdb_service.rb)
* fetch_popular_movies
* fetch_movie_details(tmdb_id)
* search_movies(query)
* fetch_genres
* fetch_movie_credits(tmdb_id)
* Error handling and rate limiting

3.2 Movie Synchronization
* Background job or rake task to sync TMDB data to local DB
* Store frequently accessed movies locally

## Phase 4: REST API Controllers (CRUD for 5+ entities)

4.1 MoviesController
* GET /api/v1/movies - List/search (with pagination)
* GET /api/v1/movies/:id - Show details
* POST /api/v1/movies - Create (sync from TMDB)
* PUT /api/v1/movies/:id - Update
* DELETE /api/v1/movies/:id - Destroy

4.2 GenresController
* Full CRUD operations
* GET /api/v1/genres/:id/movies - Movies by genre

4.3 ReviewsController
* Full CRUD operations
* GET /api/v1/movies/:movie_id/reviews - Nested route

4.4 WatchlistsController
* Full CRUD operations
* Filter by status

4.5 ActorsController
* Full CRUD operations
* GET /api/v1/actors/:id/movies - Movies by actor

## Phase 5: API Endpoints
* Namespace: /api/v1
* RESTful routes with nested resources where appropriate
* Error handling with proper HTTP status codes
* JSON API responses with serializers

# Docker & Database Setup
### 1. docker-compose.yml Structure
``` yml 
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: movie_dashboard_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: movie_dashboard_development
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-PSQL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### 2. Commands:

1. Start: docker-compose up -d
2. Stop: docker-compose down
3. Reset: docker-compose down -v (removes volumes)

### 3. Process Manager: Foreman

# Frontend Implementation Plan (movie_dashboard_WEB)
## Phase 1: Vite + React Setup
1. Initialize Vite Project
``` bash
   npm create vite@latest movie_dashboard_WEB -- --template react
```
2. Core Dependencies
* react-router-dom - Routing
* axios - API calls
* @tanstack/react-query - Data fetching/caching
* tailwindcss or styled-components - Styling
* Nice-to-have: recharts or chart.js for data viz

## Phase 2: Project Structure
```
src/
├── components/
│   ├── common/ (Button, Card, Loading, etc.)
│   ├── movies/ (MovieCard, MovieList, MovieDetail)
│   ├── reviews/ (ReviewForm, ReviewList)
│   └── layout/ (Header, Footer, Sidebar)
├── pages/
│   ├── Home.jsx
│   ├── Movies.jsx
│   ├── MovieDetail.jsx
│   ├── Watchlist.jsx
│   ├── Reviews.jsx
│   └── Genres.jsx
├── services/
│   └── api.js (axios configuration)
├── hooks/
│   └── useMovies.js, useReviews.js, etc.
├── utils/
└── App.jsx
```
## Phase 3: Key Features
1. Navigation
* Top navbar with links to all sections
* Breadcrumb navigation
* Responsive mobile menu
2. Pages to Build
* Home/Dashboard: Featured movies, trending, statistics
* Movies Browser: Grid/list view with search, filters (genre, year, rating)
* Movie Detail: Full info, cast, reviews, add to watchlist
* Watchlist: Manage personal watchlist (grouped by status)
* Reviews: All reviews with CRUD operations
* Genres: Browse movies by genre
* Actors: Browse actors and their movies
3. Dynamic Features
* Search with debouncing
* Infinite scroll or pagination
* Real-time updates after CRUD operations
* Loading states and error handling
* Image lazy loading for posters
## Phase 4: UI/UX Design
*Modern, clean interface (Netflix/IMDb inspired)
* Responsive design (mobile, tablet, desktop)
* Skeleton loaders
* Toast notifications for actions
* Modal for forms

# Procfile Structure
```
    web: cd movie_dashboard_WEB && npm run dev
    api: cd movie_dashboard_API && bundle exec rails s -p 3000
```

# Start everything:
``` bash
    foreman start
```

# Implementation Phases
## Phase 1: Foundation
[ ] Set up PostgreSQL with docker-compose

[ ] Initialize Rails API project

[ ] Initialize Vite + React project

[ ] Configure database connections

[ ] Set up CORS

[ ] Create Procfile

## Phase 2: Backend Core
[ ] Create all 7 models with migrations

[ ] Run migrations

[ ] Add validations and associations

[ ] Build TmdbService

[ ] Seed genres from TMDB

[ ] Test database relationships

## Phase 3: Backend API
[ ] Implement 5 controllers with full CRUD

[ ] Set up routes (/api/v1/...)

[ ] Add serializers for JSON responses

[ ] Implement pagination

[ ] Add error handling

[ ] Test all endpoints (Postman/curl)

## Phase 4: Frontend Foundation

[ ] Set up React Router

[ ] Create layout components (Header, Footer)

[ ] Configure axios with base URL

[ ] Set up React Query

[ ] Build reusable UI components

[ ] Implement navigation

## Phase 5: Frontend Features

[ ] Home/Dashboard page

[ ] Movies browser with search/filters

[ ] Movie detail page

[ ] Reviews CRUD interface

[ ] Watchlist management

[ ] Genres page

[ ] Actors page

## Phase 6: Integration & Polish
[ ] Connect all frontend to backend APIs

[ ] TMDB API integration (fetch and display data)

[ ] Responsive design testing

[ ] Error handling across app

[ ] Loading states

[ ] Final testing and bug fixes

## Phase 7: Nice-to-Have (If Time Permits)

[ ] Devise authentication (signup/login)

[ ] Protected routes

[ ] User-specific watchlists

[ ] Swagger/OpenAPI documentation

[ ] Data visualization (charts for ratings, genres, etc.)

[ ] Advanced filtering and sorting

# Environment Variables
* Backend (.env)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/movie_dashboard_development
TMDB_API_KEY=ebff3040c7c0e3c70b26a29fa2dd78c4
TMDB_BASE_URL=https://api.themoviedb.org/3
FRONTEND_URL=http://localhost:5173
```
* Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

# API Endpoints Summary

## Movies
* GET /api/v1/movies - List all movies (paginated)
* GET /api/v1/movies/:id - Get movie details
* POST /api/v1/movies - Create/sync movie
* PUT /api/v1/movies/:id - Update movie
* DELETE /api/v1/movies/:id - Delete movie
* GET /api/v1/movies/search?q=query - Search movies

## Genres
* GET /api/v1/genres - List all genres
* GET /api/v1/genres/:id - Get genre
* POST /api/v1/genres - Create genre
* PUT /api/v1/genres/:id - Update genre
* DELETE /api/v1/genres/:id - Delete genre
* GET /api/v1/genres/:id/movies - Movies by genre

## Reviews
* GET /api/v1/reviews - List all reviews
* GET /api/v1/movies/:movie_id/reviews - Reviews for a movie
* POST /api/v1/reviews - Create review
* PUT /api/v1/reviews/:id - Update review
* DELETE /api/v1/reviews/:id - Delete review

## Watchlists
* GET /api/v1/watchlists - List watchlist items
* POST /api/v1/watchlists - Add to watchlist
* PUT /api/v1/watchlists/:id - Update watchlist item
* DELETE /api/v1/watchlists/:id - Remove from watchlist

## Actors
* GET /api/v1/actors - List all actors
* GET /api/v1/actors/:id - Get actor details
* POST /api/v1/actors - Create actor
* PUT /api/v1/actors/:id - Update actor
* DELETE /api/v1/actors/:id - Delete actor
*  GET /api/v1/actors/:id/movies - Movies by actor

# TMDB API Integration Points
1. Initial Data Seeding
* Fetch popular movies
* Sync genres
* Import movie details and credits
2. Search Functionality
* Real-time movie search forwarded to TMDB
* Cache results in local database
3. Movie Details
* Fetch complete movie info
* Credits (cast & crew)
* Similar movies recommendations
4. Images
* Use TMDB image URLs for posters/backdrops
* Configuration: https://image.tmdb.org/t/p/w500/[poster_path]

Requirements Checklist
Backend ✓
[x] 5+ entities (7 planned)
[x] CRUD REST API for 5+ entities
[x] Data persistence (PostgreSQL)
Frontend ✓
[x] User-friendly interface with navigation
[x] Dynamic API/database results display
Database ✓
[x] 5+ entities (7 planned)
[x] Relational schema
[x] docker-compose.yml for database
External API ✓
[x] TMDB API integration
[x] Display external data in app
Nice-to-Have (Lower Priority)
[ ] Devise authentication
[ ] Swagger/OpenAPI docs
[ ] Data visualization

# Development Commands
## Starting the Application
``` bash
# Start database
docker-compose up -d

# Start all services (with Foreman)
foreman start

# Or manually:
# Terminal 1: cd movie_dashboard_API && rails s
# Terminal 2: cd movie_dashboard_WEB && npm run dev
```

## Backend Commands
``` bash
cd movie_dashboard_API
bundle install
rails db:create db:migrate db:seed
rails s
```
## Frontend Commands
``` bash
cd movie_dashboard_WEB
npm install
npm run dev
```

# Deliverables
1. Fully functional Rails API with 5+ CRUD endpoints
2. React frontend with routing and multiple views
3. PostgreSQL database with docker-compose
4. TMDB API integration showing external data
5. Procfile for Foreman to start all services
6. README with setup instructions
7. Environment variable templates

This plan provides a complete roadmap for building your movie dashboard application. The architecture is scalable, follows best practices, and meets all the specified requirements. 