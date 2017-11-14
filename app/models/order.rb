class Order < ApplicationRecord
  belongs_to :service
  has_many :order_extras, inverse_of: :order
  has_many :extras, through: :order_extras
  accepts_nested_attributes_for :order_extras, reject_if: :all_blank, allow_destroy: true
end