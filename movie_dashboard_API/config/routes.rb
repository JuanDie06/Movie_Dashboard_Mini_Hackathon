Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
  # Health check endpoint
  get "up" => "rails/health#show", as: :rails_health_check

  # API routes under /api/v1 namespace
  namespace :api do
    namespace :v1 do
      # Movies routes
      resources :movies do
        collection do
          get :popular
          get :recent
          post :sync_from_tmdb
        end
        
        # Nested routes for movie reviews
        resources :reviews, only: [:index]
      end

      # Genres routes
      resources :genres do
        member do
          get :movies
        end
      end

      # Reviews routes
      resources :reviews do
        collection do
          get :highest_rated
        end
      end

      # Watchlists routes
      resources :watchlists do
        collection do
          get :stats
        end
      end
    end
  end

  # Root path
  root to: proc { [200, {}, ["Movie Dashboard API - Ready"]] }
end
