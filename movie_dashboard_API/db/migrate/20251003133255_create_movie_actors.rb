class CreateMovieActors < ActiveRecord::Migration[8.0]
  def change
    create_table :movie_actors do |t|
      t.references :movie, null: false, foreign_key: true
      t.references :actor, null: false, foreign_key: true
      t.string :character_name
      t.integer :cast_order

      t.timestamps
    end
    
    add_index :movie_actors, [:movie_id, :actor_id], unique: true
    add_index :movie_actors, :cast_order
  end
end
