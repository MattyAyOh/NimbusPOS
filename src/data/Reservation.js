import { observable } from "mobx"

class Reservation {
  @observable image_url = null
  @observable name = null
  @observable price = null
  @observable extra_type = null

  constructor(values) {
    this.image_url = values.image_url
    this.name = values.name
    this.price = values.price
    this.extra_type = values.extra_type
  }
}

// Create a new Reservation object with:
//
// var extra = new Reservation({ start_time: moment(), ... })

export default Reservation;
