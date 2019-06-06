import React from "react"
import styled from "styled-components"
import { DateTime } from "luxon"
import { observable } from "mobx"
import { observer } from "mobx-react"
import LineItem from "./LineItem"

const blue = "#4a90e2"

@observer
class Checkout extends React.Component {
  @observable num_people = 1

  get order() {
    return this.props.assembly.visible_order
  }

  render() {
    const hours_spent = (
      DateTime.fromISO(this.order.end_time)
        .diff(this.order.start_time, "minutes").minutes + 1
    ) / 60.0

    let total_price = this.order.bill_amount(
      this.order.service.hourly_rate * this.props.assembly.room_pricing_factor,
      DateTime.local()
    )

    return (
      <Layout>
        <Bill>
          <LineItem
            key={this.order.service.name}
            name={this.order.service.name}
            rate={`${this.order.service.hourly_rate * this.props.assembly.room_pricing_factor} / hr`}
            quantity={`${hours_spent.toFixed(1)} hr`}
            amount={(this.order.service.hourly_rate * this.props.assembly.room_pricing_factor * hours_spent).toFixed(2)}
          />

          {this.order.extras.map((extra) => (
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
          disabled={this.order.end_time < this.order.start_time}
          onClick={() => this.props.assembly.persistVisibleOrder({ closed_at: DateTime.local().toISO() })}
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
