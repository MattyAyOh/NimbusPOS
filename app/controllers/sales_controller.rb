class SalesController < ApplicationController

  def index
    @sales = Sale.all
  end

  def create
    @service = Service.find(params[:service_id])
    @order = Order.find(params[:order_id])
    @sale = Sale.new(
      service_id: @service.id,
      order_id: @order.id,
      cash_handled: sales_params[:cash_handled],
      date: Time.now.strftime("%B %d, %Y"),
      weekday: Time.now.strftime("%A"),
      time_spent: @order.time_difference,
      total_bill: @order.total_bill,
    )

    if @sale.save
      @service.open!
      flash[:notice] = "Sale has successfully been recorded!"
      redirect_to services_path
    else
      flash[:notice] = "Sale not successfully recorded."
      redirect_to services_path
    end
  end

  private

  def sales_params
    params.require(:sale).permit(:cash_handled)
  end

end
