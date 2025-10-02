class CreateReviews < ActiveRecord::Migration[8.0]
  def change
    create_table :reviews do |t|
      t.references :movie, null: false, foreign_key: true
      t.integer :rating
      t.text :content
      t.string :author_name

      t.timestamps
    end
  end
end
