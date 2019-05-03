import { observable } from "mobx"

class Reservation {
  @observable service_name = null
  @observable service_position = null
  @observable start_time = null
  @observable end_time = null
  @observable id = null

  constructor(values) {
    this.id = values.id
    this.service_name = values.service_name
    this.service_position = values.service_position
    this.start_time = values.start_time
    this.end_time = values.end_time
  }
}

// Create a new Reservation object with:
//
// var extra = new Reservation({ start_time: moment(), ... })

export default Reservation;
