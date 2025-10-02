# Testing Guide - Movie Dashboard

## Quick Testing Strategy for Each Phase

### Phase 1: Foundation Setup ✅ COMPLETED
**What was built:**
- PostgreSQL Docker container
- Rails API project with database configured
- CORS enabled
- Required gems installed (rack-cors, httparty, kaminari)

**How to test:**
```bash
# 1. Verify Docker is running
docker ps
# Should show: movie_dashboard_db (healthy)

# 2. Verify Rails app can connect to database
cd movie_dashboard_API
rails db:migrate:status
# Should show: database connected successfully

# 3. Start Rails server (test if it boots)
rails s
# Visit: http://localhost:3000
# Should see: Rails welcome page or routing error (both are good!)
```

---

### Phase 2: Backend Core (Models & Migrations)
**What to build:**
- 5 models: Movie, Genre, MovieGenre, Review, Watchlist
- Database migrations
- Associations and validations
- Seed data from TMDB

**How to test:**
```bash
# 1. Run migrations
rails db:migrate

# 2. Check schema was created
rails db:schema:dump
# Look at db/schema.rb - should show all 5 tables

# 3. Test in Rails console
rails console
> Movie.count  # Should return 0 initially
> Genre.create(name: "Action", tmdb_id: 28)
> Genre.count  # Should return 1

# 4. Test associations
> movie = Movie.create(title: "Test", tmdb_id: 123)
> movie.genres << Genre.first
> movie.genres.count  # Should return 1

# 5. Run seed file
rails db:seed
> Movie.count  # Should have movies from TMDB
> Genre.count  # Should have all genres
```

**Expected results:**
- All migrations run without errors
- Can create records in console
- Associations work correctly
- Seed populates initial data

---

### Phase 3: Backend API (Controllers & Routes)
**What to build:**
- CRUD controllers for all 5 entities
- API routes under /api/v1
- TMDB Service integration
- JSON responses

**How to test:**
```bash
# 1. Check routes exist
rails routes | grep api
# Should show all CRUD routes for movies, genres, reviews, watchlists

# 2. Start the server
rails s -p 3000

# 3. Test endpoints with curl (in another terminal)

# Get all movies
curl http://localhost:3000/api/v1/movies

# Get single movie
curl http://localhost:3000/api/v1/movies/1

# Create a review
curl -X POST http://localhost:3000/api/v1/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "review": {
      "movie_id": 1,
      "rating": 8,
      "content": "Great movie!",
      "author_name": "Test User"
    }
  }'

# Get all genres
curl http://localhost:3000/api/v1/genres

# Add to watchlist
curl -X POST http://localhost:3000/api/v1/watchlists \
  -H "Content-Type: application/json" \
  -d '{
    "watchlist": {
      "movie_id": 1,
      "status": "want_to_watch",
      "notes": "Looks interesting"
    }
  }'

# Test TMDB service in console
rails console
> service = TmdbService.new
> service.fetch_popular_movies
> service.search_movies("Inception")
```

**Expected results:**
- All API endpoints return JSON
- CRUD operations work (Create, Read, Update, Delete)
- Proper HTTP status codes (200, 201, 404, 422)
- TMDB service fetches real movie data

---

### Phase 4: Frontend Foundation
**What to build:**
- Vite + React project
- React Router setup
- Axios configuration
- Basic layout components

**How to test:**
```bash
# 1. Verify npm packages installed
cd movie_dashboard_WEB
npm run dev
# Should start on http://localhost:5173

# 2. Check in browser
# Visit: http://localhost:5173
# Should see React app running

# 3. Test navigation
# Click through nav links - routes should change

# 4. Test API connection (check browser console)
# Should not see CORS errors
# Should see API calls in Network tab

# 5. Test with both servers running
# Terminal 1: cd movie_dashboard_API && rails s
# Terminal 2: cd movie_dashboard_WEB && npm run dev
# Both should run without conflicts
```

**Expected results:**
- React app loads on port 5173
- Navigation works
- No CORS errors in console
- Can fetch data from Rails API

---

### Phase 5: Frontend Features (Main Pages)
**What to build:**
- Home/Dashboard page
- Movies browser with search
- Movie detail page
- Reviews CRUD interface
- Watchlist management

**How to test each feature:**

**Home Page:**
- [ ] Displays featured/popular movies from API
- [ ] Movies load with images
- [ ] Loading state shows before data arrives
- [ ] Error message if API fails

**Movies Browser:**
- [ ] Grid of movie cards displays
- [ ] Search box works (type and see filtered results)
- [ ] Filter by genre works
- [ ] Pagination or scroll loads more movies
- [ ] Click a movie card navigates to detail page

