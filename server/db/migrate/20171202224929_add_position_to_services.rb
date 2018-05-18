class AddPositionToServices < ActiveRecord::Migration[5.1]
  def change
    add_column :services, :position, :integer
  end
end
