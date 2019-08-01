import { types } from "mobx-state-tree"
import { DateTime } from "luxon"

const NewReservation = types.model({
  start_time: types.maybeNull(types.string),
  end_time: types.maybeNull(types.string),
  service: types.maybeNull(types.string),
  position: types.maybeNull(types.integer),
}).views(self => ({
  get start() {
    return self.start_time
      ? DateTime.fromISO(self.start_time)
      : null
  },
  get end() {
    return self.end_time
      ? DateTime.fromISO(self.end_time)
      : null
  },
})).actions(self => ({
  set_service(service) { self.service = service },
  set_position(position) { self.position = position },
  set_start(start) { self.start_time = start.toISO() },
  set_end(end) { self.end_time = end.toISO() },
  start_set(params) { self.start_time = self.start.set(params).toISO() },
  end_set(params) { self.end_time = self.end.set(params).toISO() },
}))

export default NewReservation
