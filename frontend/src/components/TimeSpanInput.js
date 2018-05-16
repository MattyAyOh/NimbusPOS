import React from "react"
import styled from "styled-components"
import moment from "moment"

import Timepicker from "./Timepicker"

/*
 * Props:
 * `startTime`: a `moment` object
 * `endTime`: a `moment` object
 * `onChange`: a callback function that takes a `moment` object.
 * `hourOptions`: a list of allowed values for the hour
 * `minuteOptions`: a list of allowed values for the minute
 */
const TimeSpanInput = (props) => (
  <div>
    <Timepicker
      hourOptions={props.hourOptions}
      minuteOptions={props.minuteOptions}
      initialValue={props.startTime}
      onChange={(chosen_time) => props.onStartTimeChange(chosen_time)}
    />

    <Margin>to</Margin>

    <Timepicker
      hourOptions={props.hourOptions}
      minuteOptions={props.minuteOptions}
      initialValue={props.endTime}
      onChange={(chosen_time) => props.onEndTimeChange(chosen_time)}
    />

    { (props.endTime < props.startTime) &&
      <Warning>
      ⚠️ Hold on - the times are in the wrong order.
      </Warning>
    }
  </div>
)

const Margin = styled.span`
  padding: 1rem;
`

const Warning = styled.div`
  padding: 1rem 0;
`

export default TimeSpanInput
