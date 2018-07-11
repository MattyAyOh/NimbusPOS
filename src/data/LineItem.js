import { observable } from "mobx"

// JSON from server:
//
// extra:
//   ...
// quantity: 1

class LineItem {
  // TODO normalize the data with UUIDs and references
  @observable name = null
  @observable price = null
  @observable quantity = null

  constructor(values) {
    this.name = values.extra.name
    this.price = values.extra.price
    this.quantity = values.quantity
  }
}

// Create a new LineItem object with:
//
// var LineItem = new LineItem({ extra: extra_object, quantity: 1 })

export default LineItem;
