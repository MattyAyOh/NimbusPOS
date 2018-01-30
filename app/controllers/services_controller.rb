class ServicesController < ApplicationController
  def index
    @mahjong_services = Service.where(service_type: "mahjong").order(:position)
    @ktv_services = Service.where(service_type: "ktv").order(:position)
    @pool_services = Service.where(service_type: "pool").order(:position)
  end
end
