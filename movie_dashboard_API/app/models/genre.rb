class Genre < ApplicationRecord
  # Associations
  has_many :movie_genres, dependent: :destroy
  has_many :movies, through: :movie_genres

  # Validations
  validates :name, presence: true
  validates :tmdb_id, uniqueness: true, allow_nil: true
end
