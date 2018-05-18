require "administrate/base_dashboard"

class ServiceDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    orders: Field::HasMany,
    id: Field::Number,
    name: Field::String,
    hourly_rate: Field::Number,
    position: Field::Number,
    service_type: Field::String.with_options(searchable: false),
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = [
    :orders,
    :id,
    :name,
    :hourly_rate,
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = [
    :orders,
    :id,
    :name,
    :hourly_rate,
    :position,
    :service_type,
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = [
    :orders,
    :name,
    :hourly_rate,
    :position,
    :service_type,
  ].freeze

  # Overwrite this method to customize how services are displayed
  # across all pages of the admin dashboard.
  def display_resource(service)
    service.name
  end
end
