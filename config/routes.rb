Rails.application.routes.draw do
  get "/state", to: "app#state"
  get "*path", to: "app#index"

  root "app#index"
end
