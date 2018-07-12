import { observable } from "mobx"

class Reservation {
  @observable start_time = null
  @observable end_time = null
  @observable service = null
  @observable room = null

  constructor(values) {
    this.start_time = values.start_time
    this.end_time = values.start_time
    this.service = values.service
    this.room = values.room
  }
}

export default Reservation
