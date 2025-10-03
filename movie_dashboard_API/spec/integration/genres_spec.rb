require 'swagger_helper'

RSpec.describe 'Genres API', type: :request do

  path '/api/v1/genres' do

    get('List all genres') do
      tags 'Genres'
      produces 'application/json'

      response(200, 'successful') do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :integer },
              tmdb_id: { type: :integer },
              name: { type: :string },
              movies_count: { type: :integer },
              created_at: { type: :string, format: 'date-time' },
              updated_at: { type: :string, format: 'date-time' }
            }
          }

        run_test!
      end
    end

    post('Create a genre') do
      tags 'Genres'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :genre, in: :body, schema: {
        type: :object,
        properties: {
          genre: {
            type: :object,
            properties: {
              tmdb_id: { type: :integer },
              name: { type: :string }
            },
            required: ['name', 'tmdb_id']
          }
        }
      }

      response(201, 'genre created') do
        let(:genre) { { genre: { name: 'Test Genre', tmdb_id: 99 } } }
        run_test!
      end

      response(422, 'invalid request') do
        let(:genre) { { genre: { name: '' } } }
        run_test!
      end
    end
  end

  path '/api/v1/genres/{id}' do
    parameter name: 'id', in: :path, type: :integer, description: 'Genre ID'

    get('Show genre details') do
      tags 'Genres'
      produces 'application/json'

      response(200, 'successful') do
        schema type: :object,
          properties: {
            id: { type: :integer },
            tmdb_id: { type: :integer },
            name: { type: :string },
            movies_count: { type: :integer },
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

    put('Update a genre') do
      tags 'Genres'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :genre, in: :body, schema: {
        type: :object,
        properties: {
          genre: {
            type: :object,
            properties: {
              name: { type: :string },
              tmdb_id: { type: :integer }
            }
          }
        }
      }

      response(200, 'genre updated') do
        let(:id) { '1' }
        let(:genre) { { genre: { name: 'Updated Genre' } } }
        run_test!
      end
    end

    delete('Delete a genre') do
      tags 'Genres'
      produces 'application/json'

      response(204, 'genre deleted') do
        let(:id) { '1' }
        run_test!
      end
    end
  end

  path '/api/v1/genres/{id}/movies' do
    parameter name: 'id', in: :path, type: :integer, description: 'Genre ID'

    get('Get all movies for a genre') do
      tags 'Genres'
      produces 'application/json'
      description 'Returns all movies that belong to a specific genre'

      response(200, 'successful') do
        schema type: :object,
          properties: {
            genre: {
              type: :object,
              properties: {
                id: { type: :integer },
                name: { type: :string }
              }
            },
            movies: {
              type: :array,
              items: { '$ref' => '#/components/schemas/Movie' }
            }
          }

        let(:id) { '1' }
        run_test!
      end

      response(404, 'genre not found') do
        let(:id) { 'invalid' }
        run_test!
      end
    end
  end
end

