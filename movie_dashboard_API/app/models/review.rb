class Review < ApplicationRecord
  # Associations
  belongs_to :movie

  # Validations
  validates :rating, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 10 }
  validates :content, presence: true, length: { minimum: 10 }
  validates :author_name, presence: true

  # Scopes
  scope :recent, -> { order(created_at: :desc) }
  scope :highest_rated, -> { order(rating: :desc) }
end
