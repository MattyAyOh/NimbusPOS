import React from "react"
import TimeSpanInput from "../components/TimeSpanInput"
import { DateTime } from "luxon"
import { types } from "mobx-state-tree"

import OrderExtra from "./OrderExtra"
import Time from "./Time"

// JSON from server:
//
// order:
//   closed_at: null
//   end_time: 2018-07-06T23:44:32.000Z
//   order_extras: []
//   start_time: 2018-07-06T21:26:37.894Z

// TODO change id => a types.identifier parameter
const Order = types.model('Order',
  {
  closed_at: types.maybeNull(types.string),
  order_extras: types.array(OrderExtra),
  id: types.integer,
  service_id: types.integer,

  start_time: Time,
  end_time: types.maybeNull(Time),
}).views(self => ({
  bill_amount(rate, current_time) {
    return String((
      self.timeComponent(rate, current_time) +
      self.extrasComponent()
    ).toFixed(2))
  },

  timeComponent(rate, current_time) {
    let end   = self.end_time || current_time

    // Bill with minute-level granularity
    return (end.diff(self.start_time, "minutes").minutes + 1) * rate / 60.0
  },

  extrasComponent() {
    const subtotals = self.order_extras.map((x) => (x.quantity * x.extra.price))
    return subtotals.reduce((running_total, x) => (running_total + x), 0)
  },

  timespanInput(assembly) {
    return (
      <TimeSpanInput
        startTime={self.start_time}
        endTime={self.end_time}
        onStartTimeChange={(newTime) => this.timeUpdated("start_time", newTime, assembly)}
        onEndTimeChange={(newTime) => this.timeUpdated("end_time", newTime, assembly)}
        hourOptions={[18,19,20,21,22,23,0,1,2,3,4,5,6]}
      />
    )
  }
})).actions(self => ({
  timeUpdated(field, new_time, assembly) {
    const current_hour = DateTime.local().hour
    const chosen_hour = new_time.hour

    // Chose a time before this past midnight?
    if(current_hour < 12 && chosen_hour > 12)
      new_time = new_time.minus({ days: 1 })

    // Chose a time after this coming midnight?
    if(current_hour > 12 && chosen_hour < 12)
      new_time = new_time.plus({ days: 1 })

    self[field] = new_time

    assembly.persistVisibleOrder({
      start_time: self.start_time,
      end_time: self.end_time,
    })
  }
}))

export default Order
