import { types } from "mobx-state-tree"
import Service from "./Service"
import { DateTime } from "luxon"

const Reservation = types.model({
  id: types.integer,
  start_time: types.string,
  end_time: types.string,
  service: Service,
}).views(self => ({
  get start() { return DateTime.fromISO(self.start_time + "Z") },
  get end() { return DateTime.fromISO(self.end_time + "Z") },
}))

export default Reservation
