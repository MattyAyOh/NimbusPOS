class RemoveUnnecessaryColumns < ActiveRecord::Migration[5.1]
  def change
    remove_column :services, :status, :integer, default: 0
    remove_column :order_extras, :price, :integer
    remove_column :orders, :total_time, :float
    remove_column :orders, :services_cost, :float
    remove_column :orders, :extras_cost, :float
    remove_column :orders, :total_cost, :float
    remove_column :orders, :status, :integer, default: 0
  end
end
