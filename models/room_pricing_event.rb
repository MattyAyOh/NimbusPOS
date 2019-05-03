class RoomPricingEvent < ApplicationRecord
  validates :pricing_factor, presence: true
end
