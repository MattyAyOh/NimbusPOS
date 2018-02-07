Rails.application.routes.draw do
  get "/state", to: "app#state"
  get "*path", to: "app#index"

  root "app#index"

  put "/update_order", to: "orders#update"
end
