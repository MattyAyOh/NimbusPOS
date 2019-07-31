import { observable } from "mobx"
import { DateTime } from "luxon"
import { types } from "mobx-state-tree"

import OrderExtra from "./OrderExtra"

// JSON from server:
//
// order:
//   closed_at: null
//   end_time: 2018-07-06T23:44:32.000Z
//   order_extras: []
//   start_time: 2018-07-06T21:26:37.894Z

// TODO change id => a types.identifier parameter
const Order = types.model({
  closed_at: types.maybeNull(types.string),
  end_time: types.maybeNull(types.string),
  order_extras: types.array(OrderExtra),
  start_time: types.string,
  id: types.integer,
  service_id: types.integer,
}).views(self => ({
  get start() {
    // TODO raise an issue on Hasura; the 'Z' would be really helpful to include automatically.
    return self.start_time && DateTime.fromISO(self.start_time + "Z")
  },

  get end() {
    return self.end_time && DateTime.fromISO(self.end_time + "Z")
  },

  bill_amount(rate, current_time) {
    let amount =
      self.timeComponent(rate, current_time)
      + self.extrasComponent()

    return String(amount.toFixed(2))
  },

  timeComponent(rate, current_time) {
    let start = self.start ? self.start : current_time
    let end   = self.end   ? self.end   : current_time

    // Bill with minute-level granularity
    return (end.diff(start, "minutes").minutes + 1) * rate / 60.0
  },

  extrasComponent() {
    const subtotals = self.order_extras.map((x) => (x.quantity * x.extra.price))
    return subtotals.reduce((running_total, x) => (running_total + x), 0)
  },
}))

export default Order
