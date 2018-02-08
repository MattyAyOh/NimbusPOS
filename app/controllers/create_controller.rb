class CreateController < ApplicationController
  skip_before_action :verify_authenticity_token

  def order
    service = Service.find_by(
      service_type: params[:params][:service],
      position: params[:params][:position],
    )

    order = service.current_order ||
      service.orders.create!(start_time: Time.current)

    render json: order.as_json
  end
end
