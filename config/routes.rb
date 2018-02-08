Rails.application.routes.draw do
  get "/state", to: "app#state"
  get "*path", to: "app#index"

  root "app#index"

  put "/create/order", to: "create#order"
  put "/update/order", to: "update#order"
  put "/update/order_extra", to: "update#order_extra"
end
