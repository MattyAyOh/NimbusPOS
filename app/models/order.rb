class Order < ApplicationRecord
  belongs_to :service

  has_many :order_extras, dependent: :destroy
  has_many :extras, through: :order_extras

  before_save :offset_day_of_end_time, if: :end_time_changed?

  validates :start_time, presence: true

  def self.open
    where(end_time: nil).or(where(cash_handled: nil))
  end

  def as_json
    {
      cash_handled: cash_handled,
      end_time: end_time,
      extras: order_extras.map(&:as_json),
      start_time: start_time,
    }
  end

  def end_time
    super
  end

  def hours_spent
    ((end_time || Time.current) - start_time) / 3600.to_f
  end

  private

  def offset_day_of_end_time
    self.end_time += 1.day if hours_spent.negative?
  end
end
