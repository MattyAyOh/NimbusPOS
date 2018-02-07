class Service < ApplicationRecord
  enum service_type: ["mahjong", "pool", "ktv"]

  has_many :orders

  def current_order
    orders.open.first
  end

  def as_json
    {
      service: service_type,
      position: position,
      current_order: current_order.as_json
    }
  end
end
