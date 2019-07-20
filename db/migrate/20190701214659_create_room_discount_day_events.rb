class CreateRoomDiscountDayEvents < ActiveRecord::Migration[5.1]
  def change
    create_table :room_discount_day_events do |t|
      t.integer :day_of_week, null: false
      t.timestamps
    end
  end
end
