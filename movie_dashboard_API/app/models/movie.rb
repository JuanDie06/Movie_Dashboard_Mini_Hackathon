class Movie < ApplicationRecord
  # Associations
  has_many :movie_genres, dependent: :destroy
  has_many :genres, through: :movie_genres
  has_many :reviews, dependent: :destroy
  has_many :watchlists, dependent: :destroy

  # Validations
  validates :tmdb_id, presence: true, uniqueness: true
  validates :title, presence: true
  validates :vote_average, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 10 }, allow_nil: true

  # Scopes
  scope :recent, -> { order(release_date: :desc) }
  scope :popular, -> { order(vote_average: :desc, vote_count: :desc) }
end
