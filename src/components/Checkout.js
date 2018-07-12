import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import moment from "moment"
import { observer } from "mobx-react"
import { createViewModel } from "mobx-utils"

import Order from "../data/Order"
import LineItem from "./LineItem"

const blue = "#4a90e2"

@observer
class Checkout extends React.Component {
  constructor(props) {
    super(props)

    this.order = createViewModel(props.store.order)
  }

  render() {
    const hours_spent = (
      moment(this.order.end_time)
        .diff(this.order.start_time, "minutes") + 1
    ) / 60.0

    return (
      <Layout>
        <Bill>
          <LineItem
            key={this.order.service.name}
            name={this.order.service.name}
            rate={`${this.order.service.hourly_rate} / hr`}
            quantity={`${hours_spent.toFixed(1)} hr`}
            amount={(this.order.service.hourly_rate * hours_spent).toFixed(2)}
          />

          {this.order.line_items.map((item) => (
            <LineItem
              key={item.name}
              name={item.name}
              rate={item.price}
              quantity={item.quantity}
              amount={item.quantity * item.price}
            />
          ))}

          <Divider />

          <LineItem
            key="total"
            name="Total"
            amount={this.order.model.bill_amount(this.order.service.hourly_rate, moment())}
          />
        </Bill>

        <Register>
          Cash Handled:

          <input
            type="number"
            value={this.order.cash_handled || ""}
            onChange={(event) => this.set_cash_handled(event.target.value)}
          />
        </Register>

        <Confirm
          onClick={() => this.order.submit() }
          disabled={this.order.cash_handled == null}
        >Confirm</Confirm>
      </Layout>
    )
  }

  set_cash_handled(value) {
    if(value === "")
      this.order.cash_handled = null
    else
      this.order.cash_handled = value
  }
}

const Bill = styled.div`
  display: grid;
`

const Layout = styled.div`
  display: grid;
`

const Register = styled.div`
  display: flex;
  justify-content: space-between;
`

const Confirm = styled.button`
  font-size: 1.2rem;
  margin-top: 2rem;
  text-align: center;
`

const Divider = styled.div`
  border-top: 1px solid ${blue};
  height: 1rem;
`

Checkout.propTypes = {
  order: PropTypes.instanceOf(Order),
}

export default Checkout
