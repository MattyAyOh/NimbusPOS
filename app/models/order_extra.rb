class OrderExtra < ApplicationRecord
  belongs_to :order
  belongs_to :extra

  def self.set_price
    @order.order_extras.map do |f|
      f.price = Extra.find(f.extra_id).price
    end
  end

  def as_json
    {
      extra: extra.as_json,
      quantity: quantity,
      price: price,
    }
  end
end
