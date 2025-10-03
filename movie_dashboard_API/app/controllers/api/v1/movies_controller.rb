class Api::V1::MoviesController < ApplicationController
  before_action :set_movie, only: [ :show, :update, :destroy ]

  # GET /api/v1/movies
  # GET /api/v1/movies?page=1&per_page=20
  # GET /api/v1/movies?search=query
  def index
    @movies = Movie.includes(:genres).order(created_at: :desc)

    # Search functionality
    if params[:search].present?
      @movies = @movies.where("title ILIKE ?", "%#{params[:search]}%")
    end

    # Filter by genre
    if params[:genre_id].present?
      @movies = @movies.joins(:genres).where(genres: { id: params[:genre_id] })
    end

    # Pagination
    @movies = @movies.page(params[:page] || 1).per(params[:per_page] || 20)

    render json: {
      movies: @movies.as_json(include: :genres),
      pagination: {
        current_page: @movies.current_page,
        total_pages: @movies.total_pages,
        total_count: @movies.total_count,
        per_page: @movies.limit_value
      }
    }
  end

  # GET /api/v1/movies/:id
  def show
    render json: @movie.as_json(
      include: {
        genres: { only: [ :id, :name ] },
        reviews: { only: [ :id, :rating, :content, :author_name, :created_at ] },
        watchlists: { only: [ :id, :status, :notes ] },
        movie_actors: {
          include: {
            actor: {
              only: [ :id, :name, :profile_path ],
              methods: [ :thumbnail_url ]
            }
          },
          only: [ :character_name, :cast_order ]
        }
      }
    )
  end

  # POST /api/v1/movies
  def create
    @movie = Movie.new(movie_params)

    if @movie.save
      # Associate genres if provided
      if params[:genre_ids].present?
        @movie.genre_ids = params[:genre_ids]
      end

      render json: @movie.as_json(include: :genres), status: :created
    else
      render json: { errors: @movie.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/movies/:id
  def update
    if @movie.update(movie_params)
      # Update genres if provided
      if params[:genre_ids].present?
        @movie.genre_ids = params[:genre_ids]
      end

      render json: @movie.as_json(include: :genres)
    else
      render json: { errors: @movie.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/movies/:id
  def destroy
    @movie.destroy
    head :no_content
  end

  # GET /api/v1/movies/popular
  def popular
    @movies = Movie.popular.includes(:genres).page(params[:page] || 1).per(params[:per_page] || 20)

    render json: {
      movies: @movies.as_json(include: :genres),
      pagination: {
        current_page: @movies.current_page,
        total_pages: @movies.total_pages,
        total_count: @movies.total_count
      }
    }
  end

  # GET /api/v1/movies/recent
  def recent
    @movies = Movie.recent.includes(:genres).page(params[:page] || 1).per(params[:per_page] || 20)

    render json: {
      movies: @movies.as_json(include: :genres),
      pagination: {
        current_page: @movies.current_page,
        total_pages: @movies.total_pages,
        total_count: @movies.total_count
      }
    }
  end

  # POST /api/v1/movies/sync_from_tmdb
  # Sync a movie from TMDB by tmdb_id
  def sync_from_tmdb
    tmdb_id = params[:tmdb_id]

    if tmdb_id.blank?
      return render json: { error: "TMDB ID is required" }, status: :bad_request
    end

    tmdb_service = TmdbService.new
    movie = tmdb_service.sync_movie(tmdb_id)

    if movie
      render json: movie.as_json(include: :genres), status: :created
    else
      render json: { error: "Failed to sync movie from TMDB" }, status: :unprocessable_entity
    end
  end

  private

  def set_movie
    @movie = Movie.includes(:genres, :reviews, :watchlists).find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Movie not found" }, status: :not_found
  end

  def movie_params
    params.require(:movie).permit(
      :tmdb_id, :title, :overview, :release_date, :poster_path,
      :backdrop_path, :vote_average, :vote_count, :runtime, :status
    )
  end
end
