Rails.application.routes.draw do
  namespace :admin do
    resources :extras
    resources :orders
    resources :services

    root to: "orders#index"
  end

  post "/evaluate", to: "code#evaluate"
  get "*path", to: static("index.html")
end
