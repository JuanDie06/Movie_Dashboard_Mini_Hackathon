class Watchlist < ApplicationRecord
  # Associations
  belongs_to :movie

  # Validations
  validates :status, presence: true, inclusion: { in: %w[want_to_watch watching watched] }
  validates :movie_id, uniqueness: { message: "is already in your watchlist. Update the existing entry instead." }

  # Scopes
  scope :want_to_watch, -> { where(status: 'want_to_watch') }
  scope :watching, -> { where(status: 'watching') }
  scope :watched, -> { where(status: 'watched') }
  scope :recent, -> { order(created_at: :desc) }
end
