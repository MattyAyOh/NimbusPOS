class AppController < ApplicationController
  http_basic_authenticate_with(
    name: "nimbus",
    password: ENV.fetch("PASSWORD"),
    only: :index,
  )

  # Renders the HTML
  # that spins up the single-page React app
  def index
    render layout: false
  end

  # Returns a JSON representation of the application state,
  # used by React to display the frontend
  def state
    render json: {
      services: Service.order(:service_type, :position).as_json,
      extras: Extra.all.as_json,
    }
  end
end
