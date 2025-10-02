# Lower Priority Features - Movie Dashboard
## To Be Implemented Later (If Time Permits)

### Phase 7: Nice-to-Have Features (DEFERRED)

#### 1. Authentication System
- [ ] Devise gem integration
- [ ] User signup/login functionality
- [ ] Protected routes in frontend
- [ ] JWT token-based authentication
- [ ] User-specific watchlists
- [ ] Review ownership (only author can edit/delete)

#### 2. Swagger/OpenAPI Documentation
- [ ] Install rswag gem
- [ ] API documentation with interactive testing
- [ ] Auto-generated endpoint documentation
- [ ] Request/response schemas

#### 3. Data Visualization
- [ ] Charts for movie ratings distribution
- [ ] Genres popularity graphs
- [ ] Watchlist statistics
- [ ] Review trends over time
- [ ] Use recharts or chart.js

#### 4. Actors & Cast Management (7th Entity)
- [ ] Actors model and migrations
- [ ] MovieActors join table
- [ ] ActorsController with CRUD
- [ ] Cast display on movie detail page
- [ ] Actor detail page with filmography
- [ ] Browse movies by actor

#### 5. Huddle API Integration
- [ ] Research available Huddle APIs at huddle.dev
- [ ] Choose relevant API for movie dashboard
- [ ] Create service layer for Huddle integration
- [ ] Display Huddle data alongside TMDB data
- [ ] Handle API authentication/rate limiting

#### 6. Advanced Features
- [ ] Movie recommendations engine
- [ ] Advanced filtering (by year, rating range, runtime)
- [ ] Sorting options (newest, highest rated, most popular)
- [ ] Infinite scroll on movie lists
- [ ] Image optimization and lazy loading
- [ ] Dark mode toggle
- [ ] Export watchlist to CSV/JSON

#### 7. Performance Optimizations
- [ ] Redis caching for API responses
- [ ] Background jobs with Sidekiq
- [ ] Database query optimizations (includes, joins)
- [ ] Frontend code splitting
- [ ] Service workers for offline support

#### 8. Testing (If Required for Demo)
- [ ] RSpec for backend tests
- [ ] Jest/React Testing Library for frontend
- [ ] API integration tests
- [ ] E2E tests with Cypress

---

## Current Focus: Core MVP (24h Hackathon)

### ✅ Priority Features (Must Have)
1. **5 Core Entities:** Movies, Genres, MovieGenres, Reviews, Watchlists
2. **Full CRUD Operations** for all 5 entities
3. **TMDB API Integration** (fetch movies, genres, search)
4. **3+ Main Screens:**
   - Home/Dashboard (featured movies)
   - Movies Browser (search, filter by genre)
   - Movie Detail (with reviews and watchlist actions)
5. **Database:** PostgreSQL with docker-compose
6. **Basic Styling:** Tailwind CSS for clean, functional UI
7. **Core Navigation:** Working routes and navigation
8. **Error Handling:** Basic error states and loading indicators

---

## Estimated Time Allocation (24h)

| Phase | Time | Status |
|-------|------|--------|
| Phase 1: Foundation Setup | 1h | 🔜 NEXT |
| Phase 2: Backend Core (Models) | 2h | ⏳ Pending |
| Phase 3: Backend API (Controllers) | 3h | ⏳ Pending |
| Phase 4: Frontend Foundation | 2h | ⏳ Pending |
| Phase 5: Frontend Features | 4h | ⏳ Pending |
| Phase 6: Integration & Testing | 2h | ⏳ Pending |
| Phase 6.5: Polish & Bug Fixes | 2h | ⏳ Pending |
| **Buffer Time** | 8h | ⏳ Reserve |

**Total Focused Work:** ~16h  
**Buffer for Issues:** ~8h

---

## Decision Log
- **Date:** Oct 2, 2025
- **Decision:** Focus on 5-entity MVP first, defer auth, actors, Huddle API, and advanced features
- **Rationale:** 24h time constraint, prioritize working core functionality over nice-to-haves
- **Next Review:** After Phase 6 completion (~16h in)

