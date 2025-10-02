# Clear existing data (be careful in production!)
puts "Clearing existing data..."
MovieGenre.destroy_all
Review.destroy_all
Watchlist.destroy_all
Movie.destroy_all
Genre.destroy_all

puts "\n🎬 Seeding Movie Dashboard Database..."
puts "=" * 50

# Initialize TMDB Service
tmdb_service = TmdbService.new

# Step 1: Fetch and seed genres from TMDB
puts "\n1️⃣  Fetching genres from TMDB..."
genres_data = tmdb_service.fetch_genres

if genres_data && genres_data['genres']
  genres_data['genres'].each do |genre_data|
    Genre.find_or_create_by(tmdb_id: genre_data['id']) do |genre|
      genre.name = genre_data['name']
    end
  end
  puts "   ✅ Created #{Genre.count} genres"
else
  puts "   ⚠️  Could not fetch genres from TMDB"
end

# Step 2: Fetch and seed popular movies from TMDB
puts "\n2️⃣  Fetching popular movies from TMDB..."
puts "   (This may take a minute...)"

movies = tmdb_service.sync_popular_movies(2) # Fetch 2 pages (40 movies)

if movies.any?
  puts "   ✅ Synced #{movies.count} movies with genres"
else
  puts "   ⚠️  Could not sync movies from TMDB"
end

# Step 3: Create sample reviews for some movies
puts "\n3️⃣  Creating sample reviews..."

sample_reviews = [
  { content: "Absolutely fantastic! A must-watch movie with incredible storytelling.", rating: 10, author: "Alex Johnson" },
  { content: "Great movie with some minor pacing issues, but overall very entertaining.", rating: 8, author: "Sarah Miller" },
  { content: "Solid film. The cast was excellent and the plot kept me engaged throughout.", rating: 9, author: "Mike Davis" },
  { content: "Decent movie but didn't live up to the hype. Still worth a watch though.", rating: 7, author: "Emma Wilson" },
  { content: "One of the best films I've seen this year. Highly recommended!", rating: 10, author: "Chris Brown" }
]

Movie.limit(10).each do |movie|
  # Add 1-3 random reviews per movie
  rand(1..3).times do
    review_template = sample_reviews.sample
    Review.create(
      movie: movie,
      rating: review_template[:rating],
      content: review_template[:content],
      author_name: review_template[:author]
    )
  end
end

puts "   ✅ Created #{Review.count} sample reviews"

# Step 4: Create sample watchlist items
puts "\n4️⃣  Creating sample watchlist items..."

statuses = ['want_to_watch', 'watching', 'watched']
Movie.limit(15).each_with_index do |movie, index|
  Watchlist.create(
    movie: movie,
    status: statuses[index % 3],
    notes: "Added to my #{statuses[index % 3].humanize} list"
  )
end

puts "   ✅ Created #{Watchlist.count} watchlist items"

# Summary
puts "\n" + "=" * 50
puts "✅ Database seeding completed successfully!"
puts "=" * 50
puts "Summary:"
puts "  📁 Genres: #{Genre.count}"
puts "  🎬 Movies: #{Movie.count}"
puts "  🔗 Movie-Genre associations: #{MovieGenre.count}"
puts "  ⭐ Reviews: #{Review.count}"
puts "  📋 Watchlist items: #{Watchlist.count}"
puts "=" * 50

# Display some sample data
puts "\n📊 Sample Movies:"
Movie.limit(5).each do |movie|
  puts "  • #{movie.title} (#{movie.release_date&.year}) - Rating: #{movie.vote_average}/10"
end

puts "\n🎭 All Genres:"
Genre.all.each do |genre|
  puts "  • #{genre.name} (#{genre.movies.count} movies)"
end

puts "\n🎉 Ready to start the API!"
puts "Run: rails s"
