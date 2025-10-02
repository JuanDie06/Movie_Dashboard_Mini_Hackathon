class Api::V1::GenresController < ApplicationController
  before_action :set_genre, only: [ :show, :update, :destroy, :movies ]

  # GET /api/v1/genres
  def index
    @genres = Genre.all.order(:name)

    render json: @genres.as_json(
      methods: :movies_count
    )
  end

  # GET /api/v1/genres/:id
  def show
    render json: @genre.as_json(
      include: {
        movies: {
          only: [ :id, :title, :poster_path, :vote_average, :release_date ]
        }
      }
    )
  end

  # POST /api/v1/genres
  def create
    @genre = Genre.new(genre_params)

    if @genre.save
      render json: @genre, status: :created
    else
      render json: { errors: @genre.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/genres/:id
  def update
    if @genre.update(genre_params)
      render json: @genre
    else
      render json: { errors: @genre.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/genres/:id
  def destroy
    @genre.destroy
    head :no_content
  end

  # GET /api/v1/genres/:id/movies
  # Get all movies for a specific genre with pagination
  def movies
    @movies = @genre.movies
                    .includes(:genres)
                    .order(vote_average: :desc, vote_count: :desc)
                    .page(params[:page] || 1)
                    .per(params[:per_page] || 20)

    render json: {
      genre: @genre,
      movies: @movies.as_json(include: :genres),
      pagination: {
        current_page: @movies.current_page,
        total_pages: @movies.total_pages,
        total_count: @movies.total_count
      }
    }
  end

  private

  def set_genre
    @genre = Genre.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Genre not found" }, status: :not_found
  end

  def genre_params
    params.require(:genre).permit(:tmdb_id, :name)
  end
end

# Add helper method to Genre model
class Genre < ApplicationRecord
  # ... existing code ...

  def movies_count
    movies.count
  end
end
