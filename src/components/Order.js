import React from "react"
import styled from "styled-components"
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
      ? <Loading />
      : <Layout className="orderLayout">
          <Links>
            <StyledLink
              onClick={() => this.props.onCancel(this.props.order.service)}
            >
              Cancel Order
            </StyledLink>

            <StyledLink onClick={() => this.props.assembly.right_half = null} >
              Close
            </StyledLink>
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
            assembly={this.props.assembly}
            url={this.props.url}
            tabs={{
              snacks: () => <Extras
                              items={this.props.assembly.snacks}
                              onPersist={this.props.onPersistExtra}
                              assembly={this.props.assembly}
                            />,
              drinks: () => <Extras
                              items={this.props.assembly.drinks}
                              onPersist={this.props.onPersistExtra}
                              assembly={this.props.assembly}
                            />,
              other: () => <Extras
                              items={this.props.assembly.others}
                              onPersist={this.props.onPersistExtra}
                              assembly={this.props.assembly}
                            />,
              checkout: () => <Checkout
                              extras={this.props.order.extras}
                              order={this.props.order}
                              onMount={() => this.ensureEndTime()}
                              persist={(state) => this.props.onPersist(state).then((result) => {
                                if(result.closed) this.props.assembly.right_half = "/"
                              })}
                              assembly={this.props.assembly}
                            />
            }}
          />
        </Layout>
    )
  }

  ensureEndTime() {
    if(this.end_time == null) {
      this.props.onPersist({end_time: DateTime.local()}).then((result) => {
        if(result.closed) this.props.assembly.right_half = "/"
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
