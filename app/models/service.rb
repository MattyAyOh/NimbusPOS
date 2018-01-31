class Service < ApplicationRecord
  enum status: ["open", "occupied"]
  enum service_type: ["mahjong", "pool", "ktv"]

  has_many :orders
  has_many :sales

  def current_order
    orders.where(status: "open").first
  end

  def as_json
    {
      position: position,
      current_order: current_order.as_json
    }
  end
end
