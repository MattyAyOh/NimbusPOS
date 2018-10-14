import Order from "./Order"
import moment from "moment"

describe("Order", () => {
  it("calculates the total price", () => {
    // A two-hour booking
    let start_time = moment().subtract(2, "hour")
    let end_time = moment()
    // TODO remove
      .subtract(1, "minute")

    // at $5/hr
    let rate = 5

    let order = new Order({
      start_time,
      end_time,
      extras: [{
        quantity: 2,
        extra: { price: 2 },
      }],
    })

    expect(order.bill_amount(rate)).toEqual("14.00")
  })

  xit("takes the room pricing factor (discount) into account", () => {
    // A two-hour booking
    let start_time = moment().subtract(2, "hour")
    let end_time = moment()
    // TODO remove
      .subtract(1, "minute")

    // at $5/hr
    let rate = 5

    let order = new Order({
      start_time,
      end_time,
      extras: [{
        quantity: 2,
        extra: { price: 2 },
      }],
      room_pricing_factor: 0.5,
    })

    expect(order.bill_amount(rate)).toEqual("9.00")
  })
})
