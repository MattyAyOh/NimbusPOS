class CreateServices < ActiveRecord::Migration[5.1]
  def change
    create_table :services do |t|
      t.string :name
      t.integer :status, default: 0
      t.integer :hourly_rate
    end
  end
end
