class Api::V1::WatchlistsController < ApplicationController
  before_action :set_watchlist, only: [ :show, :update, :destroy ]

  # GET /api/v1/watchlists
  # GET /api/v1/watchlists?status=want_to_watch
  def index
    @watchlists = Watchlist.includes(:movie).order(created_at: :desc)

    # Filter by status if provided
    if params[:status].present?
      case params[:status]
      when "want_to_watch"
        @watchlists = @watchlists.want_to_watch
      when "watching"
        @watchlists = @watchlists.watching
      when "watched"
        @watchlists = @watchlists.watched
      end
    end

    # Pagination
    @watchlists = @watchlists.page(params[:page] || 1).per(params[:per_page] || 20)

    render json: {
      watchlists: @watchlists.as_json(
        include: {
          movie: {
            only: [ :id, :title, :poster_path, :release_date, :vote_average ],
            include: { genres: { only: [ :id, :name ] } }
          }
        }
      ),
      pagination: {
        current_page: @watchlists.current_page,
        total_pages: @watchlists.total_pages,
        total_count: @watchlists.total_count
      }
    }
  end

  # GET /api/v1/watchlists/:id
  def show
    render json: @watchlist.as_json(
      include: {
        movie: {
          include: :genres
        }
      }
    )
  end

  # POST /api/v1/watchlists
  def create
    @watchlist = Watchlist.new(watchlist_params)

    if @watchlist.save
      render json: @watchlist.as_json(include: :movie), status: :created
    else
      render json: { errors: @watchlist.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/watchlists/:id
  def update
    if @watchlist.update(watchlist_params)
      render json: @watchlist.as_json(include: :movie)
    else
      render json: { errors: @watchlist.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/watchlists/:id
  def destroy
    @watchlist.destroy
    head :no_content
  end

  # GET /api/v1/watchlists/stats
  # Get statistics about watchlist
  def stats
    render json: {
      total: Watchlist.count,
      want_to_watch: Watchlist.want_to_watch.count,
      watching: Watchlist.watching.count,
      watched: Watchlist.watched.count
    }
  end

  private

  def set_watchlist
    @watchlist = Watchlist.includes(:movie).find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Watchlist item not found" }, status: :not_found
  end

  def watchlist_params
    params.require(:watchlist).permit(:movie_id, :status, :notes)
  end
end
