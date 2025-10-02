class CreateMovies < ActiveRecord::Migration[8.0]
  def change
    create_table :movies do |t|
      t.integer :tmdb_id
      t.string :title
      t.text :overview
      t.date :release_date
      t.string :poster_path
      t.string :backdrop_path
      t.decimal :vote_average
      t.integer :vote_count
      t.integer :runtime
      t.string :status

      t.timestamps
    end
    add_index :movies, :tmdb_id, unique: true
  end
end
