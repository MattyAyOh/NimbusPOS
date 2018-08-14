class CreateReservations < ActiveRecord::Migration[5.1]
  def change
    create_table :reservations do |t|
      t.datetime :start_time, null: false
      t.datetime :end_time, null: false
      t.belongs_to :service, foreign_key: true, null: false

      t.timestamps
    end
  end
end
