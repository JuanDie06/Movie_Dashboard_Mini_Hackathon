class Api::V1::ReviewsController < ApplicationController
  before_action :set_review, only: [:show, :update, :destroy]
  before_action :set_movie, only: [:create]

  # GET /api/v1/reviews
  # GET /api/v1/reviews?movie_id=1
  def index
    @reviews = Review.includes(:movie).order(created_at: :desc)
    
    # Filter by movie_id if provided
    if params[:movie_id].present?
      @reviews = @reviews.where(movie_id: params[:movie_id])
    end
    
    # Pagination
    @reviews = @reviews.page(params[:page] || 1).per(params[:per_page] || 20)
    
    render json: {
      reviews: @reviews.as_json(
        include: {
          movie: {
            only: [:id, :title, :poster_path]
          }
        }
      ),
      pagination: {
        current_page: @reviews.current_page,
        total_pages: @reviews.total_pages,
        total_count: @reviews.total_count
      }
    }
  end

  # GET /api/v1/reviews/:id
  def show
    render json: @review.as_json(
      include: {
        movie: {
          only: [:id, :title, :poster_path, :release_date]
        }
      }
    )
  end

  # POST /api/v1/reviews
  def create
    @review = @movie.reviews.new(review_params)

    if @review.save
      render json: @review.as_json(include: :movie), status: :created
    else
      render json: { errors: @review.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/reviews/:id
  def update
    if @review.update(review_params)
      render json: @review.as_json(include: :movie)
    else
      render json: { errors: @review.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/reviews/:id
  def destroy
    @review.destroy
    head :no_content
  end

  # GET /api/v1/reviews/highest_rated
  def highest_rated
    @reviews = Review.highest_rated
                     .includes(:movie)
                     .page(params[:page] || 1)
                     .per(params[:per_page] || 20)
    
    render json: {
      reviews: @reviews.as_json(include: { movie: { only: [:id, :title, :poster_path] } }),
      pagination: {
        current_page: @reviews.current_page,
        total_pages: @reviews.total_pages,
        total_count: @reviews.total_count
      }
    }
  end

  private

  def set_review
    @review = Review.includes(:movie).find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Review not found' }, status: :not_found
  end

  def set_movie
    @movie = Movie.find(params[:movie_id] || params.dig(:review, :movie_id))
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Movie not found' }, status: :not_found
  end

  def review_params
    params.require(:review).permit(:rating, :content, :author_name)
  end
end
