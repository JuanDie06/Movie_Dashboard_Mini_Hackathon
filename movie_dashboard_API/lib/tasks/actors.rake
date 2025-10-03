namespace :actors do
  desc "Seed actors from TMDB popular actors"
  task seed: :environment do
    puts "🎬 Starting actors seeding from TMDB..."
    
    service = TmdbService.new
    pages = ENV['PAGES'] ? ENV['PAGES'].to_i : 3
    limit_per_page = ENV['LIMIT'] ? ENV['LIMIT'].to_i : 20
    
    puts "📥 Fetching #{pages} pages of popular actors (#{limit_per_page} per page)..."
    
    synced_actors = service.sync_popular_actors(pages, limit_per_page: limit_per_page)
    
    if synced_actors.any?
      puts "✅ Successfully synced #{synced_actors.count} actors!"
      puts "\n📊 Sample actors:"
      synced_actors.first(5).each do |actor|
        puts "  • #{actor.name} (Popularity: #{actor.popularity})"
      end
    else
      puts "❌ No actors were synced. Check your TMDB API key and connection."
    end
    
    puts "\n📈 Total actors in database: #{Actor.count}"
  end
  
  desc "Sync cast for all existing movies"
  task sync_cast: :environment do
    puts "🎬 Syncing cast for all movies..."
    
    service = TmdbService.new
    movies = Movie.all
    limit = ENV['LIMIT'] ? ENV['LIMIT'].to_i : 20
    
    total = movies.count
    success = 0
    failed = 0
    
    movies.each_with_index do |movie, index|
      print "\r[#{index + 1}/#{total}] Processing: #{movie.title.truncate(40)}..."
      
      begin
        service.sync_movie_cast(movie, limit: limit)
        success += 1
      rescue => e
        failed += 1
        puts "\n⚠️  Failed to sync cast for #{movie.title}: #{e.message}"
      end
      
      # Rate limiting: sleep briefly between requests to avoid TMDB rate limits
      sleep(0.3) if (index + 1) % 10 == 0
    end
    
    puts "\n\n✅ Completed!"
    puts "   Success: #{success}"
    puts "   Failed: #{failed}"
    puts "   Total actors: #{Actor.count}"
    puts "   Total movie-actor relationships: #{MovieActor.count}"
  end
  
  desc "Sync cast for a specific movie by ID"
  task :sync_movie_cast, [:movie_id] => :environment do |t, args|
    movie_id = args[:movie_id] || ENV['MOVIE_ID']
    
    unless movie_id
      puts "❌ Please provide a movie ID: rake actors:sync_movie_cast[123] or MOVIE_ID=123 rake actors:sync_movie_cast"
      exit
    end
    
    movie = Movie.find_by(id: movie_id)
    
    unless movie
      puts "❌ Movie with ID #{movie_id} not found"
      exit
    end
    
    puts "🎬 Syncing cast for: #{movie.title}"
    
    service = TmdbService.new
    limit = ENV['LIMIT'] ? ENV['LIMIT'].to_i : 20
    
    service.sync_movie_cast(movie, limit: limit)
    
    puts "✅ Cast synced successfully!"
    puts "   Actors in cast: #{movie.actors.count}"
    
    puts "\n👥 Top cast:"
    movie.movie_actors.limit(10).each do |ma|
      puts "  • #{ma.actor.name} as #{ma.character_name}"
    end
  end
  
  desc "Clean up actors with no movie associations"
  task cleanup_orphans: :environment do
    puts "🧹 Cleaning up orphaned actors..."
    
    orphans = Actor.left_joins(:movie_actors).where(movie_actors: { id: nil })
    count = orphans.count
    
    if count.zero?
      puts "✅ No orphaned actors found!"
    else
      puts "🗑️  Found #{count} orphaned actors"
      orphans.destroy_all
      puts "✅ Cleanup complete!"
    end
    
    puts "\n📈 Remaining actors: #{Actor.count}"
  end
end

