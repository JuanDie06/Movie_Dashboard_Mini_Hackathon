class Actor < ApplicationRecord
  # Associations
  has_many :movie_actors, dependent: :destroy
  has_many :movies, through: :movie_actors
  
  # Validations
  validates :name, presence: true
  validates :tmdb_id, presence: true, uniqueness: true, numericality: { only_integer: true }
  validates :popularity, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  
  # Scopes
  scope :popular, -> { order(popularity: :desc) }
  scope :by_name, -> { order(:name) }
  scope :with_biography, -> { where.not(biography: [nil, '']) }
  
  # Instance methods
  def age
    return nil unless birthday
    return calculate_age_at_death if deathday
    
    calculate_age(birthday, Date.today)
  end
  
  def alive?
    deathday.nil?
  end
  
  def profile_url
    return nil unless profile_path
    "https://image.tmdb.org/t/p/original#{profile_path}"
  end
  
  def thumbnail_url
    return nil unless profile_path
    "https://image.tmdb.org/t/p/w185#{profile_path}"
  end
  
  # Class methods
  def self.search(query)
    where('name ILIKE ?', "%#{query}%")
  end
  
  private
  
  def calculate_age_at_death
    return nil unless birthday && deathday
    calculate_age(birthday, deathday)
  end
  
  def calculate_age(from_date, to_date)
    age = to_date.year - from_date.year
    age -= 1 if to_date < from_date + age.years
    age
  end
end

