class AddActiveToExtras < ActiveRecord::Migration[5.1]
  def change
    add_column :extras, :active, :boolean, default: true
  end
end
