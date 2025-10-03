class MovieActor < ApplicationRecord
  # Associations
  belongs_to :movie
  belongs_to :actor
  
  # Validations
  validates :movie_id, uniqueness: { scope: :actor_id, message: "Actor already associated with this movie" }
  validates :cast_order, numericality: { only_integer: true, greater_than_or_equal_to: 0 }, allow_nil: true
  
  # Scopes
  default_scope { order(cast_order: :asc) }
  scope :top_billed, -> { where('cast_order < ?', 10) }
  scope :with_character, -> { where.not(character_name: [nil, '']) }
end

