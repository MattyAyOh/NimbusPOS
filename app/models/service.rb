class Service < ApplicationRecord
  enum status: ["open", "occupied"]
  has_many :orders
  has_many :sales
end