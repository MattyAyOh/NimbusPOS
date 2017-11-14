class CreateOrders < ActiveRecord::Migration[5.1]
  def change
    create_table :orders do |t|
      t.references :service, foreign_key: true
      t.datetime :start_time
      t.datetime :end_time
      t.float :total_time
      t.float :services_cost
      t.float :extras_cost
      t.float :previous_cost, default: 0
      t.float :total_cost
    end
  end
end
