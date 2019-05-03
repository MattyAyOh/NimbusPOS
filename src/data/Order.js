import { observable } from "mobx"
import { DateTime } from "luxon"

// JSON from server:
//
// order:
//   cash_handled: null
//   end_time: 2018-07-06T23:44:32.000Z
//   extras: []
//   start_time: 2018-07-06T21:26:37.894Z

class Order {
  @observable cash_handled = null
  @observable end_time = null
  @observable extras = null
  @observable start_time = null

  constructor(values) {
    this.cash_handled = values.cash_handled
    this.extras = values.extras

    this.start_time = DateTime.fromISO(values.start_time)
    this.end_time = DateTime.fromISO(values.end_time)
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
    const subtotals = this.extras.map((x) => (x.quantity * x.extra.price))
    return subtotals.reduce((running_total, x) => (running_total + x), 0)
  }

}

// Create a new Order object with:
//
// var order = new Order({ cash_handled: 20, end_time: "Mahjong", ... })

export default Order;
