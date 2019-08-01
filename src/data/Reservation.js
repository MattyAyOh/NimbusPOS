import { types } from "mobx-state-tree"
import Service from "./Service"
import Time from "./Time"

const Reservation = types.model({
  id: types.integer,
  service: Service,

  start_time: Time,
  end_time: Time,
})

export default Reservation
