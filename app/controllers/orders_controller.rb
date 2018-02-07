class OrdersController < ApplicationController
  skip_before_action :verify_authenticity_token, only: :update

  def update
    service = Service.find_by(
      name: params[:params][:service].titlecase,
      position: params[:params][:number],
    )

    order = service.current_order || Order.create!(service: service)
    extra = Extra.find_by(name: params[:params][:extra_name])

    order_extra =
      OrderExtra.find_by(order: order, extra: extra) ||
      OrderExtra.create!(order: order, extra: extra)

    result = order_extra.update(
      params.require(:state).permit(:quantity)
    )

    render json: { persisted: result }
  end

  def destroy
    @order = Order.find(params[:id])
    @order.order_extras.destroy_all
    @order.destroy
    @order.service.open!
    flash[:info] = "Order has been cancelled"
    redirect_to services_path
  end

  private

  def order_params
    params.require(:order).permit(
      :start_time,
      :end_time,
      :previous_cost,
    )
  end
end
