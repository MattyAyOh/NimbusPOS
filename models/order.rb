class Order < ApplicationRecord
  belongs_to :service

  has_many :order_extras, dependent: :destroy
  has_many :extras, through: :order_extras

  validates :start_time, presence: true

  def self.open
    where(end_time: nil).or(where(cash_handled: nil))
  end

  def open?
    start_time.nil? || end_time.nil? || cash_handled.nil?
  end

  def as_json(*args)
    {
      cash_handled: cash_handled,
      end_time: end_time,
      extras: order_extras.map(&:as_json),
      start_time: start_time,
    }
  end
end
