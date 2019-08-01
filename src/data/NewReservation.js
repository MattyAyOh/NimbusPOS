import React from "react"
import Time from "./Time"
import TimeSpanInput from "../components/TimeSpanInput"
import { types } from "mobx-state-tree"
import _ from "lodash"

const NewReservation = types.model({
  service: types.maybeNull(types.string),
  position: types.maybeNull(types.integer),

  start_time: types.maybeNull(Time),
  end_time: types.maybeNull(Time),
}).views(self => ({
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
    let dateAttrs = _.pick(
      assembly.reservation_date.luxon.toObject(),
      "year", "month", "day",
    )

    new_time = new_time.set(dateAttrs)
    self[field] = new_time
  },

  set_service(service) { self.service = service },
  set_position(position) { self.position = position },
}))

export default NewReservation
