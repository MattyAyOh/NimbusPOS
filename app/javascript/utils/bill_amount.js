import moment from "moment"

const bill_amount = (order, rate, current_time) => {
  if(order) {
    let amount =
      timeComponent(order, rate, current_time)
      + extrasComponent(order)

    return "$" + String(amount.toFixed(2))
  } else
    return null
}

const timeComponent = (order, rate, current_time) => {
  let start_time = order.start_time ? moment(order.start_time) : moment(current_time)
  let end_time   = order.end_time   ? moment(order.end_time)   : moment(current_time)

  // Bill with minute-level granularity
  return end_time.diff(start_time, "minutes") * rate / 60.0
}

const extrasComponent = (order) => {
  const subtotals = order.extras.map((x) => (x.quantity * x.extra.price))
  return subtotals.reduce((running_total, x) => (running_total + x), 0)
}

export default bill_amount
