class DestroyController < ApplicationController
  skip_before_action :verify_authenticity_token

  def order
    service = Service.find_by(
      service_type: params[:params][:service],
      position: params[:params][:number],
    )

    render json: service.current_order.destroy!.as_json
  end
end
