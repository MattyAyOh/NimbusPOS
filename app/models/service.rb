class Service < ApplicationRecord
  enum service_type: ["mahjong", "pool", "ktv"]

  has_many :orders

  def current_order
    orders.open.first
  end

  def as_json
    {
      current_order: current_order.as_json,
      hourly_rate: hourly_rate,
      position: position,
      service: service_type,
    }
  end
end
