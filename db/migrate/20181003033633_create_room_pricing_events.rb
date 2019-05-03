class CreateRoomPricingEvents < ActiveRecord::Migration[5.1]
  def change
    create_table :room_pricing_events do |t|
      t.float :pricing_factor

      t.timestamps
    end
  end
end
