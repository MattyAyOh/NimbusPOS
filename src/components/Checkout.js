import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import moment from "moment"
import { observable } from "mobx"
import { observer } from "mobx-react"

import Order from "../data/Order"
import LineItem from "./LineItem"

const blue = "#4a90e2"

@observer
class Checkout extends React.Component {
  render() {
    const hours_spent = (
      moment(this.props.order.end_time)
        .diff(this.props.order.start_time, "minutes") + 1
    ) / 60.0

    return (
      <Layout>
        <Bill>
          <LineItem
            key={this.props.order.service.name}
            name={this.props.order.service.name}
            rate={`${this.props.order.service.hourly_rate} / hr`}
            quantity={`${hours_spent.toFixed(1)} hr`}
            amount={(this.props.order.service.hourly_rate * hours_spent).toFixed(2)}
          />

          {this.props.extras.map((extra) => (
            <LineItem
              key={extra.extra.name}
              name={extra.extra.name}
              rate={extra.extra.price}
              quantity={extra.quantity}
              amount={extra.quantity * extra.extra.price}
            />
          ))}

          <Divider />

          <LineItem
            key="total"
            name="Total"
            amount={this.props.order.bill_amount(this.props.order.service.hourly_rate, moment())}
          />
        </Bill>

        <Confirm
          onClick={() => this.props.persist({ cash_handled: 0 })}
        >Confirm</Confirm>
      </Layout>
    )
  }

  componentDidMount() {
    this.props.onMount()
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
