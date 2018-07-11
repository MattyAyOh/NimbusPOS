import React from "react"
import styled from "styled-components"
import moment from "moment"
import { observer } from "mobx-react"
import { action, observable, computed } from "mobx"

const blue = "#4a90e2"

/*
 * Props:
 * `initialValue`: a `moment` object
 * `onChange`: a callback function that takes a `moment` object.
 * `hourOptions`: a list of allowed values for the hour
 * `minuteOptions`: a list of allowed values for the minute
 */
@observer
class Timepicker extends React.Component {
  @observable time = null
  @observable open = false

  constructor(props) {
    super(props)
    this.acceptProps(props)
  }

  componentWillUpdate(newProps) {
    this.acceptProps(newProps)
  }

  acceptProps(props) {
    this.time = props.initialValue
  }

  hourOptions() {
    return this.props.hourOptions ||
      Array.apply(null, {length: 24}).map(Number.call, Number)
  }

  minuteOptions() {
    return this.props.minuteOptions ||
      Array.apply(null, {length: 60}).map(Number.call, Number)
  }

  @computed get displayText() {
    if(this.time)
      return this.time.format("HH:mm")
    else
      return ""
  }

  render() {
    let selectedHour = this.time && this.time.hour()
    let selectedMinute = this.time && this.time.minute()

    return (
      <Wrapper>
        <TimeInput
          onFocus={(e) => this.focused(e)}
          onKeyPress={(e) => e.key === "Enter" && this.enter(e)}
          placeholder="--:--"
          value={this.displayText}
        />

        { this.open &&
          <TouchInput>
            <Scroll>
              {this.hourOptions().map((hour) => (
                <TimeOption
                  innerRef={(node) => node && (hour === selectedHour) && node.scrollIntoView()}
                  key={hour}
                  onClick={() => this.hourSelected(hour)}
                  selected={hour === selectedHour}
                >{pad(hour, 2)}</TimeOption>
              ))}
            </Scroll>

            <Scroll>
              {this.minuteOptions().map((minute) => (
                <TimeOption
                  innerRef={(node) => node && (minute === selectedMinute) && node.scrollIntoView()}
                  key={minute}
                  onClick={() => this.minuteSelected(minute)}
                  selected={minute === selectedMinute}
                >{pad(minute, 2)}</TimeOption>
              ))}
            </Scroll>
          </TouchInput>
        }
      </Wrapper>
    )
  }

  @action
  focused(event) {
    event.target.select()

    this.open = true
    this.time = this.time || moment()
  }

  enter(event) {
    event.target.blur()
    this.timeChanged(moment(event.target.value, "HH:mm"))
  }

  hourSelected(hour) {
    let minute = (this.time && this.time.minute()) || 0
    let newTime = moment(`${hour}:${minute}`, "HH:mm")
    this.timeChanged(newTime, true)
  }

  minuteSelected(minute) {
    let hour = this.time.hour()
    let newTime = moment(`${hour}:${minute}`, "HH:mm")
    this.timeChanged(newTime)
  }

  @action
  timeChanged(newTime, leaveOpen = false) {
    this.props.onChange(newTime)

    this.open = leaveOpen
    this.time = newTime
  }
}

function pad(num, size) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}

const TimeInput = styled.input`
  padding: 0.5rem;
`

const Wrapper = styled.div`
  display: inline-block;
`

const TouchInput = styled.div`
  background-color: white;
  color: black;
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 15rem;
  position: fixed;
  width: 10rem;
`

const Scroll = styled.div`
  border: 1px solid grey;
  overflow-y: scroll;
`

const TimeOption = styled.div`
  padding: 0.5rem;
  ${({selected}) => selected && `background-color: ${blue}; color: white;`}
`

export default Timepicker
