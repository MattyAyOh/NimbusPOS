class Service < ApplicationRecord
  enum status: ["open", "occupied"]
  enum service_type: ["mahjong", "pool", "ktv"]

  has_many :orders
  has_many :sales
end
