class CreateSales < ActiveRecord::Migration[5.1]
  def change
    create_table :sales do |t|
      t.float :cash_handled
      t.references :service, foreign_key: true
      t.references :order, foreign_key: true

      t.timestamps
    end
  end
end
