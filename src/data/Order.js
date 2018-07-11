import { observable } from "mobx"
import moment from "moment"
import LineItem from "./LineItem"

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
  @observable line_items = null
  @observable start_time = null

  constructor(values) {
    this.cash_handled = values.cash_handled
    this.end_time = values.end_time
    this.line_items = values.extras.map(x => new LineItem(x))
    this.start_time = values.start_time
  }

  bill_amount(rate, current_time) {
    let amount =
      this.timeComponent(rate, current_time)
      + this.lineItemTotal()

    return String(amount.toFixed(2))
  }

  timeComponent(rate, current_time) {
    let start_time = this.start_time ? moment(this.start_time) : moment(current_time)
    let end_time   = this.end_time   ? moment(this.end_time)   : moment(current_time)

    // Bill with minute-level granularity
    return (end_time.diff(start_time, "minutes") + 1) * rate / 60.0
  }

  lineItemTotal() {
    const subtotals = this.line_items.map((x) => (x.quantity * x.price))
    return subtotals.reduce((running_total, x) => (running_total + x), 0)
  }
}

// Create a new Order object with:
//
// var order = new Order({ cash_handled: 20, end_time: "Mahjong", ... })

export default Order;