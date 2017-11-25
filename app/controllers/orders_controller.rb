class OrdersController < ApplicationController

  def show
    @order = Order.find(params[:id])
  end

  def new
    @service = Service.find(params[:service_id])
    @order = @service.orders.new
    @extras = Extra.all
    Extra.all.each do |extra|
      @order.order_extras.build(extra: extra)
    end
  end

  def create
    @service = Service.find(params[:service_id])
    @order = @service.orders.create(order_params)
    @service.occupied!
    @order.order_extras.map do |f|
      f.price = Extra.find(f.extra_id).price
    end
    @order.save!

    redirect_to service_order_path(@service, @order)
  end

  private

  def order_params
    params.require(:order).permit(:start_time, :end_time, :previous_cost, order_extras_attributes: [:id, :quantity, :extra_id, :_destroy])
  end

end
