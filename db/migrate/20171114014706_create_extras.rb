class CreateExtras < ActiveRecord::Migration[5.1]
  def change
    create_table :extras do |t|
      t.string :name
      t.integer :price
      t.integer :extra_type, default: 0
    end
  end
end
