import Order from "./Order"

// JSON from server:
//
// service:
//   hourly_rate: 20
//   name: Mahjong
//   position: 1
//   service: mahjong
//   current_order:
//     cash_handled: null
//     end_time: 2018-07-06T23:44:32.000Z
//     extras: []
//     start_time: 2018-07-06T21:26:37.894Z

class Service {
  hourly_rate = null
  name = null
  position = null
  service = null
  current_order = null

  constructor(values) {
    this.hourly_rate = values.hourly_rate
    this.name = values.name
    this.position = values.position
    this.service = values.service

    this.current_order = values.current_order
      ? new Order(values.current_order)
      : null

    // Back-reference
    if(this.current_order)
      this.current_order.service = this
  }
}

// Create a new Service object with:
//
// var service = new Service({ hourly_rate: 20, name: "Mahjong", ... })

export default Service;
