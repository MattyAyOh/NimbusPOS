import React from "react"
import styled from "styled-components"
import { observer } from "mobx-react"

import Timepicker from "./Timepicker"

/*
 * Props:
 * `startTime`: a `DateTime` object
 * `endTime`: a `DateTime` object
 * `onStartTimeChange`: a callback function that takes a `DateTime` object.
 * `onEndTimeChange`: a callback function that takes a `DateTime` object.
 * `hourOptions`: a list of allowed values for the hour
 * `minuteOptions`: a list of allowed values for the minute
 */
@observer
class TimeSpanInput extends React.Component {
  layout = React.createRef()
  emoji_1 = React.createRef()
  start_time = React.createRef()
  margin = React.createRef()
  emoji_2 = React.createRef()
  end_time = React.createRef()
  warning = React.createRef()
  warning_emoji = React.createRef()

  render = () => (
    <div container={this.props.container} ref={this.layout} innerRef={React.createRef()} >
      <Emoji container={this.layout} ref={this.emoji_1} innerRef={React.createRef()} >
        🕙
      </Emoji>
      <Timepicker
        container={this.layout} ref={this.start_time} innerRef={React.createRef()}
        hourOptions={this.props.hourOptions}
        minuteOptions={this.props.minuteOptions}
        initialValue={this.props.startTime}
        onChange={(chosen_time) => this.props.onStartTimeChange(chosen_time)}
      />

      <Margin container={this.layout} ref={this.margin} innerRef={React.createRef()} >
        to
      </Margin>

      <Emoji container={this.layout} ref={this.emoji_2} innerRef={React.createRef()} >
        ⏳
      </Emoji>
      <Timepicker
        container={this.layout} ref={this.end_time} innerRef={React.createRef()}
        hourOptions={this.props.hourOptions}
        minuteOptions={this.props.minuteOptions}
        initialValue={this.props.endTime}
        onChange={(chosen_time) => this.props.onEndTimeChange(chosen_time)}
      />

      { (this.props.endTime < this.props.startTime) &&
        <Warning container={this.layout} ref={this.warning} innerRef={React.createRef()} >
        <span
          container={this.warning} ref={this.warning_emoji} innerRef={React.createRef()}
          role="img" aria-label="warning"
        >
          ⚠️
        </span>
        Hold on - the times are in the wrong order.
        </Warning>
      }
    </div>
  )
}

const Margin = styled.span`
  padding: 1rem;
`

const Warning = styled.div`
  padding: 1rem 0;
`

const Emoji = styled.span`
  font-size: 1.6rem;
  margin-right: 1rem;
`

export default TimeSpanInput
