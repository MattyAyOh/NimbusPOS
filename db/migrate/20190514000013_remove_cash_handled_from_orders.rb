class RemoveCashHandledFromOrders < ActiveRecord::Migration[5.1]
  def change
    remove_column :orders, :cash_handled, :float
    remove_column :orders, :previous_cost, :float, default: 0.0
    add_column :orders, :closed_at, :timestamp
  end
end
