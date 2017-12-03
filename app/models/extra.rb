class Extra < ApplicationRecord
  enum extra_type: ["snack", "drink"]
  has_many :order_extras
  has_many :orders, through: :order_extras
end