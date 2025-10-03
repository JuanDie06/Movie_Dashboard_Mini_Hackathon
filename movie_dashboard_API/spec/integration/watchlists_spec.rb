require 'swagger_helper'

RSpec.describe 'Watchlists API', type: :request do

  path '/api/v1/watchlists' do

    get('List all watchlist items') do
      tags 'Watchlists'
      produces 'application/json'
      parameter name: :status, in: :query, type: :string, 
                description: 'Filter by status', 
                required: false,
                schema: {
                  type: :string,
                  enum: ['want_to_watch', 'watching', 'watched']
                }

      response(200, 'successful') do
        schema type: :object,
          properties: {
            watchlists: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  id: { type: :integer },
                  movie_id: { type: :integer },
                  status: { 
                    type: :string,
                    enum: ['want_to_watch', 'watching', 'watched']
                  },
                  notes: { type: :string },
                  created_at: { type: :string, format: 'date-time' },
                  updated_at: { type: :string, format: 'date-time' },
                  movie: {
                    type: :object,
                    properties: {
                      id: { type: :integer },
                      title: { type: :string },
                      poster_path: { type: :string },
                      vote_average: { type: :number },
                      release_date: { type: :string, format: 'date' },
                      genres: {
                        type: :array,
                        items: {
                          type: :object,
                          properties: {
                            id: { type: :integer },
                            name: { type: :string }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }

        run_test!
      end
    end

    post('Add movie to watchlist') do
      tags 'Watchlists'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :watchlist, in: :body, schema: {
        type: :object,
        properties: {
          watchlist: {
            type: :object,
            properties: {
              movie_id: { type: :integer },
              status: { 
                type: :string,
                enum: ['want_to_watch', 'watching', 'watched']
              },
              notes: { type: :string }
            },
            required: ['movie_id', 'status']
          }
        }
      }

      response(201, 'watchlist item created') do
        let(:watchlist) { 
          { 
            watchlist: { 
              movie_id: 1, 
              status: 'want_to_watch',
              notes: 'Looks interesting!'
            } 
          } 
        }
        run_test!
      end

      response(422, 'invalid request or duplicate entry') do
        let(:watchlist) { { watchlist: { movie_id: 1 } } }
        run_test!
      end
    end
  end

  path '/api/v1/watchlists/stats' do
    
    get('Get watchlist statistics') do
      tags 'Watchlists'
      produces 'application/json'
      description 'Returns counts for each watchlist status'

      response(200, 'successful') do
        schema type: :object,
          properties: {
            total: { type: :integer, description: 'Total watchlist items' },
            want_to_watch: { type: :integer, description: 'Items with want_to_watch status' },
            watching: { type: :integer, description: 'Items with watching status' },
            watched: { type: :integer, description: 'Items with watched status' }
          }

        run_test!
      end
    end
  end

  path '/api/v1/watchlists/{id}' do
    parameter name: 'id', in: :path, type: :integer, description: 'Watchlist item ID'

    get('Show watchlist item details') do
      tags 'Watchlists'
      produces 'application/json'

      response(200, 'successful') do
        schema type: :object,
          properties: {
            id: { type: :integer },
            movie_id: { type: :integer },
            status: { type: :string },
            notes: { type: :string },
            created_at: { type: :string, format: 'date-time' },
            updated_at: { type: :string, format: 'date-time' }
          }

        let(:id) { '1' }
        run_test!
      end

      response(404, 'not found') do
        let(:id) { 'invalid' }
        run_test!
      end
    end

    put('Update watchlist item') do
      tags 'Watchlists'
      consumes 'application/json'
      produces 'application/json'
      description 'Update status or notes of a watchlist item'
      parameter name: :watchlist, in: :body, schema: {
        type: :object,
        properties: {
          watchlist: {
            type: :object,
            properties: {
              status: { 
                type: :string,
                enum: ['want_to_watch', 'watching', 'watched']
              },
              notes: { type: :string }
            }
          }
        }
      }

      response(200, 'watchlist item updated') do
        let(:id) { '1' }
        let(:watchlist) { { watchlist: { status: 'watched' } } }
        run_test!
      end
    end

    delete('Remove from watchlist') do
      tags 'Watchlists'
      produces 'application/json'

      response(204, 'watchlist item deleted') do
        let(:id) { '1' }
        run_test!
      end
    end
  end
end

