class CreateWatchlists < ActiveRecord::Migration[8.0]
  def change
    create_table :watchlists do |t|
      t.references :movie, null: false, foreign_key: true
      t.string :status
      t.text :notes

      t.timestamps
    end
  end
end
