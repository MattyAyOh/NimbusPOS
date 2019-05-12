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

  layout = React.createRef()
  bill = React.createRef()
  room_charge = React.createRef()
  divider = React.createRef()
  total_price = React.createRef()
  split = React.createRef()
  confirm = React.createRef()

  render() {
    const hours_spent = (
      DateTime.fromISO(this.props.order.end_time)
        .diff(this.props.order.start_time, "minutes").minutes + 1
    ) / 60.0

    let total_price = this.props.order.bill_amount(
      this.props.order.service.hourly_rate * this.props.room_pricing_factor,
      DateTime.local()
    )

    return (
      <Layout container={this.props.container} ref={this.layout} innerRef={React.createRef()} >
        <Bill container={this.layout} ref={this.bill} innerRef = {React.createRef()} >
          <LineItem
            key={this.props.order.service.name}
            name={this.props.order.service.name}
            rate={`${this.props.order.service.hourly_rate * this.props.room_pricing_factor} / hr`}
            quantity={`${hours_spent.toFixed(1)} hr`}
            amount={(this.props.order.service.hourly_rate * this.props.room_pricing_factor * hours_spent).toFixed(2)}
            container={this.bill} ref={this.room_charge} innerRef = {React.createRef()}
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

          <Divider container={this.bill} ref={this.divider} innerRef = {React.createRef()} />

          <LineItem
            key="total"
            name={<Blue>Total</Blue>}
            amount={<Blue>{total_price}</Blue>}
            container={this.bill} ref={this.total_price} innerRef = {React.createRef()}
          />

          <LineItem
            key="people"
            name="Split by # of people"
            container={this.bill} ref={this.split} innerRef = {React.createRef()}
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
          container={this.bill} ref={this.confirm} innerRef = {React.createRef()}
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
