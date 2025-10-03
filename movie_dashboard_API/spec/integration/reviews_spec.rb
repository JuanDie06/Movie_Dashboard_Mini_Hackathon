require 'swagger_helper'

RSpec.describe 'Reviews API', type: :request do

  path '/api/v1/reviews' do

    get('List all reviews') do
      tags 'Reviews'
      produces 'application/json'
      parameter name: :page, in: :query, type: :integer, description: 'Page number', required: false
      parameter name: :per_page, in: :query, type: :integer, description: 'Reviews per page', required: false

      response(200, 'successful') do
        schema type: :object,
          properties: {
            reviews: {
              type: :array,
              items: {
                type: :object,
                properties: {
                  id: { type: :integer },
                  movie_id: { type: :integer },
                  rating: { type: :integer, minimum: 1, maximum: 10 },
                  content: { type: :string },
                  author_name: { type: :string },
                  created_at: { type: :string, format: 'date-time' },
                  updated_at: { type: :string, format: 'date-time' },
                  movie: {
                    type: :object,
                    properties: {
                      id: { type: :integer },
                      title: { type: :string },
                      poster_path: { type: :string }
                    }
                  }
                }
              }
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

    post('Create a review') do
      tags 'Reviews'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :review, in: :body, schema: {
        type: :object,
        properties: {
          review: {
            type: :object,
            properties: {
              movie_id: { type: :integer },
              rating: { type: :integer, minimum: 1, maximum: 10 },
              content: { type: :string, minLength: 10 },
              author_name: { type: :string }
            },
            required: ['movie_id', 'rating', 'content', 'author_name']
          }
        }
      }

      response(201, 'review created') do
        let(:review) { 
          { 
            review: { 
              movie_id: 1, 
              rating: 8, 
              content: 'Great movie! Highly recommended.',
              author_name: 'John Doe'
            } 
          } 
        }
        run_test!
      end

      response(422, 'invalid request') do
        let(:review) { { review: { movie_id: 1, rating: 8 } } }
        run_test!
      end
    end
  end

  path '/api/v1/reviews/highest_rated' do
    
    get('Get highest rated reviews') do
      tags 'Reviews'
      produces 'application/json'
      description 'Returns reviews with rating 9 or 10, ordered by rating and date'

      response(200, 'successful') do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :integer },
              movie_id: { type: :integer },
              rating: { type: :integer },
              content: { type: :string },
              author_name: { type: :string },
              created_at: { type: :string, format: 'date-time' },
              movie: {
                type: :object,
                properties: {
                  id: { type: :integer },
                  title: { type: :string }
                }
              }
            }
          }

        run_test!
      end
    end
  end

  path '/api/v1/reviews/{id}' do
    parameter name: 'id', in: :path, type: :integer, description: 'Review ID'

    get('Show review details') do
      tags 'Reviews'
      produces 'application/json'

      response(200, 'successful') do
        schema type: :object,
          properties: {
            id: { type: :integer },
            movie_id: { type: :integer },
            rating: { type: :integer },
            content: { type: :string },
            author_name: { type: :string },
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

    put('Update a review') do
      tags 'Reviews'
      consumes 'application/json'
      produces 'application/json'
      parameter name: :review, in: :body, schema: {
        type: :object,
        properties: {
          review: {
            type: :object,
            properties: {
              rating: { type: :integer, minimum: 1, maximum: 10 },
              content: { type: :string }
            }
          }
        }
      }

      response(200, 'review updated') do
        let(:id) { '1' }
        let(:review) { { review: { rating: 9, content: 'Updated review' } } }
        run_test!
      end
    end

    delete('Delete a review') do
      tags 'Reviews'
      produces 'application/json'

      response(204, 'review deleted') do
        let(:id) { '1' }
        run_test!
      end
    end
  end

  path '/api/v1/movies/{movie_id}/reviews' do
    parameter name: 'movie_id', in: :path, type: :integer, description: 'Movie ID'

    get('Get all reviews for a movie') do
      tags 'Reviews'
      produces 'application/json'
      description 'Returns all reviews for a specific movie'

      response(200, 'successful') do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :integer },
              rating: { type: :integer },
              content: { type: :string },
              author_name: { type: :string },
              created_at: { type: :string, format: 'date-time' }
            }
          }

        let(:movie_id) { '1' }
        run_test!
      end

      response(404, 'movie not found') do
        let(:movie_id) { 'invalid' }
        run_test!
      end
    end
  end
end

