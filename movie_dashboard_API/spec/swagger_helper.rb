# frozen_string_literal: true

require 'rails_helper'

RSpec.configure do |config|
  # Specify a root folder where Swagger JSON files are generated
  # NOTE: If you're using the rswag-api to serve API descriptions, you'll need
  # to ensure that it's configured to serve Swagger from the same folder
  config.openapi_root = Rails.root.join('swagger').to_s

  # Define one or more Swagger documents and provide global metadata for each one
  # When you run the 'rswag:specs:swaggerize' rake task, the complete Swagger will
  # be generated at the provided relative path under openapi_root
  # By default, the operations defined in spec files are added to the first
  # document below. You can override this behavior by adding a openapi_spec tag to the
  # the root example_group in your specs, e.g. describe '...', openapi_spec: 'v2/swagger.json'
  config.openapi_specs = {
    'v1/swagger.yaml' => {
      openapi: '3.0.1',
      info: {
        title: 'Movie Dashboard API',
        version: 'v1',
        description: 'Full-stack movie dashboard application API integrating with TMDB. Provides CRUD operations for Movies, Genres, Reviews, Watchlists, and Actors.'
      },
      paths: {},
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        },
        {
          url: 'https://{defaultHost}',
          variables: {
            defaultHost: {
              default: 'api.moviedashboard.com'
            }
          },
          description: 'Production server'
        }
      ],
      components: {
        schemas: {
          Movie: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              tmdb_id: { type: 'integer' },
              title: { type: 'string' },
              overview: { type: 'string' },
              release_date: { type: 'string', format: 'date' },
              poster_path: { type: 'string' },
              backdrop_path: { type: 'string' },
              vote_average: { type: 'number', format: 'float' },
              vote_count: { type: 'integer' },
              runtime: { type: 'integer' },
              status: { type: 'string' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' }
            },
            required: ['title', 'tmdb_id']
          },
          Actor: {
            type: 'object',
            properties: {
              id: { type: 'integer' },
              tmdb_id: { type: 'integer' },
              name: { type: 'string' },
              profile_path: { type: 'string' },
              biography: { type: 'string' },
              birthday: { type: 'string', format: 'date' },
              deathday: { type: 'string', format: 'date' },
              place_of_birth: { type: 'string' },
              known_for_department: { type: 'string' },
              popularity: { type: 'number', format: 'float' },
              thumbnail_url: { type: 'string', description: 'Computed thumbnail URL from profile_path' },
              profile_url: { type: 'string', description: 'Computed full profile URL from profile_path' },
              age: { type: 'integer', description: 'Calculated age or age at death' },
              alive: { type: 'boolean', description: 'Whether the actor is alive' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' }
            },
            required: ['name', 'tmdb_id']
          }
        }
      }
    }
  }

  # Specify the format of the output Swagger file when running 'rswag:specs:swaggerize'.
  # The openapi_specs configuration option has the filename including format in
  # the key, this may want to be changed to avoid putting yaml in json files.
  # Defaults to json. Accepts ':json' and ':yaml'.
  config.openapi_format = :yaml
end
