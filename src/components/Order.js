import React from "react"
import styled from "styled-components"
import { Link, Redirect } from "react-router-dom"
import moment from "moment"

import TimeSpanInput from "./TimeSpanInput"
import Checkout from "./Checkout"
import Extras from "./Extras"
import TabView from "./TabView"

import server from "../server"

class Order extends React.Component {
  constructor(props) {
    super(props)

    this.service = this.props
      .state
      .services
      .filter(s =>
        s.service === this.props.params.service &&
        s.position === parseInt(this.props.params.number, 10)
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
            <StyledLink to="/" onClick={this.cancelOrder.bind(this)}>Cancel Order</StyledLink>
            <StyledLink to="/" onClick={() => this.props.refresh()}>Close</StyledLink>
          </Links>

          <h2>{this.service.name} #{this.service.position}</h2>

          <TimeSpanInput
            startTime={this.state.start_time}
            endTime={this.state.end_time}
            onStartTimeChange={(newTime) => this.timeUpdated("start_time", newTime)}
            onEndTimeChange={(newTime) => this.timeUpdated("end_time", newTime)}
            hourOptions={[18,19,20,21,22,23,0,1,2,3,4,5,6]}
          />

          <TabView
            match={this.props.match}
            tabs={{
              snacks: () => <Extras
                              extras={this.order.extras}
                              items={this.props.state.extras.filter(s => s.extra_type === "snack")}
                              order={this.order}
                              params={this.props.params}
                              refresh={this.props.refresh}
                            />,
              drinks: () => <Extras
                              extras={this.order.extras}
                              items={this.props.state.extras.filter(s => s.extra_type === "drink")}
                              order={this.order}
                              params={this.props.params}
                              refresh={this.props.refresh}
                            />,
              other: () => <Extras
                              extras={this.order.extras}
                              items={this.props.state.extras.filter(s => s.extra_type === "other")}
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
    server(`
      Service.find_by(
        service_type: ${JSON.stringify(this.props.params.service)},
        position: ${JSON.stringify(this.props.params.number)}
      ).current_order.destroy!
    `).then(() => this.props.refresh())
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

    server(`
      service = Service.find_by(
        service_type: ${JSON.stringify(params.service)},
        position: ${JSON.stringify(params.number)},
      )

      order = service.current_order || Order.create!(service: service)
      result = order.update!(JSON.parse('${JSON.stringify(state)}'))

      { persisted: result, closed: !order.open? }
    `).then((result) => {
      this.setState({ persisted: result.persisted, closed: result.closed })
      this.props.refresh()
    })
  }
}

const StyledLink = styled(Link)`
  color: #fff;
`

const Layout = styled.div`
  background-color: #253241;
  color: #fff;
  display: grid;
  grid-template-rows: 4rem 1fr 1fr 80%;
  height: 100%;
  overflow-y: scroll;
  padding: 0 4rem;
`

const Links = styled.div`
  align-items: flex-end;
  display: flex;
  justify-content: space-between;
`

export default Order
