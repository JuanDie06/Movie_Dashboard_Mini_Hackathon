require 'swagger_helper'

RSpec.describe 'Actors API', type: :request do
  path '/api/v1/actors' do
    get 'List all actors' do
      tags 'Actors'
      produces 'application/json'
      parameter name: :page, in: :query, type: :integer, description: 'Page number', required: false
      parameter name: :per_page, in: :query, type: :integer, description: 'Actors per page', required: false
      parameter name: :search, in: :query, type: :string, description: 'Search by actor name', required: false
      parameter name: :sort_by, in: :query, type: :string, description: 'Sort by: popularity or name', required: false, enum: ['popularity', 'name']

      response '200', 'successful' do
        schema type: :object,
               properties: {
                 actors: {
                   type: :array,
                   items: { '$ref' => '#/components/schemas/Actor' }
                 },
                 pagination: {
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

    post 'Create an actor' do
      tags 'Actors'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :actor, in: :body, schema: {
        type: :object,
        properties: {
          actor: {
            type: :object,
            properties: {
              tmdb_id: { type: :integer },
              name: { type: :string },
              profile_path: { type: :string },
              biography: { type: :string },
              birthday: { type: :string, format: 'date' },
              deathday: { type: :string, format: 'date' },
              place_of_birth: { type: :string },
              known_for_department: { type: :string },
              popularity: { type: :number, format: 'float' }
            },
            required: ['tmdb_id', 'name']
          }
        },
        required: ['actor']
      }

      response '201', 'actor created' do
        let(:actor) { { actor: { tmdb_id: 12345, name: 'Test Actor' } } }
        run_test!
      end

      response '422', 'invalid request' do
        let(:actor) { { actor: { name: '' } } }
        run_test!
      end
    end
  end

  path '/api/v1/actors/popular' do
    get 'List popular actors' do
      tags 'Actors'
      produces 'application/json'
      parameter name: :per_page, in: :query, type: :integer, description: 'Number of actors to return', required: false

      response '200', 'successful' do
        schema type: :object,
               properties: {
                 actors: {
                   type: :array,
                   items: { '$ref' => '#/components/schemas/Actor' }
                 }
               }

        run_test!
      end
    end
  end

  path '/api/v1/actors/{id}' do
    parameter name: :id, in: :path, type: :string, description: 'Actor ID'

    get 'Retrieve an actor' do
      tags 'Actors'
      produces 'application/json'

      response '200', 'actor found' do
        schema '$ref' => '#/components/schemas/Actor'
        let(:id) { Actor.create(tmdb_id: 12345, name: 'Test Actor').id }
        run_test!
      end

      response '404', 'actor not found' do
        let(:id) { 'invalid' }
        run_test!
      end
    end

    put 'Update an actor' do
      tags 'Actors'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :actor, in: :body, schema: {
        type: :object,
        properties: {
          actor: {
            type: :object,
            properties: {
              name: { type: :string },
              profile_path: { type: :string },
              biography: { type: :string },
              birthday: { type: :string, format: 'date' },
              deathday: { type: :string, format: 'date' },
              place_of_birth: { type: :string },
              known_for_department: { type: :string },
              popularity: { type: :number, format: 'float' }
            }
          }
        },
        required: ['actor']
      }

      response '200', 'actor updated' do
        let(:id) { Actor.create(tmdb_id: 12345, name: 'Test Actor').id }
        let(:actor) { { actor: { name: 'Updated Name' } } }
        run_test!
      end

      response '404', 'actor not found' do
        let(:id) { 'invalid' }
        let(:actor) { { actor: { name: 'Updated Name' } } }
        run_test!
      end

      response '422', 'invalid request' do
        let(:id) { Actor.create(tmdb_id: 12345, name: 'Test Actor').id }
        let(:actor) { { actor: { name: '' } } }
        run_test!
      end
    end

    delete 'Delete an actor' do
      tags 'Actors'
      produces 'application/json'

      response '204', 'actor deleted' do
        let(:id) { Actor.create(tmdb_id: 12345, name: 'Test Actor').id }
        run_test!
      end

      response '404', 'actor not found' do
        let(:id) { 'invalid' }
        run_test!
      end
    end
  end

  path '/api/v1/actors/{id}/movies' do
    parameter name: :id, in: :path, type: :string, description: 'Actor ID'

    get "Retrieve an actor's movies" do
      tags 'Actors'
      produces 'application/json'
      description 'Get all movies featuring the specified actor, including their character names and cast order'

      response '200', 'movies found' do
        schema type: :array,
               items: {
                 type: :object,
                 properties: {
                   id: { type: :integer },
                   title: { type: :string },
                   poster_path: { type: :string },
                   backdrop_path: { type: :string },
                   release_date: { type: :string, format: 'date' },
                   vote_average: { type: :number, format: 'float' },
                   genres: {
                     type: :array,
                     items: {
                       type: :object,
                       properties: {
                         id: { type: :integer },
                         name: { type: :string }
                       }
                     }
                   },
                   movie_actors: {
                     type: :array,
                     items: {
                       type: :object,
                       properties: {
                         character_name: { type: :string },
                         cast_order: { type: :integer }
                       }
                     }
                   }
                 }
               }

        let(:id) { Actor.create(tmdb_id: 12345, name: 'Test Actor').id }
        run_test!
      end

      response '404', 'actor not found' do
        let(:id) { 'invalid' }
        run_test!
      end
    end
  end
end

