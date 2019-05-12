import React from "react"
import styled from "styled-components"
import { Link, withRouter } from "react-router-dom"
import { DateTime } from "luxon"
import { observable } from "mobx"
import { observer } from "mobx-react"

import TimeSpanInput from "./TimeSpanInput"
import Checkout from "./Checkout"
import Extras from "./Extras"
import TabView from "./TabView"
import Loading from "./Loading"

@observer
class Order extends React.Component {
  @observable start_time = null
  @observable end_time = null

  loading = React.createRef()
  layout = React.createRef()
  loading = React.createRef()
  links = React.createRef()
  cancel = React.createRef()
  close = React.createRef()
  heading = React.createRef()
  time_span = React.createRef()
  tabs = React.createRef()
  extras = React.createRef()
  checkout = React.createRef()

  constructor(props) {
    super(props)

    if(this.props.order) {
      this.start_time = this.props.order.start_time && DateTime.fromISO(this.props.order.start_time)
      this.end_time = this.props.order.end_time && DateTime.fromISO(this.props.order.end_time)
    }
  }

  render() {
    return (
      this.props.order == null
      ? <Loading container={this.props.container} ref={this.loading} innerRef={React.createRef()} />
      : <Layout className="orderLayout" container={this.props.container} ref={this.layout} innerRef={React.createRef()} >
          <Links container={this.layout} ref={this.links} innerRef={React.createRef()} >
            <StyledLink
              container={this.layout} ref={this.cancel} innerRef={React.createRef()}
              to="/"
              onClick={() => this.props.onCancel(this.props.order.service)}
            >
              Cancel Order
            </StyledLink>

            <StyledLink
              container={this.layout} ref={this.close} innerRef={React.createRef()}
              to="/"
            >Close</StyledLink>
          </Links>

          <h2 container={this.layout} ref={this.heading} innerRef={React.createRef()} >
            {this.props.order.service.name} #{this.props.order.service.position}
          </h2>

          <TimeSpanInput
            container={this.layout} ref={this.time_span} innerRef={React.createRef()}
            startTime={this.start_time}
            endTime={this.end_time}
            onStartTimeChange={(newTime) => this.timeUpdated("start_time", newTime)}
            onEndTimeChange={(newTime) => this.timeUpdated("end_time", newTime)}
            hourOptions={[18,19,20,21,22,23,0,1,2,3,4,5,6]}
          />

          <TabView
            container={this.layout} ref={this.tabs} innerRef={React.createRef()}
            match={this.props.match}
            tabs={{
              snacks: () => <Extras
                              container={this.tabs} ref={this.extras} innerRef={React.createRef()}
                              extras={this.props.order.extras}
                              items={this.props.extras.filter(s => s.extra_type === "snack")}
                              order={this.props.order}
                              onPersist={this.props.onPersistExtra}
                            />,
              drinks: () => <Extras
                              container={this.tabs} ref={this.extras} innerRef={React.createRef()}
                              extras={this.props.order.extras}
                              items={this.props.extras.filter(s => s.extra_type === "drink")}
                              order={this.props.order}
                              onPersist={this.props.onPersistExtra}
                            />,
              other: () => <Extras
                              container={this.tabs} ref={this.extras} innerRef={React.createRef()}
                              extras={this.props.order.extras}
                              items={this.props.extras.filter(s => s.extra_type === "other")}
                              order={this.props.order}
                              onPersist={this.props.onPersistExtra}
                            />,
              checkout: () => <Checkout
                              container={this.tabs} ref={this.checkout} innerRef={React.createRef()}
                              extras={this.props.order.extras}
                              order={this.props.order}
                              onMount={() => this.ensureEndTime()}
                              persist={(state) => this.props.onPersist(state).then((result) => {
                                if(result.closed) this.props.history.push("/")
                              })}
                              room_pricing_factor={this.props.room_pricing_factor}
                            />
            }}
          />
        </Layout>
    )
  }

  ensureEndTime() {
    if(this.end_time == null) {
      this.props.onPersist({end_time: DateTime.local()}).then((result) => {
        if(result.closed) this.props.history.push("/")
      })
    }
  }

  // `field`: `"start_time"` or `"end_time"`
  // `new_time`: a `DateTime` object
  timeUpdated(field, new_time) {
    let new_timestamps = {
      start_time: this.start_time,
      end_time: this.end_time,
    }

    const current_hour = DateTime.local().hour
    const chosen_hour = new_time.hour

    // Chose a time before this past midnight?
    if(current_hour < 12 && chosen_hour > 12)
      new_time = new_time.minus({ days: 1 })

    // Chose a time after this coming midnight?
    if(current_hour > 12 && chosen_hour < 12)
      new_time = new_time.plus({ days: 1 })

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

export default withRouter(Order)
