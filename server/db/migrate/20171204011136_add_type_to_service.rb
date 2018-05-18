class AddTypeToService < ActiveRecord::Migration[5.1]
  def change
    add_column :services, :service_type, :integer, default: 0
  end
end
