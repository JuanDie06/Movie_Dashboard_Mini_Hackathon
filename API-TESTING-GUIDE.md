# API Testing Guide - Movie Dashboard

## 📦 API Collection Files

Two complete API testing collections are provided:

1. **`Movie-Dashboard-API.postman_collection.json`** - For Postman
2. **`Movie-Dashboard-API.insomnia.json`** - For Insomnia

Both contain **50+ pre-configured requests** with:
- ✅ All CRUD endpoints for Movies, Genres, Reviews, Watchlists
- ✅ Request bodies with example data
- ✅ Query parameters for filtering/pagination
- ✅ Proper headers (Content-Type: application/json)
- ✅ Real IDs from your database (42+)

---

## 🚀 How to Import

### Option 1: Postman

1. **Open Postman** Desktop or Web
2. Click **"Import"** button (top left)
3. Click **"Upload Files"**
4. Select `Movie-Dashboard-API.postman_collection.json`
5. Click **"Import"**
6. Collection will appear in left sidebar ✅

**Set Base URL:**
- Collection is already configured with variable: `{{base_url}}` = `http://localhost:3000/api/v1`
- No additional setup needed!

### Option 2: Insomnia

1. **Open Insomnia** Desktop
2. Click dropdown next to workspace name
3. Select **"Import/Export"** → **"Import Data"** → **"From File"**
4. Select `Movie-Dashboard-API.insomnia.json`
5. Click **"Scan"** → **"Import"**
6. Collection will appear with 4 folders ✅

**Set Base URL:**
- Environment variable already configured: `base_url` = `http://localhost:3000/api/v1`
- Uses `{{ _.base_url }}` syntax

---

## 📋 Collection Structure

### 1. **Movies** (11 requests)
- List All Movies (with pagination)
- Search Movies (by title)
- Filter by Genre
- Get Single Movie
- Get Popular Movies
- Get Recent Movies
- Create Movie
- Update Movie
- Delete Movie
- Sync from TMDB

### 2. **Genres** (6 requests)
- List All Genres
- Get Single Genre
- Get Movies by Genre
- Create Genre
- Update Genre
- Delete Genre

### 3. **Reviews** (7 requests)
- List All Reviews
- Get Reviews for Movie
- Get Highest Rated Reviews
- Get Single Review
- Create Review
- Update Review
- Delete Review

### 4. **Watchlists** (9 requests)
- List All Watchlist Items
- Filter: Want to Watch
- Filter: Watching
- Filter: Watched
- Get Watchlist Stats
- Get Single Watchlist Item
- Add to Watchlist
- Update Watchlist Item
- Remove from Watchlist

---

## 🧪 Quick Testing Workflow

### 1. Start Your Server
```bash
cd movie_dashboard_API
rails s
```
Server should be running on `http://localhost:3000`

### 2. Test Read Operations (Safe)
Start with GET requests:

**In Postman/Insomnia:**
1. Open **Movies → List All Movies** → Click **Send**
   - Should return 39 movies with pagination
   
2. Open **Movies → Get Single Movie** → Click **Send**
   - Should return "The Fantastic 4: First Steps" details

3. Open **Genres → List All Genres** → Click **Send**
   - Should return 19 genres with movie counts

4. Open **Watchlists → Get Watchlist Stats** → Click **Send**
   - Should return counts for each status

### 3. Test Create Operations
Try POST requests:

1. **Reviews → Create Review**
   - Already has body filled in with movie_id: 42
   - Click **Send**
   - Should create new review

2. **Watchlists → Add to Watchlist**
   - Body has movie_id: 44
   - If you get "already exists" error, change movie_id to 46, 47, etc.
   - Click **Send**

### 4. Test Search & Filter
1. **Movies → Search Movies**
   - Parameter: `search=Mission`
   - Should find "Mission: Impossible"

2. **Movies → Filter by Genre**
   - Parameter: `genre_id=39` (Action)
   - Should return ~21 action movies

3. **Watchlists → Filter: Watching**
   - Parameter: `status=watching`
   - Should return movies with "watching" status

---

## 🎯 Common Use Cases

