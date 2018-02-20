import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import moment from "moment"
import jquery from "jquery"

import Timepicker from "./Timepicker"
import Checkout from "./Checkout"
import Extras from "./Extras"
import TabView from "./TabView"

class Order extends React.Component {
  constructor(props) {
    super(props)

    this.service = this.props
      .state
      .services
      .filter(s =>
        s.service == this.props.params.service &&
        s.position == this.props.params.number
      )[0]

    this.order = this.service.current_order

    this.state = {
      start_time: this.order.start_time ? moment(this.order.start_time) : null,
      end_time: this.order.end_time ? moment(this.order.end_time) : null,
    }
  }

  render() {
    return (
      <Layout>
        <Links>
          <Link to="/" onClick={this.cancelOrder.bind(this)}>Cancel Order</Link>
          <Link to="/" onClick={this.props.refresh}>Close</Link>
        </Links>

        <h2>{this.service.name} #{this.service.position}</h2>

        <div>
          <Timepicker
            time={this.state.start_time}
            onChange={(chosen_time) => this.timeUpdated("start_time", chosen_time)}
          />

          <Margin>to</Margin>

          <Timepicker
            time={this.state.end_time}
            onChange={(chosen_time) => this.timeUpdated("end_time", chosen_time)}
          />
        </div>

        <TabView
          tabs={{
            snacks: () => <Extras
                            extras={this.order.extras}
                            items={this.props.state.snacks}
                            order={this.order}
                            params={this.props.params}
                          />,
            drinks: () => <Extras
                            extras={this.order.extras}
                            items={this.props.state.drinks}
                            order={this.order}
                            params={this.props.params}
                          />,
            checkout: () => <Checkout
                            extras={this.order.extras}
                            order={this.order}
                            params={this.props.params}
                            service={this.service}
                          />
          }}
        />
      </Layout>
    )
  }

  cancelOrder() {
    let params = this.props.params

    jquery.ajax({
      url: "/destroy/order",
      type: "PUT",
      data: { params },
      success: (response) => this.props.refresh(),
    })
  }

  // `field`: `"start_time"` or `"end_time"`
  // `new_time`: a `moment` object
  timeUpdated(field, new_time) {
    let new_timestamps = {
      start_time: this.state.start_time,
      end_time: this.state.end_time,
    }

    const current_hour = moment().get("hour")
    const chosen_hour = new_time.get("hour")

    if(current_hour < 12 && chosen_hour > 12)
      new_time.subtract(1, "day")

    new_timestamps[field] = new_time
    this.persist(new_timestamps)
  }

  // takes a `state` object, with:
  // `start_time`: `null` | `moment` object
  // `end_time`: `null` | `moment` object
  persist(state) {
    this.setState({ ...state, persisted: false })

    let params = this.props.params

    let new_state = {
      start_time: state.start_time && state.start_time.format(),
      end_time: state.end_time && state.end_time.format(),
    }

    jquery.ajax({
      url: "/update/order",
      type: "PUT",
      data: { params, state: new_state },
      success: (response) => this.setState({ persisted: response.persisted }),
    })
  }
}

const blue = "#4a90e2"
const Layout = styled.div`
  border-left: 2rem solid ${blue};
  display: grid;
  grid-template-rows: 1fr 2fr 2fr 80%;
  height: 100%;
  overflow-y: scroll;
  padding: 0 4rem;
`

const Margin = styled.span`
  padding: 1rem;
`

const Links = styled.div`
  display: flex;
  justify-content: space-between;
`

export default Order
