class DropSales < ActiveRecord::Migration[5.1]
  def change
    drop_table :sales do |t|
      # Original columns
      t.float :cash_handled
      t.references :service, foreign_key: true
      t.references :order, foreign_key: true

      # Columns added after creation
      t.date :date
      t.string :weekday
      t.float :time_spent
      t.float :total_bill

      t.timestamps
    end

    add_column :orders, :cash_handled, :float
  end
end