### Search for a Movie
```
GET /movies?search=Batman
```

### Get All Reviews for a Movie
```
GET /reviews?movie_id=42
```

### Add Movie to Watchlist
```
POST /watchlists
Body:
{
  "watchlist": {
    "movie_id": 42,
    "status": "want_to_watch",
    "notes": "Looks interesting"
  }
}
```

### Mark Movie as Watched
```
PUT /watchlists/1
Body:
{
  "watchlist": {
    "status": "watched",
    "notes": "Great movie!"
  }
}
```

### Get Popular Movies
```
GET /movies/popular?page=1
```

---

## 🔍 Available Movie IDs

Your database has movies with IDs starting from **42**:

| ID | Movie Title |
|----|-------------|
| 42 | The Fantastic 4: First Steps |
| 43 | Mantis |
| 44 | Demon Slayer: Kimetsu no Yaiba Infinity Castle |
| 45 | Prisoner of War |
| 46 | War of the Worlds |
| ... | (39 total movies) |

Use these IDs when testing:
- Creating reviews
- Adding to watchlist
- Getting movie details

---

## 📝 Request Body Examples

### Create Review
```json
{
  "movie_id": 42,
  "review": {
    "rating": 9,
    "content": "Amazing movie! Highly recommended.",
    "author_name": "Your Name"
  }
}
```

**Validations:**
- rating: 1-10 (integer)
- content: minimum 10 characters
- author_name: required

### Add to Watchlist
```json
{
  "watchlist": {
    "movie_id": 42,
    "status": "want_to_watch",
    "notes": "Optional notes here"
  }
}
```

**Valid statuses:**
- `want_to_watch`
- `watching`
- `watched`

### Create Movie
```json
{
  "movie": {
    "tmdb_id": 12345,
    "title": "Test Movie",
    "overview": "Movie description",
    "release_date": "2025-12-31",
    "vote_average": 8.5,
    "runtime": 120
  },
  "genre_ids": [39, 40]
}
```

---

## ⚙️ Query Parameters

### Pagination
```
?page=1&per_page=20
```
Works on: `/movies`, `/reviews`, `/watchlists`

### Search
```
?search=query
```
Works on: `/movies`

### Filtering
```
?genre_id=39
?movie_id=42
?status=watching
```

---

## ✅ Expected Responses

### Success (200 OK)
```json
{
  "movies": [...],
  "pagination": {
    "current_page": 1,
    "total_pages": 2,
    "total_count": 39,
    "per_page": 20
  }
}
```

### Created (201 Created)
```json
{
  "id": 38,
  "movie_id": 42,
  "rating": 9,
  "content": "Amazing movie!",
  ...
}
```

### Not Found (404)
```json
{
  "error": "Movie not found"
}
```

### Validation Error (422)
```json
{
  "errors": [
    "Content is too short (minimum is 10 characters)",
    "Rating must be between 1 and 10"
  ]
}
```

---

## 🐛 Troubleshooting

### "Connection refused"
- Make sure Rails server is running: `rails s`
- Check server is on port 3000

### "Movie not found"
- Use movie IDs 42+ (not 1, 2, 3...)
- Run `rails console` and check: `Movie.pluck(:id)`

### "Already in this watchlist status"
- Validation prevents duplicates
- Try different movie_id or different status

### "TMDB sync failed"
- Check TMDB API key in `.env` file
- Valid TMDB IDs: 550 (Fight Club), 299536 (Avengers), 155 (Dark Knight)

---

## 📊 Quick Stats Commands

In **Postman/Insomnia**, test these to see your data:

```
GET /movies → Total movies
GET /genres → Total genres with counts
GET /reviews → Total reviews
GET /watchlists/stats → Watchlist breakdown
```

---

## 🎉 Ready to Test!

1. **Import** the collection (Postman or Insomnia)
2. **Start** Rails server (`rails s`)
3. **Try** a simple GET request (Movies → List All Movies)
4. **Explore** other endpoints!

All requests are pre-configured with:
- ✅ Correct URLs
- ✅ Proper headers
- ✅ Example request bodies
- ✅ Real IDs from your database

**Happy testing! 🚀**

