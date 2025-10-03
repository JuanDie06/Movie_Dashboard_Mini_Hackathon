class TmdbService
  include HTTParty
  base_uri 'https://api.themoviedb.org/3'

  def initialize
    @api_key = ENV.fetch('TMDB_API_KEY', 'ebff3040c7c0e3c70b26a29fa2dd78c4')
    @options = { query: { api_key: @api_key } }
  end

  # Fetch popular movies from TMDB
  def fetch_popular_movies(page = 1)
    response = self.class.get('/movie/popular', @options.merge(query: { api_key: @api_key, page: page }))
    handle_response(response)
  end

  # Fetch movie details by TMDB ID
  def fetch_movie_details(tmdb_id)
    response = self.class.get("/movie/#{tmdb_id}", @options)
    handle_response(response)
  end

  # Search movies by query string
  def search_movies(query, page = 1)
    response = self.class.get('/search/movie', @options.merge(query: { api_key: @api_key, query: query, page: page }))
    handle_response(response)
  end

  # Fetch all genres from TMDB
  def fetch_genres
    response = self.class.get('/genre/movie/list', @options)
    handle_response(response)
  end

  # Fetch movie credits (cast and crew)
  def fetch_movie_credits(tmdb_id)
    response = self.class.get("/movie/#{tmdb_id}/credits", @options)
    handle_response(response)
  end

  # Fetch actor details by TMDB ID
  def fetch_actor_details(tmdb_id)
    response = self.class.get("/person/#{tmdb_id}", @options)
    handle_response(response)
  end

  # Fetch popular actors from TMDB
  def fetch_popular_actors(page = 1)
    response = self.class.get('/person/popular', @options.merge(query: { api_key: @api_key, page: page }))
    handle_response(response)
  end

  # Search actors by query string
  def search_actors(query, page = 1)
    response = self.class.get('/search/person', @options.merge(query: { api_key: @api_key, query: query, page: page }))
    handle_response(response)
  end

  # Sync a movie from TMDB to local database
  def sync_movie(tmdb_id, sync_cast: false)
    movie_data = fetch_movie_details(tmdb_id)
    return nil unless movie_data

    movie = Movie.find_or_initialize_by(tmdb_id: tmdb_id)
    movie.assign_attributes(
      title: movie_data['title'],
      overview: movie_data['overview'],
      release_date: movie_data['release_date'],
      poster_path: movie_data['poster_path'],
      backdrop_path: movie_data['backdrop_path'],
      vote_average: movie_data['vote_average'],
      vote_count: movie_data['vote_count'],
      runtime: movie_data['runtime'],
      status: movie_data['status']
    )

    if movie.save
      # Sync genres
      sync_movie_genres(movie, movie_data['genres']) if movie_data['genres']
      
      # Sync cast if requested
      sync_movie_cast(movie) if sync_cast
      
      movie
    else
      nil
    end
  end

  # Sync an actor from TMDB to local database
  def sync_actor(tmdb_id)
    actor_data = fetch_actor_details(tmdb_id)
    return nil unless actor_data

    actor = Actor.find_or_initialize_by(tmdb_id: tmdb_id)
    actor.assign_attributes(
      name: actor_data['name'],
      profile_path: actor_data['profile_path'],
      biography: actor_data['biography'],
      birthday: actor_data['birthday'],
      deathday: actor_data['deathday'],
      place_of_birth: actor_data['place_of_birth'],
      known_for_department: actor_data['known_for_department'],
      popularity: actor_data['popularity']
    )

    actor.save ? actor : nil
  end

  # Sync cast for a movie from TMDB
  def sync_movie_cast(movie, limit: 20)
    credits_data = fetch_movie_credits(movie.tmdb_id)
    return unless credits_data && credits_data['cast']

    # Take top cast members (based on order)
    cast_members = credits_data['cast'].first(limit)
    
    cast_members.each_with_index do |cast_data, index|
      # Sync the actor
      actor = sync_actor(cast_data['id'])
      next unless actor

      # Create or update the movie-actor association
      movie_actor = MovieActor.find_or_initialize_by(movie: movie, actor: actor)
      movie_actor.assign_attributes(
        character_name: cast_data['character'],
        cast_order: cast_data['order'] || index
      )
      movie_actor.save
    end
  end

  # Sync multiple popular actors
  def sync_popular_actors(pages = 2, limit_per_page: 20)
    synced_actors = []
    
    pages.times do |page|
      actors_data = fetch_popular_actors(page + 1)
      next unless actors_data && actors_data['results']

      actors_data['results'].first(limit_per_page).each do |actor_data|
        actor = sync_actor(actor_data['id'])
        synced_actors << actor if actor
      end
    end

    synced_actors
  end

  # Sync multiple popular movies
  def sync_popular_movies(pages = 2)
    synced_movies = []
    
    pages.times do |page|
      movies_data = fetch_popular_movies(page + 1)
      next unless movies_data && movies_data['results']

      movies_data['results'].each do |movie_data|
        movie = sync_movie(movie_data['id'])
        synced_movies << movie if movie
      end
    end

    synced_movies
  end

  private

  def handle_response(response)
    if response.success?
      response.parsed_response
    else
      Rails.logger.error("TMDB API Error: #{response.code} - #{response.message}")
      nil
    end
  rescue => e
    Rails.logger.error("TMDB API Exception: #{e.message}")
    nil
  end

  def sync_movie_genres(movie, genres_data)
    return unless genres_data.is_a?(Array)

    genres_data.each do |genre_data|
      genre = Genre.find_or_create_by(tmdb_id: genre_data['id']) do |g|
        g.name = genre_data['name']
      end
      
      MovieGenre.find_or_create_by(movie: movie, genre: genre)
    end
  end
end

