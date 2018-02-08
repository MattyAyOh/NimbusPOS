import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import moment from "moment"
import jquery from "jquery"

import LineItem from "./LineItem"
import Divider from "./Divider"

class Checkout extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cash_handled: props.order.cash_handled,
    }
  }

  render() {
    const hours_spent = moment(this.props.order.end_time)
      .diff(this.props.order.start_time, "hours")

    return (
      <Layout>
        <Bill>
          <LineItem
            key={this.props.service.name}
            name={this.props.service.name}
            rate={`${this.props.service.hourly_rate} / hr`}
            quantity={`${hours_spent} hr`}
            amount={this.props.service.hourly_rate * hours_spent}
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
            name="total"
            amount={this.props.order.bill_amount}
          />
        </Bill>

        <div>
          Cash Handled:
          <input
            value={this.state.cash_handled || ""}
            onChange={(event) => this.setState({cash_handled: event.target.value})}
          />
          <Link to="/" onClick={this.persist}>Confirm</Link>
        </div>
      </Layout>
    )
  }

  persist = () => {
    let state = this.state
    let params = this.props.params

    this.setState({ ...state, persisted: false })

    jquery.ajax({
      url: "/update/order",
      type: "PUT",
      data: { params, state },
      success: (response) => this.setState({ persisted: response.persisted }),
    })
  }
}

const Bill = styled.div`
  display: grid;
`

const Layout = styled.div`
  display: grid;
`

export default Checkout
