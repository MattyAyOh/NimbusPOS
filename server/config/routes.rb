Rails.application.routes.draw do
  namespace :admin do
    resources :extras
    resources :orders
    resources :services

    root to: "orders#index"
  end

  get "/state", to: "app#state"

  put "/create/order", to: "create#order"
  put "/destroy/order", to: "destroy#order"
  put "/update/order", to: "update#order"
  put "/update/order_extra", to: "update#order_extra"
end
