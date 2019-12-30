import Order from "../data/Order"

let subscriptions = {}

subscriptions[`
subscription {
	orders(where: {closed_at: {_is_null: true}})
	{
		id
		service_id
		closed_at
		start_time
		end_time
		order_extras
		{
			id
			extra_id
			quantity
			extra
			{
				name
				price
			}
		}
	}
}
`] = (model => result => model.set_active_orders(result.data.orders.map(o => Order.create(o))))

subscriptions[`
subscription {
	reservations {
		id
		start_time
		end_time
		service {
			name
			position
		}
} }
`] = model => result => model.set_reservations(result.data.reservations)

subscriptions[`
subscription {
	room_pricing_events(order_by: {created_at: desc}, limit: 1) {
	pricing_factor
} }
`] = model => result => model.set_room_pricing_factor(result.data.room_pricing_events[0].pricing_factor || 1)

subscriptions[`
subscription { extras(order_by: {id: asc}, where: {active: {_eq: true}}) {
    id
    name
    image_url
    extra_type
    price
} }
`] = model => result => model.set_extras(result.data.extras)    

subscriptions[`
subscription { services(order_by: {service_type: asc, position: asc}) {
    id
    hourly_rate
    name
    position
    service_type
} }
`] = model => result => model.set_services(result.data.services)

subscriptions[`
subscription {
    room_discount_day_events(order_by: {created_at: desc}, limit: 1) {
      day_of_week
  } }
`] = model => result => model.set_room_discount_day((
	result.data.room_discount_day_events[0] || { day_of_week: 0 }
).day_of_week)

export default subscriptions
