require "ostruct"

class Extra < OpenStruct; end
class Service < OpenStruct; end
class Order < OpenStruct; end
class RoomPricingEvent < OpenStruct; end

FactoryBot.define do
  to_create { |instance| instance.persist! }

  factory :service do
    name { "Mahjong" }
    hourly_rate { 10 }
    position { 1 }
    service_type { :mahjong }
  end

  factory :order, class: Extra do
  end

  factory :snack, class: Extra do
  end

  factory :room_pricing_event do
  end
end
