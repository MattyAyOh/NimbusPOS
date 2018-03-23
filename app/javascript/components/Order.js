import React from "react"
import styled from "styled-components"
import { Link, Redirect } from "react-router-dom"
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
      start_time: this.order && this.order.start_time ? moment(this.order.start_time) : null,
      end_time: this.order && this.order.end_time ? moment(this.order.end_time) : null,
      closed: this.order == null,
    }
  }

  render() {
    return (
      this.state.closed
      ? <Redirect to="/" />
      : <Layout>
          <Links>
            <Link to="/" onClick={this.cancelOrder.bind(this)}>Cancel Order</Link>
            <Link to="/" onClick={this.props.refresh}>Close</Link>
          </Links>

          <h2>{this.service.name} #{this.service.position}</h2>

          <div>
            <Timepicker
              hourOptions={[18,19,20,21,22,23,0,1,2,3,4,5,6]}
              initialValue={this.state.start_time}
              onChange={(chosen_time) => this.timeUpdated("start_time", chosen_time)}
            />

            <Margin>to</Margin>

            <Timepicker
              hourOptions={[18,19,20,21,22,23,0,1,2,3,4,5,6]}
              initialValue={this.state.end_time}
              onChange={(chosen_time) => this.timeUpdated("end_time", chosen_time)}
            />
          </div>

          <TabView
            match={this.props.match}
            tabs={{
              snacks: () => <Extras
                              extras={this.order.extras}
                              items={this.props.state.extras.filter(s => s.extra_type == "snack")}
                              order={this.order}
                              params={this.props.params}
                              refresh={this.props.refresh}
                            />,
              drinks: () => <Extras
                              extras={this.order.extras}
                              items={this.props.state.extras.filter(s => s.extra_type == "drink")}
                              order={this.order}
                              params={this.props.params}
                              refresh={this.props.refresh}
                            />,
              other: () => <Extras
                              extras={this.order.extras}
                              items={this.props.state.extras.filter(s => s.extra_type == "other")}
                              order={this.order}
                              params={this.props.params}
                              refresh={this.props.refresh}
                            />,
              checkout: () => <Checkout
                              extras={this.order.extras}
                              order={this.order}
                              service={this.service}
                              onMount={() => this.ensureEndTime()}
                              persist={this.persist.bind(this)}
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

  ensureEndTime() {
    if(this.state.end_time == null) {
      this.persist({end_time: moment()})
      this.props.refresh()
    }
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

    // Chose a time before this past midnight?
    if(current_hour < 12 && chosen_hour > 12)
      new_time.subtract(1, "day")

    // Chose a time after this coming midnight?
    if(current_hour > 12 && chosen_hour < 12)
      new_time.add(1, "day")

    new_timestamps[field] = new_time

    // If it ends before it starts, swap the timestamps
    if(new_timestamps.start_time > new_timestamps.end_time) {
      let temp = new_timestamps.end_time
      new_timestamps.end_time = new_timestamps.start_time
      new_timestamps.start_time = temp
    }

    this.persist(new_timestamps)
  }

  // takes a `state` object, with:
  // `start_time`: `null` | `moment` object
  // `end_time`: `null` | `moment` object
  persist(state) {
    this.setState({ ...state, persisted: false })

    let params = this.props.params

    if(state.start_time) state.start_time = state.start_time.format()
    if(state.end_time) state.end_time = state.end_time.format()

    jquery.ajax({
      url: "/update/order",
      type: "PUT",
      data: { params, state },
      success: (response) => {
        this.setState({ persisted: response.persisted, closed: response.closed })
        this.props.refresh()
      },
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
