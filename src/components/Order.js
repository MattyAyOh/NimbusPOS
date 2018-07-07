import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { Link, withRouter } from "react-router-dom"
import moment from "moment"
import { observable } from "mobx"
import { observer } from "mobx-react"

import TimeSpanInput from "./TimeSpanInput"
import Checkout from "./Checkout"
import Extras from "./Extras"
import TabView from "./TabView"
import Loading from "./Loading"

import OrderModel from "../data/Order"
import ExtraModel from "../data/Extra"

@observer
class Order extends React.Component {
  @observable start_time = null
  @observable end_time = null

  constructor(props) {
    super(props)

    if(this.props.order) {
      this.start_time = this.props.order.start_time && moment(this.props.order.start_time)
      this.end_time = this.props.order.end_time && moment(this.props.order.end_time)
    }
  }

  render() {
    return (
      this.props.order == null
      ? <Loading />
      : <Layout>
          <Links>
            <StyledLink
              to="/"
              onClick={() => this.props.onCancel(this.props.order.service)}
            >
              Cancel Order
            </StyledLink>

            <StyledLink to="/">Close</StyledLink>
          </Links>

          <h2>{this.props.order.service.name} #{this.props.order.service.position}</h2>

          <TimeSpanInput
            startTime={this.start_time}
            endTime={this.end_time}
            onStartTimeChange={(newTime) => this.timeUpdated("start_time", newTime)}
            onEndTimeChange={(newTime) => this.timeUpdated("end_time", newTime)}
            hourOptions={[18,19,20,21,22,23,0,1,2,3,4,5,6]}
          />

          <TabView
            match={this.props.match}
            tabs={{
              snacks: () => <Extras
                              extras={this.props.order.extras}
                              items={this.props.extras.filter(s => s.extra_type === "snack")}
                              order={this.props.order}
                              onPersist={this.props.onPersistExtra}
                            />,
              drinks: () => <Extras
                              extras={this.props.order.extras}
                              items={this.props.extras.filter(s => s.extra_type === "drink")}
                              order={this.props.order}
                              onPersist={this.props.onPersistExtra}
                            />,
              other: () => <Extras
                              extras={this.props.order.extras}
                              items={this.props.extras.filter(s => s.extra_type === "other")}
                              order={this.props.order}
                              onPersist={this.props.onPersistExtra}
                            />,
              checkout: () => <Checkout
                              extras={this.props.order.extras}
                              order={this.props.order}
                              onMount={() => this.ensureEndTime()}
                              persist={(state) => this.props.onPersist(state).then((result) => {
                                if(result.closed) this.props.history.push("/")
                              })}
                            />
            }}
          />
        </Layout>
    )
  }

  ensureEndTime() {
    if(this.end_time == null) {
      this.props.onPersist({end_time: moment()}).then((result) => {
        if(result.closed) this.props.history.push("/")
      })
    }
  }

  // `field`: `"start_time"` or `"end_time"`
  // `new_time`: a `moment` object
  timeUpdated(field, new_time) {
    let new_timestamps = {
      start_time: this.start_time,
      end_time: this.end_time,
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
    this.props.onPersist(new_timestamps)
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

Order.propTypes = {
  order: PropTypes.instanceOf(OrderModel),
  extras: PropTypes.arrayOf(PropTypes.instanceOf(ExtraModel)),
}

export default withRouter(Order)
