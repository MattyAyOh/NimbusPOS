class OrdersController < ApplicationController
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
