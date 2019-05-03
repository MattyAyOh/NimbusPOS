import React from "react"
import styled from "styled-components"
import moment from "moment"
import { observable } from "mobx"
import { observer } from "mobx-react"

import Order from "../data/Order"
import LineItem from "./LineItem"

const blue = "#4a90e2"

@observer
class Checkout extends React.Component {
  @observable num_people = 1

  render() {
    const hours_spent = (
      moment(this.props.order.end_time)
        .diff(this.props.order.start_time, "minutes") + 1
    ) / 60.0

    let total_price = this.props.order.bill_amount(this.props.order.service.hourly_rate * this.props.room_pricing_factor, moment())

    return (
      <Layout>
        <Bill>
          <LineItem
            key={this.props.order.service.name}
            name={this.props.order.service.name}
            rate={`${this.props.order.service.hourly_rate * this.props.room_pricing_factor} / hr`}
            quantity={`${hours_spent.toFixed(1)} hr`}
            amount={(this.props.order.service.hourly_rate * this.props.room_pricing_factor * hours_spent).toFixed(2)}
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
            name={<Blue>Total</Blue>}
            amount={<Blue>{total_price}</Blue>}
          />

          <LineItem
            key="people"
            name="Split by # of people"
            quantity={
              <div>
              {
                [1,2,3,4,5,6,7,8].map(num => (
                  <Button
                    active={this.num_people === num}
                    onClick={() => this.num_people = num }
                  >
                    {num}
                  </Button>
                ))
              }
              </div>
            }
            amount={(total_price / this.num_people).toFixed(2)}
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

const Confirm = styled.button`
  font-size: 1.2rem;
  margin-top: 2rem;
  text-align: center;
`

const Divider = styled.div`
  border-top: 1px solid ${blue};
  height: 1rem;
`

const Button = styled.span`
  background-color: ${({active}) => active ? "white" : blue};
  color: ${({active}) => active ? blue : "white"};
  border: 1px solid ${blue};
  padding: 0.5rem;
`

const Blue = styled.strong`
  color: ${blue};
`

export default Checkout
