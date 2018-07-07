import React from "react"
import styled from "styled-components"
import moment from "moment"

import LineItem from "./LineItem"

const blue = "#4a90e2"

class Checkout extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cash_handled: props.order.cash_handled,
    }
  }

  render() {
    const hours_spent = (
      moment(this.props.order.end_time)
        .diff(this.props.order.start_time, "minutes") + 1
    ) / 60.0

    return (
      <Layout>
        <Bill>
          <LineItem
            key={this.props.service.name}
            name={this.props.service.name}
            rate={`${this.props.service.hourly_rate} / hr`}
            quantity={`${hours_spent.toFixed(1)} hr`}
            amount={(this.props.service.hourly_rate * hours_spent).toFixed(2)}
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
            amount={this.props.order.bill_amount(this.props.service.hourly_rate, moment())}
          />
        </Bill>

        <Register>
          Cash Handled:

          <input
            type="number"
            value={this.state.cash_handled || ""}
            onChange={(event) => this.set_cash_handled(event.target.value)}
          />
        </Register>

        <Confirm
          onClick={() => this.props.persist(this.state)}
          disabled={this.state.cash_handled == null}
        >Confirm</Confirm>
      </Layout>
    )
  }

  componentDidMount() {
    this.props.onMount()
  }

  set_cash_handled(value) {
    if(value === "")
      this.setState({cash_handled: null})
    else
      this.setState({cash_handled: value})
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

export default Checkout
