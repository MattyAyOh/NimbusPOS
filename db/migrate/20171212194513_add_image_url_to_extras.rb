class AddImageUrlToExtras < ActiveRecord::Migration[5.1]
  def change
    add_column :extras, :image_url, :string
  end
end
