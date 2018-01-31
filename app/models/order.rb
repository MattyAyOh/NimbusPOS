class Order < ApplicationRecord
  belongs_to :service
  has_one :sale

  has_many :snack_order_extras,
    -> { joins(:extra).where('extras.extra_type' => 'snack').group('order_extras.id') },
    class_name: 'OrderExtra',
    inverse_of: :order

  has_many :drink_order_extras,
    -> { joins(:extra).where('extras.extra_type' => 'drink').group('order_extras.id') },
    class_name: 'OrderExtra',
    inverse_of: :order

  has_many :extras, through: :order_extras

  accepts_nested_attributes_for :snack_order_extras, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :drink_order_extras, reject_if: :all_blank, allow_destroy: true

  enum status: ["open", "closed"]

  before_save :offset_day_of_end_time, if: :end_time_changed?

  def as_json
    {
      start_time: start_time,
      end_time: end_time,
      accumulated_cost: total_service_cost,
    }
  end

  def order_extras
    snack_order_extras | drink_order_extras
  end

  def end_time
    super || Time.current
  end

  def time_difference
    if start_time.nil? || end_time.nil?
      0
    else
      ((end_time - start_time) / 3600.to_f).round(2)
    end
  end

  def total_service_cost
    service.hourly_rate * time_difference
  end

  def total_extras_cost
    order_extras
      .select { |order_extra| order_extra.quantity && order_extra.quantity > 0 }
      .map { |order_extra| order_extra.price * order_extra.quantity }
      .sum
  end

  def apply_discount
    if end_time.nil?
      1
    elsif (0..4).include?(start_time.strftime('%w').to_i)
      0.8
    else
      1
    end
  end

  def total_bill
    ((previous_cost + total_extras_cost + (total_service_cost * apply_discount))).round(2)
  end

  private

  def offset_day_of_end_time
    self.end_time += 1.day if time_difference.negative?
  end

end
