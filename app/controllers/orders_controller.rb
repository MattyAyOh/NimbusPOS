class OrdersController < ApplicationController

  def show
    @order = Order.find(params[:id])
  end

  def new
    @service = Service.find(params[:service_id])
    @order = @service.orders.new
    @extras = Extra.all
    @order.order_extras.build
  end

  def create
    @service = Service.find(params[:service_id])
    @order = @service.orders.create(order_params)

    @service.occupied!
    @order.save!

    redirect_to service_order_path(@service, @order)
  end

  private

  def order_params
    params.require(:order).permit(:start_time, :end_time, order_extras_attributes: [:id, :quantity, :extra_id, :_destroy])
  end

end