**Movie Detail Page:**
- [ ] Shows movie title, poster, overview, rating
- [ ] Displays genre tags
- [ ] Shows all reviews for that movie
- [ ] Has "Add to Watchlist" button
- [ ] Add to watchlist creates a new entry

**Reviews Section:**
- [ ] Can create a new review (form submission)
- [ ] Review appears in list immediately
- [ ] Can edit existing review
- [ ] Can delete a review
- [ ] Shows validation errors if fields missing

**Watchlist Page:**
- [ ] Shows all watchlist items
- [ ] Can change status (want_to_watch, watching, watched)
- [ ] Can add notes to items
- [ ] Can remove items from watchlist
- [ ] Items grouped by status

**Manual testing checklist:**
```
1. Load home page - see movies? ✓
2. Search for "Batman" - results filter? ✓
3. Click a movie - detail page loads? ✓
4. Add a review - appears in list? ✓
5. Edit review - updates correctly? ✓
6. Delete review - removes from list? ✓
7. Add to watchlist - confirmation shown? ✓
8. Go to watchlist page - item there? ✓
9. Change watchlist status - updates? ✓
10. Remove from watchlist - disappears? ✓
```

---

### Phase 6: Integration & Polish
**What to test:**
- Full user flow from start to finish
- Error handling
- Loading states
- Responsive design

**Complete user flow test:**
```
Scenario: User discovers a movie and adds to watchlist

1. Open app → Home page loads with movies ✓
2. Search "Inception" → Results show ✓
3. Click on Inception → Detail page shows full info ✓
4. Read reviews → Existing reviews display ✓
5. Add new review "Mind-blowing!" rating 10 → Review saves ✓
6. Click "Add to Watchlist" → Success message ✓
7. Navigate to Watchlist → Inception is there ✓
8. Change status to "watched" → Updates instantly ✓
9. Go back to Inception detail → Review still there ✓
10. Filter movies by "Sci-Fi" genre → Relevant movies show ✓
```

**Error handling test:**
```
1. Stop Rails server → Frontend shows error message (not just blank)
2. Submit empty review → Validation error shown
3. Try to create duplicate watchlist item → Handled gracefully
4. Search for nonsense → "No results found" message
5. Navigate to /movies/99999 → 404 page or redirect
```

**Responsive design test:**
```
1. Resize browser to mobile width → Layout adapts
2. Check on phone if possible → Usable on small screen
3. Navigation collapses to hamburger menu
4. Movie cards stack vertically
```

---

## Quick Commands Reference

### Start Everything
```bash
# Terminal 1: Database
docker-compose up -d

# Terminal 2: Backend
cd movie_dashboard_API
rails s

# Terminal 3: Frontend
cd movie_dashboard_WEB
npm run dev
```

### Stop Everything
```bash
# Stop frontend: Ctrl+C in terminal
# Stop backend: Ctrl+C in terminal
# Stop database:
docker-compose down
```

### Reset Database (if needed)
```bash
cd movie_dashboard_API
rails db:drop db:create db:migrate db:seed
```

### Check Logs
```bash
# Backend logs: In terminal running rails s
# Frontend logs: In terminal running npm run dev
# Database logs:
docker logs movie_dashboard_db
```

---

## Troubleshooting

### Database connection error
```bash
# Check if Docker is running
docker ps

# Restart Docker container
docker-compose restart
```

### CORS error in browser
- Check if CORS is configured in `config/initializers/cors.rb`
- Restart Rails server after changes
- Check origins include `http://localhost:5173`

### Port already in use
```bash
# Rails (3000):
lsof -ti:3000 | xargs kill -9

# Vite (5173):
lsof -ti:5173 | xargs kill -9
```

### API returns empty data
- Check if seed data ran: `rails console` → `Movie.count`
- Re-run seeds: `rails db:seed`
- Check TMDB API key is valid

---

## Performance Checklist (Before Demo)

- [ ] All 5 entities have working CRUD
- [ ] TMDB API integration displays real movie data
- [ ] At least 3 main screens work (Home, Movies, Detail)
- [ ] Can create reviews and add to watchlist
- [ ] No console errors in browser
- [ ] No server errors in Rails logs
- [ ] Database has seed data
- [ ] Images load properly
- [ ] Basic styling looks clean

---

## Demo Preparation (10-minute Demo)

**Script outline:**
1. **Intro (30s):** "Movie Dashboard built with Rails API + React + PostgreSQL"
2. **Backend tour (2min):** Show models, routes, TMDB service
3. **Frontend demo (5min):** 
   - Browse movies
   - Search & filter
   - View movie details
   - Add a review (live)
   - Add to watchlist (live)
   - Show watchlist management
4. **Architecture (2min):** Explain docker-compose, API structure, React components
5. **Lesson learned (30s):** Share one key takeaway

**Practice run through demo at least once before presenting!**

