import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react"

import Timepicker from "./Timepicker"

/*
 * Props:
 * `startTime`: a `moment` object
 * `endTime`: a `moment` object
 * `onChange`: a callback function that takes a `moment` object.
 * `hourOptions`: a list of allowed values for the hour
 * `minuteOptions`: a list of allowed values for the minute
 */
const TimeSpanInput = observer((props) => (
  <div>
    <Timepicker
      hourOptions={props.hourOptions}
      minuteOptions={props.minuteOptions}
      initialValue={props.store.currentView.order.startTime}
      onChange={(newTime) => props.store.timeUpdated("start_time", newTime)}
    />

    <Margin>to</Margin>

    <Timepicker
      hourOptions={props.hourOptions}
      minuteOptions={props.minuteOptions}
      initialValue={props.store.currentView.order.endTime}
      onChange={(newTime) => props.store.timeUpdated("end_time", newTime)}
    />

    { (props.endTime < props.startTime) &&
      <Warning>
      <span role="img" aria-label="warning">⚠️</span>
      Hold on - the times are in the wrong order.
      </Warning>
    }
  </div>
))

const Margin = styled.span`
  padding: 1rem;
`

const Warning = styled.div`
  padding: 1rem 0;
`

export default TimeSpanInput
