class Reservation < ApplicationRecord
  belongs_to :service

  def as_json(*args)
    {
      id: id,
      service_name: service.name,
      service_position: service.position,
      start_time: start_time,
      end_time: end_time,
    }
  end
end
