require 'swagger_helper'

RSpec.describe 'Movies API', type: :request do

  path '/api/v1/movies' do

    get('List all movies') do
      tags 'Movies'
      produces 'application/json'
      parameter name: :page, in: :query, type: :integer, description: 'Page number', required: false
      parameter name: :per_page, in: :query, type: :integer, description: 'Movies per page', required: false
      parameter name: :search, in: :query, type: :string, description: 'Search query', required: false
      parameter name: :genre_id, in: :query, type: :integer, description: 'Filter by genre ID', required: false

      response(200, 'successful') do
        schema type: :object,
          properties: {
            movies: {
              type: :array,
              items: { '$ref' => '#/components/schemas/Movie' }
            },
            meta: {
              type: :object,
              properties: {
                current_page: { type: :integer },
                total_pages: { type: :integer },
                total_count: { type: :integer }
              }
            }
          }

        run_test!
      end
    end

    post('Create a movie') do
      tags 'Movies'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :movie, in: :body, schema: {
        type: :object,
        properties: {
          movie: {
            type: :object,
            properties: {
              tmdb_id: { type: :integer },
              title: { type: :string },
              overview: { type: :string },
              release_date: { type: :string, format: 'date' },
              poster_path: { type: :string },
              backdrop_path: { type: :string },
              vote_average: { type: :number },
              vote_count: { type: :integer },
              runtime: { type: :integer }
            },
            required: ['title', 'tmdb_id']
          }
        }
      }

      response(201, 'movie created') do
        let(:movie) { { movie: { title: 'Test Movie', tmdb_id: 12345 } } }
        run_test!
      end

      response(422, 'invalid request') do
        let(:movie) { { movie: { title: '' } } }
        run_test!
      end
    end
  end

  path '/api/v1/movies/{id}' do
    parameter name: 'id', in: :path, type: :integer, description: 'Movie ID'

    get('Show movie details') do
      tags 'Movies'
      produces 'application/json'

      response(200, 'successful') do
        schema '$ref' => '#/components/schemas/Movie'
        let(:id) { '1' }
        run_test!
      end

      response(404, 'not found') do
        let(:id) { 'invalid' }
        run_test!
      end
    end

    put('Update a movie') do
      tags 'Movies'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :movie, in: :body, schema: {
        type: :object,
        properties: {
          movie: {
            type: :object,
            properties: {
              title: { type: :string },
              overview: { type: :string },
              vote_average: { type: :number }
            }
          }
        }
      }

      response(200, 'movie updated') do
        let(:id) { '1' }
        let(:movie) { { movie: { title: 'Updated Title' } } }
        run_test!
      end
    end

    delete('Delete a movie') do
      tags 'Movies'
      produces 'application/json'

      response(204, 'movie deleted') do
        let(:id) { '1' }
        run_test!
      end
    end
  end
end

