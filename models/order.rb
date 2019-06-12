class Order < ApplicationRecord
  belongs_to :service

  has_many :order_extras, dependent: :destroy
  has_many :extras, through: :order_extras

  validates :start_time, presence: true

  def self.open
    where(closed_at: nil)
  end

  def open?
    closed_at.nil?
  end

  def as_json(*args)
    {
      id: id,
      service_id: service_id,
      closed_at: closed_at,
      end_time: end_time,
      extras: order_extras.map(&:as_json),
      start_time: start_time,
    }
  end
end
