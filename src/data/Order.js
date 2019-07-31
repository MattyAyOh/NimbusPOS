import { observable } from "mobx"
import { DateTime } from "luxon"

// JSON from server:
//
// order:
//   closed_at: null
//   end_time: 2018-07-06T23:44:32.000Z
//   order_extras: []
//   start_time: 2018-07-06T21:26:37.894Z

class Order {
  @observable closed_at = null
  @observable end_time = null
  @observable order_extras = null
  @observable start_time = null
  @observable id = null
  @observable service_id = null

  constructor(values) {
    this.id = values.id
    this.service_id = values.service_id
    this.closed_at = values.closed_at
    this.order_extras = values.order_extras

    // TODO raise an issue on Hasura; the 'Z' would be really helpful to include automatically.
    this.start_time = values.start_time && DateTime.fromISO(values.start_time + "Z")
    this.end_time = values.end_time && DateTime.fromISO(values.end_time + "Z")
  }

  bill_amount(rate, current_time) {
    let amount =
      this.timeComponent(rate, current_time)
      + this.extrasComponent()

    return String(amount.toFixed(2))
  }

  timeComponent(rate, current_time) {
    let start_time = this.start_time ? this.start_time : current_time
    let end_time   = this.end_time   ? this.end_time   : current_time

    // Bill with minute-level granularity
    return (end_time.diff(start_time, "minutes").minutes + 1) * rate / 60.0
  }

  extrasComponent() {
    const subtotals = this.order_extras.map((x) => (x.quantity * x.extra.price))
    return subtotals.reduce((running_total, x) => (running_total + x), 0)
  }

}

// Create a new Order object with:
//
// var order = new Order({ closed_at: ..., end_time: "Mahjong", ... })

export default Order;
