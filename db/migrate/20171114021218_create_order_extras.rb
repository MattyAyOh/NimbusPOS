class CreateOrderExtras < ActiveRecord::Migration[5.1]
  def change
    create_table :order_extras do |t|
      t.references :order, foreign_key: true
      t.references :extra, foreign_key: true
      t.integer :quantity
      t.integer :price
    end
  end
end
