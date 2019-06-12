import React from "react"
import styled from "styled-components"
import { DateTime } from "luxon"
import { observable, computed } from "mobx"
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

  constructor(props) {
    super(props)

    let start_time = this.order.start_time
    let end_time = this.order.end_time

    this.start_time = start_time && DateTime.fromISO(start_time)
    this.end_time = end_time && DateTime.fromISO(end_time)
  }

  @computed get order() {
    return this.props.assembly.visible_order
  }

  render() {
    return (
      this.order
      ? <Layout className="orderLayout">
          <Links>
            <StyledLink
              onClick={() => this.props.assembly.cancelVisibleOrder()}
            >
              Cancel Order
            </StyledLink>

            <StyledLink onClick={() => this.props.assembly.set_visible_order(null, null)} >
              Close
            </StyledLink>
          </Links>

          <h2>
            {this.props.assembly.visible_service.name}
            #{this.props.assembly.visible_service.position}
          </h2>

          <TimeSpanInput
            startTime={this.start_time}
            endTime={this.end_time}
            onStartTimeChange={(newTime) => this.timeUpdated("start_time", newTime)}
            onEndTimeChange={(newTime) => this.timeUpdated("end_time", newTime)}
            hourOptions={[18,19,20,21,22,23,0,1,2,3,4,5,6]}
          />

          <TabView
            assembly={this.props.assembly}
            tabs={{
              snacks: () => <Extras
                              assembly={this.props.assembly}
                              items={this.props.assembly.snacks}
                            />,
              drinks: () => <Extras
                              assembly={this.props.assembly}
                              items={this.props.assembly.drinks}
                            />,
              other: () => <Extras
                              assembly={this.props.assembly}
                              items={this.props.assembly.others}
                            />,
              checkout: () => <Checkout
                              assembly={this.props.assembly}
                              onMount={() => this.ensureEndTime()}
                            />
            }}
          />
        </Layout>
      : <Loading />
    )
  }

  ensureEndTime() {
    if(this.end_time === null) {
      this.props.assembly.persistVisibleOrder({end_time: DateTime.local()})
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
    this.props.assembly.persistVisibleOrder(new_timestamps)
  }
}

const StyledLink = styled.span`
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
