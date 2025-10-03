class CreateActors < ActiveRecord::Migration[8.0]
  def change
    create_table :actors do |t|
      t.integer :tmdb_id
      t.string :name
      t.string :profile_path
      t.text :biography
      t.date :birthday
      t.date :deathday
      t.string :place_of_birth
      t.string :known_for_department
      t.decimal :popularity

      t.timestamps
    end
    add_index :actors, :tmdb_id, unique: true
  end
end
