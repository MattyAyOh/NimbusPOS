import { observable } from "mobx"

class Extra {
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

// Create a new Extra object with:
//
// var extra = new Extra({ image_url: "http://jpg.cool/water", ... })

export default Extra;
