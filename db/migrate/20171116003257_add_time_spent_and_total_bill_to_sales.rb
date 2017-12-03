class AddTimeSpentAndTotalBillToSales < ActiveRecord::Migration[5.1]
  def change
    add_column :sales, :time_spent, :float
    add_column :sales, :total_bill, :float
  end
end
