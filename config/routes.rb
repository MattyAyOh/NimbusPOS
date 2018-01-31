Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root "app#index"
  get "/state", to: "app#state"

  resources :services do
    resources :orders do
      resources :sales
    end
  end

  resources :sales
end
