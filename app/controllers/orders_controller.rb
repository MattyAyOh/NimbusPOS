class OrdersController < ApplicationController
  skip_before_action :verify_authenticity_token, only: :update

  def show
    @order = Order.find(params[:id])
    @sale = @order.sale || @order.build_sale
  end

  def create
    @service = Service.find(params[:service_id])
    @order = @service.orders.create(order_params)
    @order.open!
    @service.occupied!
    @order.save!

    redirect_to service_order_path(@service, @order)
  end

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
      snack_order_extras_attributes: [:id, :quantity, :extra_id, :_destroy],
      drink_order_extras_attributes: [:id, :quantity, :extra_id, :_destroy],
    )
  end
end
