import React from "react"
import styled from "styled-components"
import { DateTime } from "luxon"
import { observer } from "mobx-react"
import { action, observable } from "mobx"

const blue = "#4a90e2"

/*
 * Props:
 * `initialValue`: a `DateTime` object
 * `onChange`: a callback function that takes a `DateTime` object.
 * `hourOptions`: a list of allowed values for the hour
 * `minuteOptions`: a list of allowed values for the minute
 */
@observer
class Timepicker extends React.Component {
  @observable time = null
  @observable enteredText = ""
  @observable open = false

  constructor(props) {
    super(props)

    this.time = this.props.initialValue || DateTime.local()
    this.enteredText = this.props.initialValue ? this.props.initialValue.toLocaleString(DateTime.TIME_24_SIMPLE) : ""
  }

  hourOptions() {
    return this.props.hourOptions ||
      Array.apply(null, {length: 24}).map(Number.call, Number)
  }

  minuteOptions() {
    return this.props.minuteOptions ||
      Array.apply(null, {length: 60}).map(Number.call, Number)
  }

  render() {
    let selectedHour = this.time && this.time.hour
    let selectedMinute = this.time && this.time.minute

    return (
      <Wrapper>
        <TimeInput
          onChange={(e) => this.enteredText = e.target.value }
          onFocus={(e) => this.focused(e)}
          onKeyPress={(e) => e.key === "Enter" && this.enter(e)}
          onSelect={(e) => e.target.selectionStart = e.target.selectionEnd }
          placeholder="--:--"
          value={this.enteredText}
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
    this.time = this.time || DateTime.local()
  }

  enter(event) {
    event.target.blur()
    this.timeChanged(DateTime.fromISO(event.target.value))
  }

  @action
  hourSelected(hour) {
    let minute = this.time.minute
    let newTime = DateTime.fromObject({ hour, minute: minute || 0 })

    this.time = newTime
    this.enteredText = newTime.toLocaleString(DateTime.TIME_24_SIMPLE)
  }

  minuteSelected(minute) {
    let hour = this.time.hour
    let newTime = DateTime.fromObject({ hour, minute })
    this.timeChanged(newTime)
  }

  @action
  timeChanged(newTime) {
    this.props.onChange(newTime)

    this.enteredText = newTime.toLocaleString(DateTime.TIME_24_SIMPLE)
    this.open = false
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
