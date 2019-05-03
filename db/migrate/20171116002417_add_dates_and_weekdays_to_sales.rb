class AddDatesAndWeekdaysToSales < ActiveRecord::Migration[5.1]
  def change
    add_column :sales, :date, :date
    add_column :sales, :weekday, :string
  end
end
