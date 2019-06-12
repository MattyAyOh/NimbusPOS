class Service < ApplicationRecord
  enum service_type: ["mahjong", "pool", "ktv"]

  has_many :orders

  def as_json(*args)
    {
      id: id,
      hourly_rate: hourly_rate,
      name: name,
      position: position,
      service: service_type,
    }
  end
end
