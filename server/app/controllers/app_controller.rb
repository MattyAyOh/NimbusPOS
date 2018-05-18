class AppController < ApplicationController
  # Returns a JSON representation of the application state,
  # used by React to display the frontend
  def state
    render json: {
      services: Service.order(:service_type, :position).as_json,
      extras: Extra.all.as_json,
    }
  end
end
