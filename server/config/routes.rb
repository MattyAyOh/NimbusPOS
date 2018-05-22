Rails.application.routes.draw do
  namespace :admin do
    resources :extras
    resources :orders
    resources :services

    root to: "orders#index"
  end

  put "/create/order", to: "create#order"
  put "/update/order_extra", to: "update#order_extra"

  post "/evaluate", to: "code#evaluate"
end
