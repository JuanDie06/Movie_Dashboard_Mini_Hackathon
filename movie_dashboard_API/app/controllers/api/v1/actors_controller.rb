module Api
  module V1
    class ActorsController < ApplicationController
      before_action :set_actor, only: [:show, :update, :destroy]
      
      # GET /api/v1/actors
      def index
        @actors = Actor.all
        
        # Apply search filter
        @actors = @actors.search(params[:search]) if params[:search].present?
        
        # Apply ordering
        case params[:sort_by]
        when 'popularity'
          @actors = @actors.popular
        when 'name'
          @actors = @actors.by_name
        else
          @actors = @actors.popular # Default to popularity
        end
        
        # Pagination
        page = params[:page] || 1
        per_page = params[:per_page] || 20
        @actors = @actors.page(page).per(per_page)
        
        render json: {
          actors: @actors.as_json(
            methods: [:thumbnail_url, :age, :alive?],
            include: {
              movies: {
                only: [:id, :title, :poster_path, :release_date],
                through: :movie_actors
              }
            }
          ),
          pagination: {
            current_page: @actors.current_page,
            total_pages: @actors.total_pages,
            total_count: @actors.total_count
          }
        }
      end
      
      # GET /api/v1/actors/:id
      def show
        render json: @actor.as_json(
          methods: [:profile_url, :thumbnail_url, :age, :alive?],
          include: {
            movie_actors: {
              include: {
                movie: {
                  only: [:id, :title, :poster_path, :backdrop_path, :release_date, :vote_average],
                  include: { genres: { only: [:id, :name] } }
                }
              }
            }
          }
        )
      end
      
      # POST /api/v1/actors
      def create
        @actor = Actor.new(actor_params)
        
        if @actor.save
          render json: @actor, status: :created
        else
          render json: { errors: @actor.errors.full_messages }, status: :unprocessable_entity
        end
      end
      
      # PUT/PATCH /api/v1/actors/:id
      def update
        if @actor.update(actor_params)
          render json: @actor
        else
          render json: { errors: @actor.errors.full_messages }, status: :unprocessable_entity
        end
      end
      
      # DELETE /api/v1/actors/:id
      def destroy
        @actor.destroy
        head :no_content
      end
      
      # GET /api/v1/actors/:id/movies
      def movies
        @actor = Actor.find(params[:id])
        @movies = @actor.movies.includes(:genres, :movie_actors)
        
        render json: @movies.as_json(
          include: {
            genres: { only: [:id, :name] },
            movie_actors: {
              where: { actor_id: @actor.id },
              only: [:character_name, :cast_order]
            }
          }
        )
      end
      
      # GET /api/v1/actors/popular
      def popular
        per_page = params[:per_page] || 20
        @actors = Actor.popular.limit(per_page)
        
        render json: {
          actors: @actors.as_json(
            methods: [:thumbnail_url, :age],
            include: {
              movies: {
                only: [:id, :title, :poster_path],
                limit: 3
              }
            }
          )
        }
      end
      
      private
      
      def set_actor
        @actor = Actor.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Actor not found' }, status: :not_found
      end
      
      def actor_params
        params.require(:actor).permit(
          :tmdb_id,
          :name,
          :profile_path,
          :biography,
          :birthday,
          :deathday,
          :place_of_birth,
          :known_for_department,
          :popularity
        )
      end
    end
  end
end

