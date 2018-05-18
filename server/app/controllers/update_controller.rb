class UpdateController < ApplicationController
  skip_before_action :verify_authenticity_token

  def order
    service = Service.find_by(
      service_type: params[:params][:service],
      position: params[:params][:number],
    )

    order = service.current_order || Order.create!(service: service)

    result = order.update!(
      params.require(:state).permit(:start_time, :end_time, :cash_handled)
    )

    render json: { persisted: result, closed: !order.open? }
  end

  def order_extra
    service = Service.find_by(
      service_type: params[:params][:service],
      position: params[:params][:number],
    )

    order = service.current_order || Order.create!(service: service)
    extra = Extra.find_by(name: params[:params][:extra_name])

    order_extra =
      OrderExtra.find_by(order: order, extra: extra) ||
      OrderExtra.create!(order: order, extra: extra)

    if(params[:state][:quantity].to_i > 0)
      result = order_extra.update!(
        params.require(:state).permit(:quantity)
      )
    else
      order_extra.destroy!
    end

    render json: { persisted: result }
  end
end
