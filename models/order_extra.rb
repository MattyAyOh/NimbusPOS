class OrderExtra < ApplicationRecord
  belongs_to :order
  belongs_to :extra

  def as_json(*args)
    {
      extra: extra.as_json,
      quantity: quantity,
    }
  end
end
