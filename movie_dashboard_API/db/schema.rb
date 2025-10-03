# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_10_03_133255) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "actors", force: :cascade do |t|
    t.integer "tmdb_id"
    t.string "name"
    t.string "profile_path"
    t.text "biography"
    t.date "birthday"
    t.date "deathday"
    t.string "place_of_birth"
    t.string "known_for_department"
    t.decimal "popularity"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tmdb_id"], name: "index_actors_on_tmdb_id", unique: true
  end

  create_table "genres", force: :cascade do |t|
    t.integer "tmdb_id"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tmdb_id"], name: "index_genres_on_tmdb_id", unique: true
  end

  create_table "movie_actors", force: :cascade do |t|
    t.bigint "movie_id", null: false
    t.bigint "actor_id", null: false
    t.string "character_name"
    t.integer "cast_order"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["actor_id"], name: "index_movie_actors_on_actor_id"
    t.index ["cast_order"], name: "index_movie_actors_on_cast_order"
    t.index ["movie_id", "actor_id"], name: "index_movie_actors_on_movie_id_and_actor_id", unique: true
    t.index ["movie_id"], name: "index_movie_actors_on_movie_id"
  end

  create_table "movie_genres", force: :cascade do |t|
    t.bigint "movie_id", null: false
    t.bigint "genre_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["genre_id"], name: "index_movie_genres_on_genre_id"
    t.index ["movie_id"], name: "index_movie_genres_on_movie_id"
  end

  create_table "movies", force: :cascade do |t|
    t.integer "tmdb_id"
    t.string "title"
    t.text "overview"
    t.date "release_date"
    t.string "poster_path"
    t.string "backdrop_path"
    t.decimal "vote_average"
    t.integer "vote_count"
    t.integer "runtime"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tmdb_id"], name: "index_movies_on_tmdb_id", unique: true
  end

  create_table "reviews", force: :cascade do |t|
    t.bigint "movie_id", null: false
    t.integer "rating"
    t.text "content"
    t.string "author_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["movie_id"], name: "index_reviews_on_movie_id"
  end

  create_table "watchlists", force: :cascade do |t|
    t.bigint "movie_id", null: false
    t.string "status"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["movie_id"], name: "index_watchlists_on_movie_id"
  end

  add_foreign_key "movie_actors", "actors"
  add_foreign_key "movie_actors", "movies"
  add_foreign_key "movie_genres", "genres"
  add_foreign_key "movie_genres", "movies"
  add_foreign_key "reviews", "movies"
  add_foreign_key "watchlists", "movies"
end
