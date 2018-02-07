class OrderExtra < ApplicationRecord
  belongs_to :order
  belongs_to :extra

  def as_json
    {
      extra: extra.as_json,
      quantity: quantity,
    }
  end
end
