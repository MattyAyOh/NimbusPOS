class Extra < ApplicationRecord
  enum extra_type: ["snack", "drink"]
  has_many :order_extras
  has_many :orders, through: :order_extras

  def image_url
    super ||
      "https://jpg.cool/#{name.downcase.gsub(" ", ".")}"
  end

  def as_json
    {
      image_url: image_url,
      name: name,
      price: price,
      extra_type: extra_type,
    }
  end
end
