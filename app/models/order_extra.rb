class OrderExtra < ApplicationRecord
  belongs_to :order
  belongs_to :extra
end