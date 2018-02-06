class AppController < ApplicationController
  # Renders the HTML
  # that spins up the single-page React app
  def index
    render layout: false
  end

  # Returns a JSON representation of the application state,
  # used by React to display the frontend
  def state
    render json: {
      services: {
        mahjong: Service.where(service_type: "mahjong").order(:position).as_json,
        pool: Service.where(service_type: "pool").order(:position).as_json,
        ktv: Service.where(service_type: "ktv").order(:position).as_json,
      },
      snacks: Extra.where(extra_type: "snack").map(&:as_json),
      drinks: Extra.where(extra_type: "drink").map(&:as_json),
    }
  end
end
